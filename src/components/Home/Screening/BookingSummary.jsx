import { useDispatch, useSelector } from "react-redux";
import {
  bookSelectedSeats,
  selectSeats,
  selectSelectedMovie,
  selectSelectedScreening,
  selectSelectedTickets,
} from "../../../redux/movieSlice";

import { useBookSeatsMutation } from "../../../services/movieApi";
import toast from "react-hot-toast";
import { selectUser } from "../../../redux/authSlice";

function BookingSummary() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser)
  const selectedMovie = useSelector(selectSelectedMovie);
  const selectedScreening = useSelector(selectSelectedScreening);
  const selectedTickets = useSelector(selectSelectedTickets);
  const selectedSeats = useSelector(selectSeats);

  const [bookSeats, { isLoading }] = useBookSeatsMutation();

  const handleBooking = async () => {
    if (!selectedScreening) return;
    const body = {
      screening_id: selectedScreening.id,
      seats: selectedSeats.map(s => ({
        row: s.row + 1,
        number: s.seat + 1
      })),
      ticket_types: selectedTickets
        .filter(t => t.tickerNum > 0)
        .map(t => ({
          type: t.type.toLowerCase(),
          quantity: t.tickerNum
        }))
    };

    try {
      await bookSeats(body).unwrap();
      dispatch(bookSelectedSeats(selectedSeats));
      toast.success('Successful booking!');
    } catch (error) {
      console.error("Hiba a foglalás során:", error);
      toast.error(`Error booking tikcets! ${error.data.message}!`);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-6 border-1 border-gray-500 p-5 rounded-xl">
      <div className="w-full md:w-1/2 max-w-md">
        <h2 className="text-xl text-center md:text-left">{selectedMovie?.title}</h2>
        <p className="opacity-70 text-center md:text-left">{selectedScreening?.weekday}</p>

        <div className="pt-2">
          {selectedTickets.map(
            (t, index) =>
              t.tickerNum > 0 && (
                <div key={index} className="flex justify-between w-full max-w-xs mx-auto md:mx-0">
                  <span>
                    {t.tickerNum}x {t.type}
                  </span>
                  <span>{t.price * t.tickerNum} Ft</span>
                </div>
              )
          )}
        </div>

        <div className="divider m-0"></div>

        <h3 className="text-center md:text-left">Seats</h3>
        <div className="text-center md:text-left">
          {selectedSeats.map((s, index) => (
            <span key={index}>
              {s.row + 1}. row {s.seat + 1}. seat
              {index < selectedSeats.length - 1 && ", "}
            </span>
          ))}
        </div>

        <div className="divider m-0"></div>
      </div>

      <div className="w-full md:w-1/2 flex justify-center md:justify-start">
        <button
          className="btn btn-success w-52 mx-auto"
          onClick={handleBooking}
          disabled={isLoading || !user}
        >
          {isLoading ? "Booking..." : "Complete booking"}
        </button>
      </div>
    </div>
  );
}

export default BookingSummary;
