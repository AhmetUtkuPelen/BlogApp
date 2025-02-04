import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashBoardSideBar from "../Components/DashBoardSideBar";
import DashBoardProfile from "../Components/DashBoardProfile";
import DashBoardPosts from "../Components/DashBoardPosts";
import DashBoardDisplayUsers from "../Components/DashBoardDisplayUsers";
import DashBoardComments from "../Components/DashBoardComments";
import DashBoardComponent from "../Components/DashBoardComponent";

const DashBoard = () => {
  const location = useLocation();

  const [tab, setTab] = useState<string | undefined>();

  useEffect((): void => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromURL: string | null = urlParams.get("tab");
    if (tabFromURL) {
      setTab(tabFromURL);
    }
  }, [location.search]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        <DashBoardSideBar />
      </div>

      <div className="w-full">{tab === "profile" && <DashBoardProfile />}</div>

      <div className="mt-10 px-4">{tab === "posts" && <DashBoardPosts />}</div>

      <div className="mt-10 px-4">
        {tab === "users" && <DashBoardDisplayUsers />}
      </div>

      <div className="mt-10 px-4">
        {tab === "comments" && <DashBoardComments />}
      </div>

      <div className="mt-10 px-4">
        {tab === "dashboard" && <DashBoardComponent />}
      </div>
    </div>
  );
};

export default DashBoard;
