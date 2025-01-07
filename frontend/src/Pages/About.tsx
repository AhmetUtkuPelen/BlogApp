import { FaHtml5, FaCss3Alt, FaReact, FaNodeJs, FaPython, FaBootstrap } from 'react-icons/fa';
import { SiJavascript, SiTypescript, SiTailwindcss, SiExpress, SiDjango, SiMongodb } from 'react-icons/si';
import { TbBrandDjango } from 'react-icons/tb';

const About = () => {
  return (
    <div className="max-w-6xl mx-auto p-4 py-8 space-y-8">
      {/* Profile Section */}
      <div className="text-center mb-12 px-4">
        <h1 className="text-2xl md:text-4xl font-bold text-blue-600 mb-4 uppercase">About Me</h1>
        <p className="text-lg md:text-2xl text-gray-600 mb-6">
          Industrial Engineer & Full Stack Developer
        </p>
        <p className="text-base md:text-lg text-gray-500 max-w-3xl mx-auto leading-relaxed px-4 text-center">
          With a background in Industrial Engineering and i have passion for coding.</p>
        <p className="text-base md:text-lg text-gray-500 max-w-3xl mx-auto leading-relaxed px-4 text-center">
        I combine analytical thinking with creative problem-solving to build 
        efficient and user-friendly web applications.
        </p>
        <br/> 
      </div>

      {/* Tech Stack Section */}
      <div className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-blue-600 mb-8">My Tech Stack</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
          {/* Frontend */}
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-lg md:text-xl font-semibold text-blue-500 mb-4 text-center">Front End</h3>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <FaHtml5 className="text-3xl md:text-4xl text-orange-500" />
                <span className="text-sm md:text-base">HTML</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCss3Alt className="text-3xl md:text-4xl text-blue-500" />
                <span className="text-sm md:text-base">CSS</span>
              </div>
              <div className="flex items-center gap-2">
                <SiJavascript className="text-3xl md:text-4xl text-yellow-400" />
                <span className="text-sm md:text-base">JS</span>
              </div>
              <div className="flex items-center gap-2">
                <SiTypescript className="text-3xl md:text-4xl text-blue-600" />
                <span className="text-sm md:text-base">TS</span>
              </div>
              <div className="flex items-center gap-2">
                <FaReact className="text-3xl md:text-4xl text-cyan-400" />
                <span className="text-sm md:text-base">React</span>
              </div>
            </div>
          </div>

          {/* Styling */}
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-lg md:text-xl font-semibold text-blue-500 mb-4 text-center">Styling</h3>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <SiTailwindcss className="text-3xl md:text-4xl text-cyan-400" />
                <span className="text-sm md:text-base">Tailwind</span>
              </div>
              <div className="flex items-center gap-2">
                <FaBootstrap className="text-3xl md:text-4xl text-purple-600" />
                <span className="text-sm md:text-base">Bootstrap</span>
              </div>
            </div>
          </div>

          {/* Backend */}
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-lg md:text-xl font-semibold text-blue-500 mb-4 text-center">Back End</h3>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <FaNodeJs className="text-3xl md:text-4xl text-green-600" />
                <span className="text-sm md:text-base">Node.js</span>
              </div>
              <div className="flex items-center gap-2">
                <SiExpress className="text-3xl md:text-4xl text-gray-600" />
                <span className="text-sm md:text-base">Express</span>
              </div>
              <div className="flex items-center gap-2">
                <FaPython className="text-3xl md:text-4xl text-yellow-600" />
                <span className="text-sm md:text-base">Python</span>
              </div>
              <div className="flex items-center gap-2">
                <SiDjango className="text-3xl md:text-4xl text-green-800" />
                <span className="text-sm md:text-base">Django</span>
              </div>
              <div className="flex items-center gap-2">
                <TbBrandDjango className="text-3xl md:text-4xl text-green-600" />
                <span className="text-sm md:text-base">DRF</span>
              </div>
            </div>
          </div>

          {/* Database */}
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-lg md:text-xl font-semibold text-blue-500 mb-4 text-center">DataBase</h3>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <SiMongodb className="text-3xl md:text-4xl text-green-500" />
                <span className="text-sm md:text-base">MongoDB</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="text-center px-4">
        <p className="text-base md:text-lg text-gray-600">
          I'm passionate about creating efficient, scalable, and user-friendly applications.
          Always eager to learn new technologies and tackle challenging projects.
        </p>
      </div>
    </div>
  );
};

export default About;