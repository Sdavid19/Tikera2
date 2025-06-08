import { useDispatch, useSelector } from "react-redux";
import {selectSelectedWeek, setWeek } from "../../../redux/movieSlice";

function WeekPicker() {
    const dispatch = useDispatch();

    const selectedWeek = useSelector(selectSelectedWeek);

    const handleWeekChanged = (amount) => {
        const week = selectedWeek;
        const newWeek = week + amount;
        if(newWeek >= 1 && newWeek <= 52) dispatch(setWeek(week + amount))
    }

    return (
        <div className="flex justify-center mt-5 gap-3">
            <button onClick={() => handleWeekChanged(-1)} className="cursor-pointer">{'<'}</button>
            <span>{ selectedWeek }. week</span>
            <button onClick={() => handleWeekChanged(1)} className="cursor-pointer">{ '>' }</button>
        </div>
    );
}

export default WeekPicker;
