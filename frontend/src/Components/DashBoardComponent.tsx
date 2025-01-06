import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/Store";
import axios from "axios";
import { GrGroup } from "react-icons/gr";
import { MdOutlineComment, MdOutlinePostAdd } from "react-icons/md";
import { MdOutlineGroupAdd } from "react-icons/md";
import { Button, Table } from "flowbite-react";
import { Link } from "react-router-dom";

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
  const { currentUser } = useSelector((state: RootState) => state.user);

  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/users/getAllUsers?limit=4`
        );
        if (response.status === 200) {
          setUsers(response.data.users);
          setTotalUsers(response.data.totalUsers);
          setLastMonthUsers(response.data.lastMonthUsers);
        }
      } catch (error) {
        console.log(error);
      }
    };
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/users/getAllPosts?limit=4`
        );
        if (response.status === 200) {
          setPosts(response.data.posts);
          setTotalPosts(response.data.totalPosts);
          setLastMonthPosts(response.data.lastMonthPosts);
        }
      } catch (error) {
        console.log(error);
      }
    };
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/users/getAllComments?limit=4`
        );
        if (response.status === 200) {
          setComments(response.data.comments);
          setTotalComments(response.data.totalComments);
          setLastMonthComments(response.data.lastMonthComments);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (currentUser?.isAdmin) {
      fetchUsers();
      fetchPosts();
      fetchComments();
    }
  }, [currentUser]);

  return (
    <div className="p-3 md:mx-auto lg:w-[1000px] md:w-[700px] sm:w-[500px] w-[300px] lg:mr-96 md:mr-48 sm:mr-24 mr-12">
      {/* TOP SECTION START */}
      <div className="p-4 md:mx-auto">
        <div className="flex-wrap flex gap-4 justify-center">
          <div className="flex flex-col md:flex-row flex-wrap gap-4 justify-center">
            <div className="flex flex-col items-center justify-center text-center gap-2 outline outline-2 outline-cyan-700 rounded-lg p-4">
              <h3 className="text-2xl font-bold uppercase text-teal-400">
                Total Users
              </h3>
              <p className="text-4xl font-bold text-amber-400">{totalUsers}</p>
              <GrGroup size={30} className="text-blue-400" />
            </div>
            <div className="flex flex-col items-center justify-center text-center gap-2 outline outline-2 outline-cyan-700 rounded-lg p-4">
              <h3 className="text-2xl font-bold uppercase text-teal-400">
                Total Posts
              </h3>
              <p className="text-4xl font-bold text-amber-400">{totalPosts}</p>
              <MdOutlinePostAdd size={30} className="text-blue-400" />
            </div>
            <div className="flex flex-col items-center justify-center text-center gap-2 outline outline-2 outline-cyan-700 rounded-lg p-4">
              <h3 className="text-2xl font-bold uppercase text-teal-400">
                Total Comments
              </h3>
              <p className="text-4xl font-bold text-amber-400">
                {totalComments}
              </p>
              <MdOutlineComment size={30} className="text-blue-400" />
            </div>
            <div className="flex flex-col items-center justify-center text-center gap-2 outline outline-2 outline-cyan-700 rounded-lg p-4">
              <h3 className="text-2xl font-bold uppercase text-teal-400">
                Last Month Users
              </h3>
              <p className="text-4xl font-bold text-amber-400">
                {lastMonthUsers}
              </p>
              <MdOutlineGroupAdd size={30} className="text-blue-400" />
            </div>
            <div className="flex flex-col items-center justify-center text-center gap-2 outline outline-2 outline-cyan-700 rounded-lg p-4">
              <h3 className="text-2xl font-bold uppercase text-teal-400">
                Last Month Comments
              </h3>
              <p className="text-4xl font-bold text-amber-400">
                {lastMonthComments}
              </p>
              <MdOutlineComment size={30} className="text-blue-400" />
            </div>
            <div className="flex flex-col items-center justify-center text-center gap-2 outline outline-2 outline-cyan-700 rounded-lg p-4">
              <h3 className="text-2xl font-bold uppercase text-teal-400">
                Last Month Posts
              </h3>
              <p className="text-4xl font-bold text-amber-400">
                {lastMonthPosts}
              </p>
              <MdOutlinePostAdd size={30} className="text-blue-400" />
            </div>
          </div>
        </div>
      </div>
      {/* TOP SECTION END */}

      <div className="flex flex-wrap gap-4 py-3 mx-auto justify-center w-full">
        {/* FIRST DIV START */}

        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md">
          <div className="flex justify-between p-3 text-sm font-semibold">
            <h1 className="text-center p-2 text-xl font-bold uppercase text-teal-400">
              Recent Users
            </h1>
            <Button color="blue">
              <Link to={`/dashboard?tab=users`}>View All</Link>
            </Button>
          </div>
          <Table hoverable={true}>
            <Table.Head>
              <Table.HeadCell className="text-center text-gray-500">
                User Image
              </Table.HeadCell>
              <Table.HeadCell className="text-center text-gray-500">
                Username
              </Table.HeadCell>
            </Table.Head>
            {users &&
              users.map((user) => (
                <Table.Body
                  key={user._id}
                  className="divide-y items-center justify-center"
                >
                  <Table.Row className="bg-white">
                    <Table.Cell>
                      <img
                        src={user.profilePicture}
                        alt={user.username}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <p className="text-center text-amber-500 text-md">
                        {user.username}
                      </p>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>
        {/* FIRST DIV END */}

        {/* SECOND DIV START */}
        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md">
          <div className="flex justify-between p-3 text-sm font-semibold">
            <h1 className="text-center p-2 text-xl font-bold uppercase text-teal-400">
              Recent Comments
            </h1>
            <Button color="blue">
              <Link to={`/dashboard?tab=comments`}>View All</Link>
            </Button>
          </div>
          <Table hoverable={true}>
            <Table.Head>
              <Table.HeadCell className="text-center text-gray-500">
                Comment
              </Table.HeadCell>
              <Table.HeadCell className="text-center text-gray-500">
                Likes
              </Table.HeadCell>
            </Table.Head>
            {comments &&
              comments.map((comment) => (
                <Table.Body
                  key={comment._id}
                  className="divide-y items-center justify-center"
                >
                  <Table.Row className="bg-white">
                    <Table.Cell>
                      <p className="text-center">{comment.content}</p>
                    </Table.Cell>
                    <Table.Cell>
                      <p className="text-center text-blue-500 text-md">
                        {comment.numberOfLikes}
                      </p>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>
        {/* SECOND DIV END */}

        {/* THIRD DIV START */}

        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md">
          <div className="flex justify-between p-3 text-sm font-semibold">
            <h1 className="text-center p-2 text-xl font-bold uppercase text-teal-400">
              Recent Posts
            </h1>
            <Button color="blue">
              <Link to={`/dashboard?tab=posts`}>View All</Link>
            </Button>
          </div>
          <Table hoverable={true}>
            <Table.Head>
              <Table.HeadCell className="text-center text-gray-500">
                Post Image
              </Table.HeadCell>
              <Table.HeadCell className="text-center text-gray-500">
                Post Title
              </Table.HeadCell>
              <Table.HeadCell className="text-center text-gray-500">
                Post Category
              </Table.HeadCell>
            </Table.Head>
            {posts &&
              posts.map((post) => (
                <Table.Body
                  key={post._id}
                  className="divide-y items-center justify-center"
                >
                  <Table.Row className="bg-white">
                    <Table.Cell>
                      <img
                        src={post.image}
                        alt={post.category}
                        className="w-14 h-14 rounded-md object-cover"
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <p className="text-center text-blue-500 text-md w-48">
                        {post.title}
                      </p>
                    </Table.Cell>
                    <Table.Cell>
                      <p className="text-center text-blue-500 text-md">
                        {post.category}
                      </p>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>
        {/* THIRD DIV END */}
      </div>
    </div>
  );
};

export default DashBoardComponent;
