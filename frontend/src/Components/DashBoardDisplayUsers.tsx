import { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/Store";
import axios from "axios";
import { Button, Modal, Table } from "flowbite-react";
import { MdDeleteForever } from "react-icons/md";
import { FaPersonCircleQuestion } from "react-icons/fa6";
import { toast } from "react-toastify";
import { GrUserAdmin } from "react-icons/gr";
import { LuUserRoundX } from "react-icons/lu";




const DashBoardDisplayUsers = () => {

    interface User {
        _id?: string;
        username?: string;
        email?: string;
        profilePicture?: string;
        isAdmin?: boolean;
        createdAt?: string;
        updatedAt?: string;
      }
      

  const {currentUser} = useSelector((state: RootState) => state.user);

  const [users,setUsers] = useState<User[]>([]);
  const [showMorePosts,setShowMorePosts] = useState<boolean>(true);
  const [showModal,setShowModal] = useState<boolean>(false);
  const [userIdToDelete,setUserIdToDelete] = useState<string | null>(null);

  useEffect(() => {
    const FetchUsers = async () => {
      try {
        if (!currentUser) return;
        const response = await axios.get(`/api/users/getAllUsers`);
        const data = response.data;
        if(response.status === 200){
          setUsers(response.data.users);
          if(data.users.length < 9){
            setShowMorePosts(false);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    if(currentUser?.isAdmin){
      FetchUsers();
    }
  }, [currentUser]);


  const HandleShowMorePosts = async () => {
    const startIndex = users.length;
    try {
      const response = await axios.get(`/api/users/getAllUsers?startIndex=${startIndex}`);
      const data = response.data;
      if(response.status === 200){
        setUsers([...users,...data.users]);
        if(data.users.length < 9){
          setShowMorePosts(false);
        }
      }
    }catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log('An unknown error occurred');
      }
    }
  }

  const HandleDeleteUser = async () => {
    setShowModal(false);
    try {
      const response = await axios.delete(`/api/users/adminDeleteUsers/${userIdToDelete}`);
      const data = response.data;
      if(response.status === 200){
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userIdToDelete));
        setUserIdToDelete(null);
        setShowModal(false);
        toast.success('User Has Been Deleted Successfully !');
      }else if(response.status !== 200){
        console.log(data);
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error('An Error Occurred While Deleting The User !');
    }
  }



  return (
    <div className="table-auto p-3 mx-auto overflow-x-auto lg:mr-96 text-center">
      {currentUser?.isAdmin && users.length > 0 ? (
        <>
          <Table hoverable className="shadow-md text-center min-w-[400px] max-w-[1000px]">
            <Table.Head className="border-b-2">
              <Table.HeadCell className="text-center text-blue-500">Date Created</Table.HeadCell>
              <Table.HeadCell className="text-center text-blue-500">User Image</Table.HeadCell>
              <Table.HeadCell className="text-center text-blue-500">User Name</Table.HeadCell>
              <Table.HeadCell className="text-center text-blue-500">User Email</Table.HeadCell>
              <Table.HeadCell className="text-center text-blue-500">Admin</Table.HeadCell>
              <Table.HeadCell className="text-center text-red-500">Delete</Table.HeadCell>
            </Table.Head>

            {users.map((user) => (
              <Table.Body key={user._id}>
                <Table.Row>
                  <Table.Cell>{user.createdAt ? new Date(user?.createdAt).toLocaleDateString() : 'No date'}</Table.Cell>
                  <Table.Cell className="transition-transform duration-300 hover:scale-125"><img src={user.profilePicture} alt={user.username} className="w-10 h-10 rounded-full object-cover" /></Table.Cell>
                  <Table.Cell className="uppercase transition-transform duration-300 hover:scale-110 hover:underline hover:text-blue-500">{user.username}</Table.Cell>
                  <Table.Cell className="uppercase">{user?.email}</Table.Cell>
                  <Table.Cell>{user?.isAdmin ? <GrUserAdmin className="text-blue-500 text-3xl"/> : <LuUserRoundX className="text-red-500 text-3xl"/>}</Table.Cell>
                  <Table.Cell><MdDeleteForever onClick={() => {
                    if(user?._id) {
                      setShowModal(true);
                      setUserIdToDelete(user?._id);
                    }
                  }} className="text-red-500 hover:text-red-600 cursor-pointer text-4xl" /></Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}

          </Table>

            {showMorePosts && (
              <button onClick={HandleShowMorePosts} className="bg-blue-500 text-white px-4 py-2 rounded-md w-full self-center mt-4">MORE USERS</button>
            )}

        </>
      ) : (
        <p>No Users Found !</p>
      )}  

<Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
            <Modal.Header/>
              <Modal.Body>
                <div className="text-center">
                  <FaPersonCircleQuestion className="text-4xl text-red-500 dark:text-white mb-4 mx-auto"/>
                  <h3 className="mb-5 text-center text-lg text-blue-500">? You Sure You Want To Delete This User ?</h3>
                  <div className="flex justify-center gap-4">
                    <Button color="failure" onClick={HandleDeleteUser}>DELETE</Button>
                    <Button color="blue" onClick={() => setShowModal(false)}>CANCEL</Button>
                  </div>
                </div>
              </Modal.Body>
          </Modal>

    </div>
  )
}

export default DashBoardDisplayUsers