import { Button, Select, Spinner, TextInput } from "flowbite-react"
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PostCard from "../Components/PostCard";
import axios from "axios";

interface SearchState {
  searchTerm: string;
  sort: 'asc' | 'desc';
  category: string;
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

const Search = () => {

    const location = useLocation();
    const navigate = useNavigate()

    const [searchData, setSearchData] = useState<SearchState>({
        searchTerm: '',
        sort: 'desc',
        category: 'uncategorized',
    });

    const [loading, setLoading] = useState(false);
    const [showMore, setShowMore] = useState(false);
    const [posts, setPosts] = useState<Post[]>([]);


    useEffect(()=>{
        const urlParams = new URLSearchParams(location.search);
        const searchTermUrl = urlParams.get("search");
        const sortUrl = urlParams.get("sort");
        const categoryUrl = urlParams.get("category");
        if(searchTermUrl || sortUrl || categoryUrl){
            setSearchData({
                ...searchData,
                searchTerm: searchTermUrl || '',
                sort: sortUrl === 'asc' ? 'asc' : 'desc',
                category: categoryUrl || 'uncategorized',
            })
        }
        const fetchData = async () => {
            setLoading(true);
            const searchQuery = urlParams.toString();
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/users/getAllPosts?${searchQuery}`);
            if(response.status !== 200){
                setLoading(false);
                return;
            }
            if(response.status === 200){
                const data = await response.json();
                setPosts(data.posts || []);
                setLoading(false);
                if(data.posts.length === 9){
                    setShowMore(true);
                }else{
                    setShowMore(false);
                }
            }
        }
        fetchData();
    },[location.search])


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if(e.target.id === 'search'){
            setSearchData({...searchData, searchTerm: e.target.value});
        }
        if(e.target.id === 'sort'){
            const order = (e.target.value || 'desc') as 'asc' | 'desc';
            setSearchData({...searchData, sort: order});
        }
        if(e.target.id === 'category'){
            setSearchData({...searchData, category: e.target.value});
        }
    }


    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('search', searchData.searchTerm);
        urlParams.set('sort', searchData.sort);
        urlParams.set('category', searchData.category);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    }


    const handleShowMore = async () => {
        const numberOfPosts = posts.length;
        const startIndex = numberOfPosts
        const urlParams = new URLSearchParams(location.search)
        urlParams.set('startIndex', startIndex.toString())
        const searchQuery = urlParams.toString()
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/users/getAllPosts?${searchQuery}`)
        if(response.status !== 200){
            return;
        }
        if(response.status === 200){
            setPosts([...posts,response.data.posts])
            if(response.data.posts.length === 9){
                setShowMore(true);
            }else{
                setShowMore(false);
            }
        }
    }


  return (
    <div className="flex flex-col md:flex-row">
      
        <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">  
            <form className="flex flex-col gap-8" onSubmit={handleFormSubmit}>
                
                <div className="flex items-center gap-2">
                    <label className="whitespace-nowrap font-semibold">Search :</label>
                    <TextInput type="text" placeholder="Search" id="search" value={searchData.searchTerm} onChange={handleChange} />
                </div>

                <div className="flex items-center gap-2">
                    <label className="whitespace-nowrap font-semibold">Sort :</label>
                    <Select onChange={handleChange} value={searchData.sort} id="sort">
                        <option value={`desc`}>Latest</option>
                        <option value={`asc`}>Oldest</option>
                    </Select>
                </div>

                <div className="flex items-center gap-2">
                    <label className="whitespace-nowrap font-semibold">Category :</label>
                    <Select onChange={handleChange} value={searchData.category} id="category">
                        <option value="uncategorized">Uncategorized</option>
                        <option value="react">React</option>
                        <option value="javascript">JavaScript</option>
                        <option value="nextjs">Next.js</option>
                        <option value="typescript">TypeScript</option>
                    </Select>
                </div>

                <Button type="submit" color="blue">Search</Button>

            </form>
        </div>


        <div className="w-full">
            <h1 className="text-center font-semibold text-blue-500 text-3xl uppercase sm:border-b border-amber-500 mt-5 p-3">Posts</h1>
            <div className="p-7 flex flex-wrap gap-4">
                {!loading && posts.length === 0 && (
                    <p className="text-lg text-teal-400">No Posts Found!</p>
                )}
                {loading && (
                    <Spinner className="w-screen" />
                )}
                {!loading && posts.length > 0 && (
                    posts.map((post) => (
                        <PostCard key={post._id} post={post} />
                    ))
                )}
                {showMore && (
                    <button onClick={handleShowMore} className="text-lg text-teal-500 p-7 w-full hover:underline">
                        Show More
                    </button>
                )}
            </div>
        </div>

    </div>
  )
}

export default Search