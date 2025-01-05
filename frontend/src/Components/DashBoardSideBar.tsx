import axios from "axios"
import { Sidebar } from "flowbite-react"
import { useEffect, useState } from "react"
import { HiArrowSmRight, HiDocumentText, HiUser } from "react-icons/hi"
import { useSelector } from "react-redux"
import { Link, useLocation } from "react-router-dom"
import { toast } from "react-toastify"
import { RootState } from "../../Redux/Store"
import { signOutSuccess } from "../Redux/Slices/UserSlice"
import { useDispatch } from "react-redux"
import { FaUsers } from "react-icons/fa6";
import { HiChatBubbleBottomCenterText } from "react-icons/hi2";





const DashBoardSideBar = () => {

    const location = useLocation()
    const [tab,setTab] =  useState<string|undefined>()
    const dispatch = useDispatch()
    const {currentUser} = useSelector((state: RootState) => state.user);

    useEffect(():void=>{
      const urlParams = new URLSearchParams(location.search)
        const tabFromURL:string|null = urlParams.get('tab')
      if(tabFromURL){
        setTab(tabFromURL)
      }
    },[location.search])


    // ? LOGOUT USER ? \\
    const UserHandleLogout = async () => {
      try {
        await axios.get('/api/users/logout', { withCredentials: true });
        
        // Dispatch before navigation
        dispatch(signOutSuccess());
        
        // Clear all storage
        localStorage.clear();
        sessionStorage.clear();
        
        // Force reload and redirect
        window.location.href = '/';
      } catch (error) {
        console.error('Logout error:', error);
        toast.error('Error logging out');
      }
    };
  // ? LOGOUT USER ? \\

    // const StyledIcon1 = () => <HiUser className="text-blue-600" />
    // const StyledIcon2 = () => <HiArrowSmRight className="text-blue-600" />



  return (
    <div>
      <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
    <Sidebar.ItemGroup className="flex flex-col gap-2">
        <Link to='/dashboard?tab=profile'>
            <Sidebar.Item  as='div'
                active={tab === 'profile'} 
                icon={() => <HiUser className="text-blue-600 text-2xl" />}
                className="text-gray-600 uppercase cursor-pointer"
                label={currentUser?.isAdmin ? 'Admin' : 'User'}
            >
                Profile
            </Sidebar.Item>
        </Link>

      {currentUser?.isAdmin && (
        <>
              <Link to='/dashboard?tab=posts'>
              <Sidebar.Item  as='div'
                  active={tab === 'posts'} 
                  icon={() => <HiDocumentText className="text-blue-600 text-2xl" />}
                  className="cursor-pointer uppercase text-gray-600"
              >
                  Posts
              </Sidebar.Item>
            </Link>

            <Link to='/dashboard?tab=users'>
              <Sidebar.Item  as='div'
                  active={tab === 'users'} 
                  icon={() => <FaUsers className="text-blue-600 text-2xl" />}
                  className="cursor-pointer uppercase text-gray-600"
              >
                  Users
              </Sidebar.Item>
            </Link>

            <Link to='/dashboard?tab=comments'>
              <Sidebar.Item  as='div'
                  active={tab === 'comments'} 
                  icon={() => <HiChatBubbleBottomCenterText className="text-blue-600 text-2xl" />}
                  className="cursor-pointer uppercase text-gray-600"
              >
                  Comments
              </Sidebar.Item>
            </Link>
          </>
      )}

        <Sidebar.Item as='div'
            icon={() => <HiArrowSmRight className="text-red-600 text-2xl" />}
            className="cursor-pointer uppercase text-gray-600" onClick={UserHandleLogout}
        >
            Log Out
        </Sidebar.Item>
    </Sidebar.ItemGroup>
</Sidebar.Items>
      </Sidebar>
    </div>
  )
}

export default DashBoardSideBar