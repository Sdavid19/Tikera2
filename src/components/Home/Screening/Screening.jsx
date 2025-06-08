import MovieDetails from "./MovieDetails";
import BookingSummary from "./BookingSummary"
import SeatPicker from "./SeatPicker";
import { useSelector } from "react-redux";
import { selectMaxSeatsToPick, selectSeats, selectSelectedMovie, selectSelectedScreening } from "../../../redux/movieSlice";

function Screening() {

const selectedScreening = useSelector(selectSelectedScreening);
    const selectedMovie = useSelector(selectSelectedMovie);
    const selectedSeats = useSelector(selectSeats);
    const seatsToPick = useSelector(selectMaxSeatsToPick);

    const canShowSummary =
        selectedScreening &&
        selectedSeats.length > 0 &&
        selectedSeats.length === seatsToPick;

    return (
        <div className="grid items-start p-5 mt-12 gap-7 border-1 border-gray-500 rounded-xl">
            <MovieDetails />
            {selectedMovie && selectedScreening && (
            <SeatPicker />
            )}
            {canShowSummary && <BookingSummary />}
        </div>
    );
}

export default Screening;