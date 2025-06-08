import MovieCard from './MovieCard';
import { useDispatch, useSelector } from 'react-redux';
import {selectSelectedDay, selectSelectedMovie, selectSelectedWeek, setSelectedMovie } from '../../../redux/movieSlice';
import { useGetMoviesByWeekQuery } from '../../../services/movieApi';

function MovieList() {

  const dispatch = useDispatch();

  const selectedMovie = useSelector(selectSelectedMovie);
  const selectedDay = useSelector(selectSelectedDay);
  const selectedWeek = useSelector(selectSelectedWeek);

  const { data: movieData, isLoading, isError } = useGetMoviesByWeekQuery(selectedWeek, {
    refetchOnMountOrArgChange: true,
  });
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  if (isLoading) return <div>Loading...</div>;
  if (isError || !movieData) return <div>Error getting data.</div>;

  const filteredMovies = movieData.filter((movie) => movie.screenings.some((s) => s.week_day === selectedDay));

  return (
    <div className='p-5 px-4 sm:px-6 md:px-10'>
      <div className="hidden lg:inline-flex btn btn-success pointer-events-none">{days[selectedDay-1]}</div>
      {filteredMovies && filteredMovies.length > 0 ? 
        <div className='gap-3 sm:gap-3 md:gap-3 py-3 px-1 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 justify-items-center overflow-y-auto h-full scroll-hidden'>
          {filteredMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onClick={() => dispatch(setSelectedMovie(movie))}
              highlighted={selectedMovie && movie.id == selectedMovie.id}
            />
          ))}
        </div>
       : 
        <div className='mt-5 text-xl'>There are no screenings this day!</div>
      }
    </div>
  );
}

export default MovieList;
