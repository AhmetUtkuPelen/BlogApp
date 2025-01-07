import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../Assets/logo.png";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/Store";
import { useDispatch } from "react-redux";
import { toggleTheme } from "../../Redux/Slices/ThemeSlice";
import axios from "axios";
import { toast } from "react-toastify";
import { signOutSuccess } from "../Redux/Slices/UserSlice";

const Header = () => {
  const currentUser = useSelector((state: RootState) => state.user);

  const dispatch = useDispatch();

  const theme = useSelector((state: RootState) => state.theme);

  const path = useLocation().pathname;

  // ? LOGOUT USER ? \\
  const UserHandleLogout = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/users/logout`, {
        withCredentials: true,
      });

      // Dispatch before navigation
      dispatch(signOutSuccess());

      // Clear all storage
      localStorage.clear();
      sessionStorage.clear();

      // Force reload and redirect
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Error logging out");
    }
  };
  // ? LOGOUT USER ? \\

  return (
    <Navbar className="border-b-2">
      <Link to="/" className="self-center whitespace-nowrap w-40">
        <img src={Logo} alt="" />
      </Link>

      <form>
        <TextInput
          type="text"
          placeholder="Search"
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline"
        />
      </form>

      <Button className="w-12 h-10 lg:hidden" color="gray" pill>
        <AiOutlineSearch />
      </Button>

      <div className="flex gap-2 md:order-2">
        <Button
          className="w-12 h-10 hidden sm:inline"
          color="gray"
          pill
          onClick={() => dispatch(toggleTheme())}
        >
          {theme.theme === "dark" ? <FaMoon /> : <FaSun />}
        </Button>

        {currentUser ? (
          <Dropdown
            className="text-center"
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt="user image"
                img={currentUser?.currentUser?.profilePicture}
                rounded
              />
            }
          >
            <Dropdown.Header>
              {currentUser?.currentUser && (
                <>
                  <span className="block text-md text-blue-600 font-bold">
                    {currentUser.currentUser.username}
                  </span>
                  <br />
                  <span className="block text-md truncate text-gray-500">
                    {currentUser.currentUser.email}
                  </span>
                </>
              )}
            </Dropdown.Header>

            {currentUser?.currentUser ? (
              // Show these items when user is logged in
              <>
                <Link to="/dashboard?tab=profile">
                  <Dropdown.Item className="text-blue-600 text-center justify-center">
                    PROFILE
                  </Dropdown.Item>
                </Link>
                <Dropdown.Divider />
                <Dropdown.Item
                  className="text-red-600 text-center justify-center"
                  onClick={UserHandleLogout}
                >
                  LOG OUT
                </Dropdown.Item>
              </>
            ) : (
              // Show these items when user is not logged in
              <>
                <Link to="/register">
                  <Dropdown.Item className="text-blue-600 text-center justify-center">
                    REGISTER
                  </Dropdown.Item>
                </Link>
                <Dropdown.Divider />
                <Link to="/login">
                  <Dropdown.Item className="text-blue-600 text-center justify-center">
                    LOGIN
                  </Dropdown.Item>
                </Link>
              </>
            )}
          </Dropdown>
        ) : (
          <Link to="/register">
            <Button color="blue" className="ml-2" outline>
              REGISTER
            </Button>
          </Link>
        )}

        <Navbar.Toggle />
      </div>

      <Navbar.Collapse>
        <Navbar.Link active={path === "/"} as={"div"}>
          <Link to="/">HOME</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/about"} as={"div"}>
          <Link to="/about">ABOUT</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/projects"} as={"div"}>
          <Link to="/projects">PROJECTS</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/dashboard"} as={"div"}>
          <Link to="/dashboard">DASHBOARD</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
