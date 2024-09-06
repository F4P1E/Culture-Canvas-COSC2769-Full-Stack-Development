import "./navbar.scss";
import { FaHome, FaSun, FaMoon, FaTh, FaRegBell, FaRegEnvelope, FaUser, FaSearch } from "react-icons/fa"
import { Link } from "react-router-dom";
import { useContext } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/authContext";

const Navbar = () => {
  const { toggle, darkMode } = useContext(DarkModeContext);
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="navbar">
      <div className="left">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span>Culture Canvas</span>
        </Link>
        <FaHome />
        {darkMode ? (
          <FaSun onClick={toggle} />
        ) : (
          <FaMoon onClick={toggle} />
        )}
        <FaTh />
        <div className="search">
          <FaSearch />
          <input type="text" placeholder="Search..." />
        </div>
      </div>
      <div className="right">
        <FaUser />
        <FaRegEnvelope />
        <FaRegBell />
        <div className="user">
          <img
            src={currentUser.profilePic}
            alt=""
          />
          <span>{currentUser.name}</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;