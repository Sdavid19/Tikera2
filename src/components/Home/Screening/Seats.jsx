import { useDispatch, useSelector } from "react-redux";
import { addSelectedSeat, removeSelectedSeat, selectMaxSeatsToPick, selectSeats, selectSelectedScreeningId, setSelectedSeats } from "../../../redux/movieSlice";
import { useGetSingleScreeningQuery } from "../../../services/movieApi";
import { useCallback, useEffect, useState } from "react";
import Free from "../../../assets/seats/Free.svg";
import Taken from "../../../assets/seats/Taken.svg";
import Selected from "../../../assets/seats/Selected.svg";

function Seats() {
  const dispatch = useDispatch();
  const selectedScreeningId = useSelector(selectSelectedScreeningId);
  const selectedSeats = useSelector(selectSeats);
  const seatsToPick = useSelector(selectMaxSeatsToPick);

  const { data: selectedScreening, isLoading, isError } = useGetSingleScreeningQuery(selectedScreeningId, {
    skip: !selectedScreeningId,
  });

  const icons = [Free, Taken, Selected];

  const getSeatState = useCallback(
    (row, seat) => {
      return selectedScreening?.bookings?.some(t => t.row === row + 1 && t.seat === seat + 1) ? 1 : 0;
    },
    [selectedScreening]
  );

  const buildMatrix = useCallback(() => {
    if (!selectedScreening) return [];
    const { rows, seatsPerRow } = selectedScreening.room;
    return Array.from({ length: rows }, (_, i) =>
      Array.from({ length: seatsPerRow }, (_, j) => {
        const isTaken = getSeatState(i, j);
        const isSelected = selectedSeats.some(s => s.row === i && s.seat === j);
        return isTaken ? 1 : isSelected ? 2 : 0;
      })
    );
  }, [selectedScreening, getSeatState, selectedSeats]);

  const [seatingMatrix, setSeatingMatrix] = useState([]);

  useEffect(() => {
    if (selectedScreening) {
      setSeatingMatrix(buildMatrix());
    }
  }, [buildMatrix, selectedScreening]);

  useEffect(() => {
    if (selectedSeats.length > seatsToPick) {
      const seatsToKeep = selectedSeats.slice(0, seatsToPick);
      dispatch(setSelectedSeats(seatsToKeep));
    }
  }, [seatsToPick, selectedSeats, dispatch]);

  const setSelected = (row, seat) => {
    const currentState = seatingMatrix[row][seat];

    if (currentState === 0 && selectedSeats.length < seatsToPick) {
      dispatch(addSelectedSeat({ row, seat }));
    } else if (currentState === 2) {
      dispatch(removeSelectedSeat({ row, seat }));
    }
  };

  if (isLoading) return <p>Loading seats...</p>;
  if (isError || !selectedScreening) return <p>Error loading screening data.</p>;

  return (
    <div className="flex flex-col items-center gap-2 mx-auto my-auto">
      {seatingMatrix.map((rowArr, i) => (
        <div key={i} className="flex gap-1">
          <span className="flex justify-center items-center p-1">{i + 1}</span>
          {rowArr.map((seat, j) => (
            <img
              key={`${i}-${j}`}
              src={icons[seat]}
              onClick={() => setSelected(i, j)}
              className={`w-6 h-6 md:w-8 md:h-8 lg:w-9 lg:h-9 ${seat !== 1 ? 'cursor-pointer' : ''}`}
              alt=""
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default Seats;
