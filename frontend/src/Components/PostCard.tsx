import { Link } from "react-router-dom";




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


const PostCard = ({post}:{post:Post}) => {





  return (
    <div className="flex flex-col justify-center items-center text-center w-full group relative p-2">
      <Link to={`/post/${post.slug}`} className="w-full">
        <img src={post.image} alt={post.title} className="w-full h-full object-cover hover:scale-105 transition-all duration-300 rounded-lg" />
      </Link>
      <div className="p-3 flex flex-col gap-2">
        <h1 className="text-lg font-bold text-blue-600 capitalize">{post.title}</h1>
        <p className="text-gray-500 text-sm font-italic">{post.category}</p>
        <p className="text-gray-400 text-xs">{new Date(post.createdAt).toLocaleDateString()}</p>
        <Link 
          to={`/post/${post.slug}`} 
          className="text-blue-600 text-sm z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          READ POST
        </Link>
      </div>
    </div>
  )
}

export default PostCard
