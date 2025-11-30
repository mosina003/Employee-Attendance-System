import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { FaSignOutAlt, FaUser, FaUserCircle } from 'react-icons/fa';

function Navbar() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    window.location.href = user?.role === 'manager' ? '/manager/login' : '/employee/login';
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              to={user?.role === 'manager' ? '/manager/dashboard' : '/employee/dashboard'}
              className="text-xl font-bold text-gray-800 hover:text-blue-600 transition"
            >
                 📊 AttendX
            </Link>
            
            {/* Navigation Links */}
            <div className="ml-10 flex items-center space-x-6">
              <Link
                to={user?.role === 'manager' ? '/manager/dashboard' : '/employee/dashboard'}
                className="text-gray-700 hover:text-blue-600 font-medium transition "
              >
                Dashboard
              </Link>
              
              {user?.role === 'manager' ? (
                <>
                  <Link
                    to="/manager/attendance"
                    className="text-gray-700 hover:text-blue-600 font-medium transition"
                  >
                    Attendance
                  </Link>
                  <Link
                    to="/manager/calendar"
                    className="text-gray-700 hover:text-blue-600 font-medium transition"
                  >
                    Calendar
                  </Link>
                  <Link
                    to="/manager/reports"
                    className="text-gray-700 hover:text-blue-600 font-medium transition"
                  >
                    Reports
                  </Link>
                </>
              ) : (
                <Link
                  to="/employee/attendance"
                  className="text-gray-700 hover:text-blue-600 font-medium transition"
                >
                  My Attendance
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to={user?.role === 'manager' ? '/manager/profile' : '/employee/profile'}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              <FaUserCircle className="text-xl" />
              <div className="text-sm">
                <p className="font-semibold">{user?.name}</p>
                <p className="text-gray-500 capitalize text-xs">{user?.role}</p>
              </div>
            </Link>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
