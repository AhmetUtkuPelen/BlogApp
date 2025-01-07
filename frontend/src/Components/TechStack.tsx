import { FaReact, FaNodeJs } from "react-icons/fa";
import { SiExpress, SiMongodb, SiTypescript } from "react-icons/si";
import { Link } from "react-router-dom";

const TechStack = () => {
  return (
    <div className="max-w-6xl mx-auto p-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-8 text-blue-500">
        Tech Stack I Used For This Project
      </h2>
      <div className="flex flex-wrap justify-center items-center gap-8">
        <div className="flex flex-col items-center gap-2 transition-transform hover:scale-110 cursor-pointer bg-white p-6 rounded-lg shadow-lg hover:shadow-xl">
          <Link to="https://reactjs.org/" target="_blank">
            <FaReact className="text-6xl text-blue-400" />
            <span className="font-semibold mt-2">REACT</span>
          </Link>
        </div>

        <div className="flex flex-col items-center gap-2 transition-transform hover:scale-110 cursor-pointer bg-white p-6 rounded-lg shadow-lg hover:shadow-xl">
          <Link to="https://nodejs.org/en" target="_blank">
            <FaNodeJs className="text-6xl text-green-600" />
            <span className="font-semibold mt-2">NODE JS</span>
          </Link>
        </div>

        <div className="flex flex-col items-center gap-2 transition-transform hover:scale-110 cursor-pointer bg-white p-6 rounded-lg shadow-lg hover:shadow-xl">
          <Link to="https://expressjs.com/" target="_blank">
            <SiExpress className="text-6xl text-gray-600" />
            <span className="font-semibold mt-2">EXPRESS</span>
          </Link>
        </div>

        <div className="flex flex-col items-center gap-2 transition-transform hover:scale-110 cursor-pointer bg-white p-6 rounded-lg shadow-lg hover:shadow-xl">
          <Link to="https://www.mongodb.com/" target="_blank">
            <SiMongodb className="text-6xl text-green-500" />
            <span className="font-semibold mt-2">MONGO DB</span>
          </Link>
        </div>

        <div className="flex flex-col items-center gap-2 transition-transform hover:scale-110 cursor-pointer bg-white p-6 rounded-lg shadow-lg hover:shadow-xl">
          <Link to="https://www.typescriptlang.org/" target="_blank">
            <SiTypescript className="text-6xl text-blue-600" />
            <span className="font-semibold mt-2">TYPESCRIPT</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TechStack;
