import { useState } from "react"
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/Store";



interface User {
    _id: string;
    username: string;
    email: string;
    password?: string;
    profilePicture: string;
    isAdmin: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  interface Post {
    _id: string;
    userId: string;
    title: string;
    content: string;
    image: string;
    category: string;
    slug: string;
    likes: string[];
    numberOfLikes: number;
    createdAt: string;
    updatedAt: string;
  }
  
  interface Comment {
    _id: string;
    content: string;
    postId: string;
    userId: string;
    likes: string[];
    numberOfLikes: number;
    createdAt: string;
    updatedAt: string;
  }


const DashBoardComponent = () => {


    const {currentUser} = useSelector((state: RootState) => state.user);


    const [users,setUsers] = useState<User[]>([])
    const [posts,setPosts] = useState<Post[]>([])
    const [comments,setComments] = useState<Comment[]>([])
    const [totalUsers,setTotalUsers] = useState(0)
    const [totalPosts,setTotalPosts] = useState(0)
    const [totalComments,setTotalComments] = useState(0)
    const [lastMonthComments,setLastMonthComments] = useState(0)
    const [lastMonthPosts,setLastMonthPosts] = useState(0)
    const [lastMonthUsers,setLastMonthUsers] = useState(0)






  return (
    <div>
      
    </div>
  )
}

export default DashBoardComponent