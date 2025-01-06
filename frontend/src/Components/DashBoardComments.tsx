import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/Store";
import axios from "axios";
import { Button, Modal, Table } from "flowbite-react";
import { MdDeleteForever } from "react-icons/md";
import { FaPersonCircleQuestion } from "react-icons/fa6";
import { toast } from "react-toastify";

const DashBoardComments = () => {
  interface Comment {
    _id?: string;
    content?: string;
    postId?: string;
    userId?: string;
    createdAt?: string;
    updatedAt?: string;
    numberOfLikes?: number;
  }

  const { currentUser } = useSelector((state: RootState) => state.user);

  const [comments, setComments] = useState<Comment[]>([]);
  const [showMoreComments, setShowMoreComments] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState<string | null>(
    null
  );

  useEffect(() => {
    const FetchComments = async () => {
      try {
        if (!currentUser) return;
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/users/getAllComments`
        );
        const data = response.data;
        if (response.status === 200) {
          setComments(response.data.comments);
          if (data.comments.length < 9) {
            setShowMoreComments(false);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (currentUser?.isAdmin) {
      FetchComments();
    }
  }, [currentUser]);

  const HandleShowMoreComments = async () => {
    const startIndex = comments.length;
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_SERVER_URL
        }/api/comments/getAllComments?startIndex=${startIndex}`
      );
      const data = response.data;
      if (response.status === 200) {
        setComments([...comments, ...data.comments]);
        if (data.comments.length < 9) {
          setShowMoreComments(false);
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log("An unknown error occurred");
      }
    }
  };

  const handleDeleteComment = async () => {
    try {
      const response = await axios.delete(
        `${
          import.meta.env.VITE_SERVER_URL
        }/api/users/deleteComment/${commentIdToDelete}`,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setComments(
          comments.filter((comment) => comment._id !== commentIdToDelete)
        );
        setShowModal(false);
        toast.success("Comment deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Error deleting comment");
    }
  };

  return (
    <div className="table-auto p-3 mx-auto overflow-x-auto lg:mr-96 text-center">
      {currentUser?.isAdmin && comments.length > 0 ? (
        <>
          <Table
            hoverable
            className="shadow-md text-center min-w-[400px] max-w-[1000px]"
          >
            <Table.Head className="border-b-2">
              <Table.HeadCell className="text-center text-blue-500">
                Date Updated
              </Table.HeadCell>
              <Table.HeadCell className="text-center text-blue-500">
                Comment
              </Table.HeadCell>
              <Table.HeadCell className="text-center text-blue-500">
                Number Of Likes
              </Table.HeadCell>
              <Table.HeadCell className="text-center text-blue-500">
                PostId
              </Table.HeadCell>
              <Table.HeadCell className="text-center text-blue-500">
                UserId
              </Table.HeadCell>
              <Table.HeadCell className="text-center text-red-500">
                Delete
              </Table.HeadCell>
            </Table.Head>

            {comments.map((comment) => (
              <Table.Body key={comment._id}>
                <Table.Row>
                  <Table.Cell>
                    {comment.updatedAt &&
                      new Date(comment.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell className="uppercase transition-transform duration-300 hover:scale-110 hover:underline hover:text-blue-500">
                    {comment.content}
                  </Table.Cell>
                  <Table.Cell className="uppercase">
                    {comment.numberOfLikes}
                  </Table.Cell>
                  <Table.Cell className="uppercase">
                    {comment.postId}
                  </Table.Cell>
                  <Table.Cell className="uppercase">
                    {comment.userId}
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        if (comment._id) setCommentIdToDelete(comment._id);
                      }}
                      className="text-red-500 hover:text-red-600 cursor-pointer text-4xl"
                    >
                      <MdDeleteForever />
                    </span>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>

          {showMoreComments && (
            <button
              onClick={HandleShowMoreComments}
              className="bg-blue-500 text-white px-4 py-2 rounded-md w-full self-center mt-4"
            >
              MORE COMMENTS
            </button>
          )}
        </>
      ) : (
        <p>No Comments Found !</p>
      )}

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <FaPersonCircleQuestion className="text-4xl text-red-500 dark:text-white mb-4 mx-auto" />
            <h3 className="mb-5 text-center text-lg text-blue-500">
              ? You Sure You Want To Delete This Comment ?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteComment}>
                DELETE
              </Button>
              <Button color="blue" onClick={() => setShowModal(false)}>
                CANCEL
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashBoardComments;
