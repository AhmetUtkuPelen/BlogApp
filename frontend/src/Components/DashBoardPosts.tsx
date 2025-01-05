import { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/Store";
import axios from "axios";
import { Button, Modal, Table } from "flowbite-react";
import { Link } from "react-router-dom";
import { MdDeleteForever } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { FaPersonCircleQuestion } from "react-icons/fa6";
import { toast } from "react-toastify";



const DashBoardPosts = () => {

  interface Post {
    _id?: string;
    title?: string;
    content?: string;
    image?: string;
    category?: string;
    slug?: string;
    createdAt?: string;
    updatedAt?: string;
  }

  const {currentUser} = useSelector((state: RootState) => state.user);

  const [posts,setPosts] = useState<Post[]>([]);
  const [showMorePosts,setShowMorePosts] = useState<boolean>(true);
  const [showModal,setShowModal] = useState<boolean>(false);
  const [postIdToDelete,setPostIdToDelete] = useState<string | null>(null);

  useEffect(() => {
    const FetchPosts = async () => {
      try {
        if (!currentUser) return;
        const response = await axios.get(`/api/users/getAllPosts?userId=${currentUser?._id}`);
        const data = response.data;
        console.log(data);
        if(response.status === 200){
          setPosts(response.data.posts);
          if(data.posts.length < 9){
            setShowMorePosts(false);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    if(currentUser?.isAdmin){
      FetchPosts();
    }
  }, [currentUser]);


  const HandleShowMorePosts = async () => {
    const startIndex = posts.length;
    try {
      const response = await axios.get(`/api/users/getAllPosts?userId=${currentUser?._id}&startIndex=${startIndex}`);
      const data = response.data;
      if(response.status === 200){
        setPosts([...posts,...data.posts]);
        if(data.posts.length < 9){
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

  const HandleDeletePost = async () => {
    setShowModal(false);
    try {
      const response = await axios.delete(`/api/users/deletePost/${postIdToDelete}/${currentUser?._id}`);
      const data = response.data;
      if(response.status !== 200){
        console.log(data);
        toast.error(data.message);
      }else{
        setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postIdToDelete));
        setPostIdToDelete(null);
        setShowModal(false);
        toast.success('Post Has Been Deleted Successfully !');
      }
    } catch (error) {
      console.log(error);
    }
  }



  return (
    <div className="table-auto p-3 mx-auto overflow-x-auto lg:mr-96 text-center">
      {currentUser?.isAdmin && posts.length > 0 ? (
        <>
          <Table hoverable className="shadow-md text-center min-w-[400px] max-w-[1000px]">
            <Table.Head className="border-b-2">
              <Table.HeadCell className="text-center text-blue-500">Date Updated</Table.HeadCell>
              <Table.HeadCell className="text-center text-blue-500">Post Image</Table.HeadCell>
              <Table.HeadCell className="text-center text-blue-500">Post Title</Table.HeadCell>
              <Table.HeadCell className="text-center text-blue-500">Category</Table.HeadCell>
              <Table.HeadCell className="text-center text-red-500">Delete</Table.HeadCell>
              <Table.HeadCell className="text-center text-green-500">Edit</Table.HeadCell>
            </Table.Head>

            {posts.map((post) => (
              <Table.Body key={post._id}>
                <Table.Row>
                  <Table.Cell>{post.updatedAt ? new Date(post.updatedAt).toLocaleDateString() : 'No date'}</Table.Cell>
                  <Table.Cell className="transition-transform duration-300 hover:scale-125"><Link to={`/post/${post.slug}`}><img src={post.image} alt={post.title} className="w-10 h-10 rounded-md" /></Link></Table.Cell>
                  <Table.Cell className="uppercase transition-transform duration-300 hover:scale-110 hover:underline hover:text-blue-500"><Link to={`/post/${post.slug}`}>{post.title}</Link></Table.Cell>
                  <Table.Cell className="uppercase">{post.category}</Table.Cell>
                  <Table.Cell><MdDeleteForever onClick={() => {
                    if(post._id) {
                      setShowModal(true);
                      setPostIdToDelete(post._id);
                    }
                  }} className="text-red-500 hover:text-red-600 cursor-pointer text-4xl" /></Table.Cell>
                  <Table.Cell><Link to={`/updatePost/${post._id}`}><FaEdit className="text-blue-500 hover:text-blue-600 cursor-pointer text-3xl" /></Link></Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}

          </Table>

            {showMorePosts && (
              <button onClick={HandleShowMorePosts} className="bg-blue-500 text-white px-4 py-2 rounded-md w-full self-center mt-4">MORE POSTS</button>
            )}

        </>
      ) : (
        <p>No Posts Found !</p>
      )}  

          <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
            <Modal.Header/>
              <Modal.Body>
                <div className="text-center">
                  <FaPersonCircleQuestion className="text-4xl text-red-500 dark:text-white mb-4 mx-auto"/>
                  <h3 className="mb-5 text-center text-lg text-blue-500">? You Sure You Want To Delete This Post ?</h3>
                  <div className="flex justify-center gap-4">
                    <Button color="failure" onClick={HandleDeletePost}>DELETE</Button>
                    <Button color="blue" onClick={() => setShowModal(false)}>CANCEL</Button>
                  </div>
                </div>
              </Modal.Body>
          </Modal>

    </div>
  )
}

export default DashBoardPosts