import { useDispatch, useSelector } from "react-redux";
import { selectSelectedDay, setDay, setSelectedMovie } from "../../../redux/movieSlice";

function DayPicker() {
    const dispatch = useDispatch();

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const selectedDay = useSelector(selectSelectedDay);

    const handleSelect = (day) => {
        dispatch(setDay(day));
        dispatch(setSelectedMovie(null));
    };

    return (
        <div className="flex justify-center">
            <div className="hidden sm:flex gap-2">
                {days.map((day, index) => (
                    <input
                        type="radio"
                        className="btn btn-outline checked:btn-success first:rounded-l-full last:rounded-r-full"
                        key={index+1}
                        name="day"
                        aria-label={day}
                        checked={index+1 === selectedDay}
                        onChange={() => handleSelect(index+1)}
                    />
                ))}
            </div>

            <div className="sm:hidden dropdown dropdown-bottom">
                <div tabIndex={0} role="button" className="btn m-1">
                    {selectedDay || "Válassz napot"}
                </div>
                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                    {days.map((day, index) => (
                        <li key={index+1}>
                            <button
                                className={day === selectedDay ? "btn btn-success w-full" : "btn btn-outline w-full"}
                                onClick={() => handleSelect(index+1)}>
                                {day}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default DayPicker;
