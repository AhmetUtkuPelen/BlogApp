import { useSelector } from "react-redux";
import { PropsWithChildren } from "react";
import { RootState } from "../../Redux/Store";

const Theme = ({ children }: PropsWithChildren<unknown>) => {
  const { theme } = useSelector((state: RootState) => state.theme);

  return (
    <div className={theme}>
      <div className="bg-white text-gray-700 dark:text-gray-200 dark:bg-[rgb(16,23,42)] min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default Theme;
