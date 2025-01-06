import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";

const Footer = () => {
  const date = new Date();
  const GetCurrentDate = date.getFullYear();

  return (
    <footer className="bg-white rounded-lg shadow m-4 dark:bg-gray-800">
      <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between text-center">
        <span className="text-lg text-gray-500 text-center sm:text-center dark:text-gray-400">
          <span className="text-blue-700">©</span> {GetCurrentDate}{" "}
          <a href="/" className="hover:underline hover:text-blue-400">
            AUP™&nbsp;
          </a>
          <span className="text-blue-700">©</span>
        </span>

        <div className="flex items-center justify-center mt-4 md:mt-0">
          <ul className="flex flex-wrap items-center justify-center mt-3 text-sm font-medium text-gray-600 dark:text-gray-400 sm:mt-0">
            <li className="mr-4 md:mr-6">
              <Link
                to="https://github.com/AhmetUtkuPelen"
                target="_blank"
                className="hover:underline me-4 md:me-6 text-2xl text-blue-600"
              >
                <FaGithub />
              </Link>
            </li>
            <li className="mr-4 md:mr-6">
              <Link
                to="https://github.com/AhmetUtkuPelen"
                target="_blank"
                className="hover:underline me-4 md:me-6 text-2xl text-blue-600"
              >
                <FaLinkedin />
              </Link>
            </li>
            <li className="mr-4 md:mr-6">
              <Link
                to="https://www.instagram.com/rngd_aup/"
                target="_blank"
                className="hover:underline me-4 md:me-6 text-2xl text-blue-500"
              >
                <FaInstagram />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
