import express from "express"
import { UserRegister,UserLogin,GoogleAuth, UpdateUser, DeleteUser,LogoutUser, UserCreatePost, GetAllPosts, DeletePost, UpdatePost, GetAllUsers, AdminDeleteUser, GetPostBySlug, UserPostComment,UserGetComments, GetUserById, LikeComment } from './../Controllers/UserController';
import { VerifyUser } from './../Utils/VerifyUser';




const UserRouter = express.Router()


// ? REGISTER USER ? \\
UserRouter.post('/register',UserRegister)
// ? REGISTER USER ? \\



// ? LOGIN USER ? \\
UserRouter.post('/login',UserLogin)
// ? LOGIN USER ? \\



// ? UPDATE USER ? \\
UserRouter.put('/update/:userId',VerifyUser, UpdateUser);
// ? UPDATE USER ? \\



// ? DELETE PROFILE ? \\
UserRouter.delete('/delete/:userId',VerifyUser, DeleteUser);
// ? DELETE PROFILE ? \\



// ? ADMIN DELETE USER ? \\
UserRouter.delete('/adminDeleteUsers/:userId',VerifyUser, AdminDeleteUser);
// ? ADMIN DELETE USER ? \\



// ? LOGOUT USER ? \\
UserRouter.get('/logout',LogoutUser)
// ? LOGOUT USER ? \\


// ? USER POST CONTENT ? \\
UserRouter.post('/createPost',VerifyUser, UserCreatePost)
// ? USER POST CONTENT ? \\



// ? GET ALL POSTS ? \\
UserRouter.get('/getAllPosts', GetAllPosts)
// ? GET ALL POSTS ? \\



// ? GET POST BY SLUG ? \\
UserRouter.get('/getPost/:postSlug',GetPostBySlug)
// ? GET POST BY SLUG ? \\



// ? UPDATE POST ? \\
UserRouter.put('/updatePost/:postId/:userId',VerifyUser, UpdatePost)
// ? UPDATE POST ? \\



// ? DELETE POST ? \\
UserRouter.delete('/deletePost/:postId/:userId',VerifyUser, DeletePost)
// ? DELETE POST ? \\



// ? GET ALL USERS ? \\
UserRouter.get('/getAllUsers',VerifyUser, GetAllUsers)
// ? GET ALL USERS ? \\



// ? CREATE COMMENT ? \\
UserRouter.post('/postComment',VerifyUser, UserPostComment)
// ? CREATE COMMENT ? \\



// ? GET COMMENTS ? \\
UserRouter.get('/getComments/:postId',VerifyUser, UserGetComments)
// ? GET COMMENTS ? \\




// ? LIKE COMMENT ? \\
UserRouter.put('/likeComment/:commentId',VerifyUser, LikeComment)
// ? LIKE COMMENT ? \\



// ? GET USER BY ID ? \\
UserRouter.get('/getUserById/:userId',VerifyUser, GetUserById)
// ? GET USER BY ID ? \\


// ? GOOGLE AUTH ? \\
UserRouter.post('/google',GoogleAuth)
// ? GOOGLE AUTH ? \\



export default UserRouter