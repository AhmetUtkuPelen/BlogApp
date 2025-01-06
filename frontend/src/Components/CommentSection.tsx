import { useSelector } from "react-redux";
import { RootState } from "../../Redux/Store";
import { Link, useNavigate } from "react-router-dom";
import { Button, Modal, Textarea } from "flowbite-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import Comment from "./Comment";
import { FaPersonCircleQuestion } from "react-icons/fa6";

interface Comment {
  _id: string;
  content: string;
  userId: string;
  postId: string;
  createdAt: string;
  likes: string[];
  numberOfLikes: number;
}

interface CommentSectionProps {
  postId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  postId,
}: CommentSectionProps) => {
  const [comment, setComment] = useState<string>("");

  const { currentUser } = useSelector((state: RootState) => state.user);
  const [comments, setComments] = useState<Comment[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/users/getComments/${postId}`,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          setComments(response.data);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
        toast.error("Error fetching comments");
      }
    };
    fetchComments();
  }, [postId]);

  const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (comment.length > 200) {
        return toast.error("Comment Must Be Less Than 200 Characters");
      }
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/users/postComment`,
        { content: comment, postId, userId: currentUser?._id },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setComments((prev) => [...prev, response.data]);
        setComment("");
        toast.success("Comment Posted Successfully");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    }
  };

  const handleCommentLikes = async (commentId: string) => {
    try {
      if (!currentUser) {
        navigate("/login");
        return toast.error("You Must Be Logged In To Like A Comment");
      }
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/users/likeComment/${commentId}`,
        { withCredentials: true }
      );
      if (response.status === 200) {
        setComments(
          comments.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  likes: response.data.likes,
                  numberOfLikes: response.data.numberOfLikes,
                }
              : comment
          )
        );
      }
    } catch (error) {
      console.error("Error liking comment:", error);
      toast.error("Error liking comment");
    }
  };

  const handleEditComment = async (
    commentId: string,
    editedContent: string
  ) => {
    setComments(
      comments.map((comment) =>
        comment._id === commentId
          ? {
              ...comment,
              content: editedContent,
            }
          : comment
      )
    );
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      if (!currentUser) {
        navigate("/login");
        return toast.error("You Must Be Logged In To Delete A Comment");
      }
      if (commentToDelete !== commentId) {
        return toast.error("You Must Be The Owner Of The Comment To Delete It");
      }
      const response = await axios.delete(
        `${
          import.meta.env.VITE_SERVER_URL
        }/api/users/deleteComment/${commentId}`,
        { withCredentials: true }
      );
      if (response.status === 200) {
        setComments(comments.filter((comment) => comment._id !== commentId));
        setShowModal(false);
        toast.success("Comment Deleted Successfully");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Error deleting comment");
    }
  };

  return (
    <div className="mt-5 max-w-2xl mx-auto w-full p-3">
      {currentUser ? (
        <div className="flex items-center gap-2 my-5 text-gray-500 text-sm">
          <p>Signed In As: </p>
          <img
            src={currentUser.profilePicture}
            alt="profile"
            className="w-10 h-10 rounded-full object-cover"
          />
          <Link
            to={`/dashboard?tab=profile`}
            className="hover:underline text-xs text-cyan-500"
          >
            {" "}
            @{currentUser?.username}
          </Link>
        </div>
      ) : (
        <div className="text-center text-teal-500 text-sm my-5 flex gap-1">
          You Must Be Logged In To Comment.
          <Link to={`/login`} className="text-blue-500 hover:underline">
            Login
          </Link>
        </div>
      )}

      {currentUser && (
        <form
          className="flex flex-col gap-2 border border-teal-500 p-3 rounded-md"
          onSubmit={handleCommentSubmit}
        >
          <Textarea
            placeholder="Write a comment..."
            rows={3}
            className="w-full"
            maxLength={200}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <div className="flex justify-between items-center mt-2">
            <p className="text-gray-500 text-sm">
              {200 - comment.length} characters remaining
            </p>
            <Button color="blue" className="mt-2" type="submit">
              COMMENT
            </Button>
          </div>
        </form>
      )}

      {comments.length === 0 ? (
        <p className="text-gray-500 text-sm my-5">Not A Comment Yet</p>
      ) : (
        <>
          <div className="text-sm my-5 flex flex-col gap-1 items-center">
            <p>Comment</p>
            <div className="border border-teal-500 p-3 rounded-md py-1 px-2">
              {comments.length}
            </div>
          </div>

          {comments.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              onLike={handleCommentLikes}
              onEdit={handleEditComment}
              onDelete={(commentId) => {
                setShowModal(true);
                setCommentToDelete(commentId);
              }}
            />
          ))}
        </>
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
              <Button
                color="failure"
                onClick={() =>
                  commentToDelete && handleDeleteComment(commentToDelete)
                }
              >
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

export default CommentSection;
