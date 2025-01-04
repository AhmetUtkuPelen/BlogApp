import axios from "axios";
import { Alert, Button, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import CommentSection from "../Components/CommentSection";



const PostPage = () => {

    const {postSlug} = useParams();

    // ? POST INTERFACE ? \\
    interface Post {
        _id: string;
        title: string;
        content: string;
        image: string;
        category: string;
        slug: string;
        createdAt: string;
        updatedAt: string;
        userId: string;
      }
    // ? POST INTERFACE ? \\

    const [loading, setLoading] = useState<boolean>(true);
    const [error,setError] = useState<string | null | boolean>(null);
    const [post,setPost] = useState<Post | null>(null);


    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/api/users/getAllPosts?slug=${postSlug}`);
                const data = response.data;
                if(response.status === 200){
                    setPost(data.posts[0]);
                    setLoading(false);
                    setError(false);
                }else if(response.status !== 200){
                    setError(true);
                    setLoading(false);
                    toast.error(`${data.message}`);
                }
            } catch (error) {
                console.log(error);
                setError(true);
                setLoading(false);
                toast.error(`${error}`);
            }
        }
        fetchPost();
    },[postSlug])


    if(loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <Spinner size="xl" color="info" />
        </div>
    )

  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
    
    <h1 className="text-3xl font-bold text-blue-600 mt-10 p-3 mx-auto text-center lg:text-4xl">{post?.title}</h1>
    
    <Link to={`/search?category=${post && post?.category}`} className="self-center mt-5">
        <Button color="gray" size="sm" className="hover:text-blue-600">
            {post && post?.category}
        </Button>
    </Link>

    <div className="max-h-[700px] w-full flex flex-col justify-center items-center">
        <img src={post?.image || ''} alt={post?.title || ''} className="rounded-lg mt-5 p-3 object-cover"/>
        <div className="flex flex-col justify-center items-center mt-4 text-center mx-auto">
            <p className="text-gray-500 text-sm">{new Date(post?.createdAt || '').toLocaleDateString()}</p>
        </div>
    </div>


    <div dangerouslySetInnerHTML={{__html:post?.content || ''}} className="mt-5 p-3 text-justify mx-auto w-full display_my_post">

    </div>

    <CommentSection postId={post?._id || ''} />

    {error && <Alert color="failure">Error loading post</Alert>}

    </main>
  )
}

export default PostPage