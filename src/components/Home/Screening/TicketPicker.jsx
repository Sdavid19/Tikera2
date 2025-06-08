import { useDispatch, useSelector } from "react-redux";
import { selectMaxSeatsToPick, selectSeats, selectSelectedTickets, updateTicketCount } from "../../../redux/movieSlice";

function TicketPicker() {
  const dispatch = useDispatch();
  const selectedSeats = useSelector(selectSeats);
  const ticketOptions = useSelector(selectSelectedTickets);
  const ticketsToPick = useSelector(selectMaxSeatsToPick);

  const changeAmount = (index, amount) => {
    const { type } = ticketOptions[index];
    dispatch(updateTicketCount({ type, delta: amount }));
  };

  const totalPrice = ticketOptions.reduce((sum, t) => sum + t.tickerNum * t.price, 0);

  return (
    <div className="flex flex-col md:grid-cols-1 md:w-60 h-72 gap-10 py-5 md:py-0">
      <div className="grid md:h-40 lg:h-36">
        {ticketOptions.map((ticket, index) => (
          <div key={index} className="flex justify-between items-center">
            <div className="my-2 md:my-0">
              <p className="text-sm">{ticket.type}</p>
              <p className="text-sm">{ticket.price} Ft</p>
            </div>
            <div className="flex items-center gap-1">
              <button
                className="btn bg-white text-black btn-xs"
                onClick={() => changeAmount(index, -1)}
              >
                -
              </button>
              <input
                type="number"
                value={ticket.tickerNum}
                readOnly
                className="w-8 h-6 text-center border border-success rounded-sm"
              />
              <button
                className="btn bg-white text-black btn-xs"
                onClick={() => changeAmount(index, 1)}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      {ticketsToPick > 0 && (
        <div className="grid gap-5">
          <div className="flex justify-between items-center">
            <p>Total:</p>
            <p>{totalPrice} Ft</p>
          </div>
          <div className="grid items-center mt-2">
            <p className="text-center">Choose seats!</p>
            <p className="text-center">
              {selectedSeats.length} / {ticketsToPick} selected
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default TicketPicker;
