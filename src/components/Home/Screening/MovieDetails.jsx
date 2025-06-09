import { useDispatch, useSelector } from "react-redux";
import { selectSelectedDay, selectSelectedMovie, setSelectedMovie, setSelectedScreening } from "../../../redux/movieSlice";
import { selectUser } from "../../../redux/authSlice";
import { useNavigate } from "react-router-dom";
import { useDeleteMovieMutation } from "../../../services/movieApi";
import toast from "react-hot-toast";

function MovieDetails() {
    const dispatch = useDispatch();
    const selectedMovie = useSelector(selectSelectedMovie);
    const selectedDay = useSelector(selectSelectedDay);
    const selectedScreening = useSelector(state => state.movieScreening.selectedScreeningId);
    const user = useSelector(selectUser);
    const navigate = useNavigate();
    const [deleteMovie] = useDeleteMovieMutation();

  const screenings = [...selectedMovie.screenings]
    .filter(x => x.week_day === selectedDay)
    .sort((a, b) => a.start_time.localeCompare(b.start_time));
  
  
  const handleDayClick = (screening) => {
        const seatNum = screening.room.rows * screening.room.seatsPerRow;
        if (screening.bookings.length !== seatNum) {
            dispatch(setSelectedScreening(screening.id));
        }
  };
  
  const handleEditClicked = (id) => {
    navigate(`/admin/AddMovie/${ id }`);
  }

  const handleDeleteClicked = async (id) => {
    try {
      await deleteMovie(id).unwrap();
      toast.success("Movie successfully deleted!");
      dispatch(setSelectedMovie(null))
    } catch (error) {
      toast.error("Error deleting movie!")
      console.error(error);
    }
  }

 return (
  <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 sm:h-[12.5rem]">
    <img
      src={selectedMovie.image_path}
      alt="No image"
      className="rounded-2xl object-contain h-48 sm:h-full w-auto"
    />
    <div className="flex flex-col gap-2 max-w-full overflow-hidden">
       <h2 className="text-2xl">{selectedMovie.title}
         {user && user.role === 'admin' &&  
           <>
           <button className="btn btn-outline btn-success btn-xs ms-2 me-1"
           onClick={() => handleEditClicked(selectedMovie.id)}
           >Edit</button>
           <button className="btn btn-outline btn-error btn-xs ms-2 me-1"
           onClick={() => handleDeleteClicked(selectedMovie.id)}
           >Delete</button>
           </>}
       </h2>
      <p>{selectedMovie.release_year}</p>
      <p className="text-sm break-words whitespace-pre-wrap">{selectedMovie.description}</p>
      <div className="flex flex-wrap w-full gap-2">
        {screenings.length === 0 ? (
          <span>No screenings available for this date.</span>
        ) : (
          screenings.map((screening) => {
            const seatNum = screening.room.rows * screening.room.seatsPerRow;
            const isFull = screening.bookings.length === seatNum;

            return (
              <span
                key={screening.id}
                onClick={() => !isFull && handleDayClick(screening)}
                className={`badge cursor-pointer transition-opacity duration-200 ${
                  isFull
                    ? "opacity-30 pointer-events-none border-white"
                    : screening.id === selectedScreening
                    ? "bg-success text-neutral border-success"
                    : "bg-transparent border-white hover:opacity-80"
                }`}
              >
                {screening.start_time}
              </span>
            );
          })
        )}
      </div>
    </div>
  </div>
);

}

export default MovieDetails;