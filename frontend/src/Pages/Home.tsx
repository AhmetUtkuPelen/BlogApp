import { useEffect, useState } from "react";
import TechStack from "../Components/TechStack";
import axios from "axios";
import PostCard from "../Components/PostCard";

const Home = () => {
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

  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/users/getAllPosts?limit=15`
        );
        setPosts(response.data.posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex justify-center items-center">
        <TechStack />
      </div>

      <div className="max-w-6xl mx-auto p-3 w-full">
        {posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <p>No posts found</p>
        )}
      </div>
    </div>
  );
};

export default Home;
