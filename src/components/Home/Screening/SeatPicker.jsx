import TicketPicker from "./TicketPicker";
import Seats from "./Seats";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../../redux/authSlice";
import { useDeleteScreeningMutation } from "../../../services/movieApi";
import toast from "react-hot-toast";
import { removeScreeningFromSelectedMovie, selectSelectedScreeningId, setSelectedScreening } from "../../../redux/movieSlice";

function SeatPicker() {

    const navigate = useNavigate();
    const user = useSelector(selectUser);
    const dispatch = useDispatch();
    const [deleteScreening] = useDeleteScreeningMutation();
    const selectedScreening = useSelector(selectSelectedScreeningId);

    const handleEditClicked = () => {
      navigate(`/admin/AddScreening/${selectedScreening}`);
    }

    const handleDeleteClicked = async () => {
        try {
        await deleteScreening(selectedScreening).unwrap();
        toast.success("Screening successfully deleted!");
        dispatch(removeScreeningFromSelectedMovie(selectedScreening));
        dispatch(setSelectedScreening(null))
        } catch (error) {
            toast.error("Error deleting screening!")
            console.error(error);
        }
      }

    return (
        <div className="grid gap-10 h-full border-1 border-gray-500  p-5 rounded-xl relative">
            <div className="absolute top-2 right-2 flex gap-2 sm:grid">
                {user && user.role === 'admin' &&
                <>
                    <button onClick={() => handleEditClicked()} className="btn btn-outline btn-xs btn-success">Edit</button>
                    <button onClick={() => handleDeleteClicked()} className="btn btn-outline btn-xs btn-error">Delete</button>
                </>}
            </div>
            <div className="flex flex-col md:flex-row">
                <TicketPicker/>
                <div className="divider lg:divider-horizontal"></div>
                <Seats />
            </div>
        </div>
    );
}

export default SeatPicker;