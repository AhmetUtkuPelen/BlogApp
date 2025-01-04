import {useSelector} from "react-redux";
import {RootState} from "../../Redux/Store.ts";
import {Outlet,Navigate} from "react-router-dom"



const PrivateRoute = () => {

    const {currentUser} = useSelector((state: RootState) => state.user);

  return currentUser ? <Outlet/> : <Navigate to={'/login'}/>;
}

export default PrivateRoute;
