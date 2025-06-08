import { useSelector } from "react-redux";
import { DayPicker, WeekPicker } from "./DayPicker";
import { Screening } from "./Screening";
import { MovieList } from "./MovieList"
import { selectSelectedMovie } from "../../redux/movieSlice";

function Home() {
    const selectedMovie = useSelector(selectSelectedMovie);
    return (
    <div className="px-2 pt-5">
      <DayPicker />
      <WeekPicker  />
      <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1fr] gap-4 items-start">
        <MovieList />
        {selectedMovie && <Screening />}
      </div>
    </div>
    )
}

export default Home;