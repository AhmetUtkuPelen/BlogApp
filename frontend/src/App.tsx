import './App.css'
import {BrowserRouter,Route,Routes} from "react-router-dom"
import './App.css'
import Home from "./Pages/Home"
import DashBoard from "./Pages/DashBoard"
import About from "./Pages/About"
import Projects from "./Pages/Projects"
import Register from "./Pages/Register.tsx";
import Login from "./Pages/Login.tsx";
import Header from './Components/Header.tsx'
import Footer from './Components/Footer';
import PrivateRoute from "./Components/PrivateRoute.tsx";
import CreatePost from './Pages/CreatePost.tsx'
import AdminRoute from './Components/AdminRoute.tsx'
import UpdatePost from './Pages/UpdatePost.tsx'
import PostPage from './Pages/PostPage.tsx'
import { ScrollToTop } from './Components/ScrollToTop.tsx'



function App() {


  return (
      <BrowserRouter>
      <ScrollToTop/>
      <Header/>
          <Routes>
              <Route path="/" element={<Home/>}/>
              <Route path="/about" element={<About/>}/>
              <Route path="/projects" element={<Projects/>}/>
              <Route path="/register" element={<Register/>}/>
              <Route path="/login" element={<Login/>}/>
              <Route element={<PrivateRoute/>}>
                  <Route path="/dashboard" element={<DashBoard/>}/>
              </Route>
              <Route element={<AdminRoute/>}>
                  <Route path="/createPost" element={<CreatePost/>}/>
                  <Route path="/updatePost/:postId" element={<UpdatePost/>}/>
              </Route>
              <Route path="/post/:postSlug" element={<PostPage/>}/>
          </Routes>
          <Footer/>
      </BrowserRouter>
  )
}

export default App