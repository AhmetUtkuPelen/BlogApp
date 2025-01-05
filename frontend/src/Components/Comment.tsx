import axios from "axios";
import { useEffect, useState } from "react";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/Store";
import { FaEdit } from "react-icons/fa";
import { Button, Textarea } from "flowbite-react";
import { MdDeleteForever } from "react-icons/md";



interface CommentType {
    _id: string;
    content: string;
    userId: string;
    postId: string;
    createdAt: string;
    likes: string[];
    numberOfLikes: number;
}

interface UserType {
  _id: string;
  username: string;
  email: string;
  profilePicture?: string;
  isAdmin?: boolean;
  createdAt: string;
}

interface CommentProps {
  comment: CommentType;
  onLike: (commentId: string) => Promise<string | number | undefined>;
  onEdit: (commentId: string, editedContent: string) => Promise<void>;
  onDelete: (commentId: string) => void;
}

const Comment = ({ comment, onLike, onEdit, onDelete }: CommentProps) => {


    const {currentUser} = useSelector((state: RootState) => state.user);

    const [user,setUser] = useState<UserType | null>(null);
    const [isEditingCOmment,setIsEditingComment] = useState(false);
    const [editedCommentContent,setEditedCommentContent] = useState(comment.content);


    useEffect(()=>{
        const getUser = async () => {
            try {
             const response = await axios.get(`/api/users/getUserById/${comment.userId}`);
             if(response.status === 200){
                const data = response.data;
                setUser(data);
             }
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        }
        getUser();
    },[comment])
    

    const handleUpdateComment = async () => {
        try {
            await axios.put(`/api/users/updateComment/${comment._id}`, {
                content: editedCommentContent
            });
            setIsEditingComment(false);
            onEdit(comment._id, editedCommentContent);
        } catch (error) {
            console.error('Error updating comment:', error);
        }
    }


  return (
    <div>
      
        <div className="mt-4 flex-shrink-0 ml-4">
            <img src={user?.profilePicture} alt="profilePicture" className="w-10 h-10 rounded-full"/>
        </div>

        <div className="p-4 border-b border-gray-200 mt-2 flex-1">
            <div className="">
                <span className="font-bold mr-1 text-sm truncate text-ellipsis text-teal-500">{user ? `@${user?.username}` : 'Anonymous'}</span>
                <span className="text-sm text-gray-500">- {moment(comment.createdAt).fromNow()}</span>
            </div>

            {isEditingCOmment ? (
                <>
                    <Textarea placeholder="Update your comment" className="mt-2 w-full mb-2" rows={3} value={editedCommentContent} onChange={(e) => setEditedCommentContent(e.target.value)}/>
                    <div className="flex justify-end gap-2">
                        <Button type="button" size="xs" className="bg-blue-500 text-white rounded-md" onClick={handleUpdateComment}>SAVE</Button>
                        <Button type="button" size="xs" className="bg-red-500 text-white rounded-md" onClick={() => setIsEditingComment(false)}>CANCEL</Button>
                    </div>
                </>
            ) : (
                <>
                <p className="text-sm">{comment.content}</p>

                {/* ? LIKE COMMENT BUTTON ? */}
                <div className="flex items-center pt-2">
                    <button 
                        type="button" 
                        className={`text-sm hover:text-blue-400 ${currentUser && comment?.likes?.includes(currentUser?._id) ? 'text-blue-500' : 'text-gray-500'}`} 
                        onClick={() => comment?._id && onLike(comment._id)}
                    >
                        <FaThumbsUp/>
                    </button>
                    <span className="text-sm ml-1 text-gray-500">
                        {
                            comment.numberOfLikes > 0 && comment.numberOfLikes + " " + (comment.numberOfLikes === 1 ? "like" : "likes")
                        }</span>
    
                        {currentUser && (currentUser?._id === comment.userId || currentUser?.isAdmin) && (
                            <>
                            <button onClick={() => setIsEditingComment(true)} className="ml-2">
                                <FaEdit className="cursor-pointer text-amber-500 text-lg hover:text-amber-600"/>
                            </button>
                            <button onClick={() => onDelete(comment._id)} className="ml-2">
                            <MdDeleteForever className="cursor-pointer text-red-500 text-lg hover:text-red-600"/>
                            </button>
                            </>
                        )}
    
                </div>
                {/* ? LIKE COMMENT BUTTON ? */}
                </>
            )}




        </div>

    </div>
  )
}

export default Comment
