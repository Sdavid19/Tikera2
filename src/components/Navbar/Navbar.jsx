import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout, selectUser } from '../../redux/authSlice';
import toast from "react-hot-toast";

function Navbar() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  const handeLogout = () => {
    dispatch(logout());
    localStorage.removeItem("auth");
    toast.success("Successfully logged out!");
    navigate('/');
  }

  return (
    <div className="navbar bg-base-100 shadow-sm px-4">
      <div className="flex-1 flex items-center">
        <Link to="/" className="btn btn-ghost text-xl normal-case mr-6">Tikera</Link>
        
        {user && user.role === "admin" && (
          <>
            {/* Large screen horizontal menu */}
            <ul className="menu menu-horizontal px-1 hidden lg:flex">
              <li><Link to="/admin/addMovie" className="rounded-btn">Add movie</Link></li>
              <li><Link to="/admin/addScreening" className="rounded-btn">Add screening</Link></li>
            </ul>

            {/* Small screen dropdown */}
            <div className="dropdown lg:hidden">
              <div tabIndex={0} role="button" className="btn btn-ghost">
                Admin
              </div>
              <ul tabIndex={0} className="menu dropdown-content z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                <li><Link to="/admin/addMovie">Add movie</Link></li>
                <li><Link to="/admin/addScreening">Add screening</Link></li>
              </ul>
            </div>
          </>
        )}

        {user && user.role !== "admin" && (
          <ul className="menu menu-horizontal px-1">
            <li><Link to="/my-reservations" className="rounded-btn">My bookings</Link></li>
          </ul>
        )}
      </div>

      <div className="flex-none">
        {user ? (
          <div className="flex items-center gap-2">
            <span className="font-medium">{user.name}</span>
            <button 
              className="btn btn-outline btn-error btn-sm"
              onClick={handeLogout}
            >
              Log out
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link to="/login" className="btn btn-outline btn-success btn-sm">Login</Link>
            <Link to="/signup" className="btn btn-success btn-sm">Sign up</Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
