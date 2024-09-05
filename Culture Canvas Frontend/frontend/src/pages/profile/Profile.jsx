import "./profile.scss";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn, FaPinterestP } from "react-icons/fa"
import { IoLocationOutline } from "react-icons/io5"
import { AiOutlineGlobal } from "react-icons/ai";
import { AiOutlineMail, AiOutlineMore } from "react-icons/ai";
import Posts from "../../components/posts/Posts"

const Profile = () => {
  return (
    <div className="profile">
      <div className="images">
        <img
          src="https://images.pexels.com/photos/13440765/pexels-photo-13440765.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt=""
          className="cover"
        />
        <img
          src="https://images.pexels.com/photos/14028501/pexels-photo-14028501.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load"
          alt=""
          className="profilePic"
        />
      </div>
      <div className="profileContainer">
        <div className="uInfo">
          <div className="left">
            <a href="http://facebook.com">
              <FaFacebookF size="2rem" />
            </a>
            <a href="http://facebook.com">
              <FaInstagram size="2rem" />
            </a>
            <a href="http://facebook.com">
              <FaTwitter size="2rem" />
            </a>
            <a href="http://facebook.com">
              <FaLinkedinIn size="2rem" />
            </a>
            <a href="http://facebook.com">
              <FaPinterestP size="2rem" />
            </a>
          </div>
          <div className="center">
            <span>Jane Doe</span>
            <div className="info">
              <div className="item">
                <IoLocationOutline />
                <span>USA</span>
              </div>
              <div className="item">
                <AiOutlineGlobal />
                <span>culturecanvas.dev</span>
              </div>
            </div>
            <button>follow</button>
          </div>
          <div className="right">
            <AiOutlineMail />
            <AiOutlineMore />
          </div>
        </div>
      <Posts/>
      </div>
    </div>
  );
};

export default Profile;
