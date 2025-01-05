import { Request, Response, NextFunction } from "express";
import User from "../Models/UserModel"
import bcryptjs from "bcryptjs"
import {Error_Handler} from "../Utils/Error"
import jsonwebtoken from "jsonwebtoken"
import Post from "../Models/PostModel";
import Comment from "../Models/CommentModel";


interface CustomRequest extends Request {
  user?: {
    id: string;
    isAdmin?: boolean;
  }
}


interface PostQuery {
  startIndex?: string;
  limit?: string;
  order?: string;
  userId?: string;
  category?: string;
  slug?: string;
  postId?: string;
  searchTerm?: string;
}




// ? REGISTER USER ? \\

export const UserRegister = async (req: Request, res: Response, next : NextFunction): Promise<void> => {
    try {
      const { username, email, password } = req.body;
  
      if (!username || !email || !password || username === '' || email === '' || password === '') {
        next(Error_Handler(400, "Please Fill In All Fields"));
      }

      // ? Hash the password before saving the user ? \\
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(password, salt);
  
      const newUser = new User({
        username,
        email,
        password: hashedPassword
      });
  
      await newUser.save();
  
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error registering user:", error.message);
        res.status(500).json({ message: "Error registering user", error: error.message });
      } else {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Error registering user", error });
      }
    }
  };

  // ? REGISTER USER ? \\






// ? LOGIN USER ? \\

export const UserLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password || email === '' || password === '') {
      return next(Error_Handler(400, "Please Fill In All Fields"));
    }

    const validUser = await User.findOne({email});

    if (!validUser) {
      return next(Error_Handler(400, "Invalid Credentials"));
    }

    const validPassword = await bcryptjs.compareSync(password, validUser.password);

    if (!validPassword) {
      return next(Error_Handler(400, "Invalid Credentials"));
    }

    const token = jsonwebtoken.sign({id:validUser._id,isAdmin:validUser.isAdmin},process.env.JWT_SECRET as string,{expiresIn:"1d"});

    res.status(200).cookie('token', token,{
      httpOnly:true,
    }).json(validUser);

  } catch (error) {
    if (error instanceof Error) {
      console.error("Error logging in user:", error.message);
      res.status(500).json({ message: "Error logging in user", error: error.message });
    } else {
      console.error("Error logging in user:", error);
      res.status(500).json({ message: "Error logging in user", error });
    }
  }
};

// ? LOGIN USER ? \\






// ? GOOGLE AUTH ? \\
export const GoogleAuth = async (req:Request,res:Response,next:NextFunction) => {

  const {email,name,photoUrl} = req.body

  try {
    
    const validUser = await User.findOne({email});

    if (validUser) {
      const token = jsonwebtoken.sign({id:validUser._id,isAdmin:validUser.isAdmin},process.env.JWT_SECRET as string,{expiresIn:"1d"});
      const {password,...rest} = validUser.toObject();

      res.status(200).cookie('token',token,{
        httpOnly:true,
      }).json(rest)
    }else{
      const generatePassword = email + Date.now().toString().slice(0,5)+Math.random().toString(36).slice(2,7);
      const hashedPassword = bcryptjs.hash(generatePassword,10);
      const newUser = new User({
        username:name.toLowerCase().split(' ').join('')+Math.random().toString(36).slice(2,7),
        email,
        password:await hashedPassword,
        profilePicture:photoUrl
      })
      await newUser.save();
      const token = jsonwebtoken.sign({id:newUser._id,isAdmin:newUser.isAdmin},process.env.JWT_SECRET as string,{expiresIn:"1d"});
      const {password,...rest} = newUser;
      res.status(200).cookie('token',token,{
        httpOnly:true,
      }).json(rest)
    }

  } catch (error) {
    next(error)
  }

}
// ? GOOGLE AUTH ? \\




// ? UPDATE USER ? \\
export const UpdateUser = async (req:CustomRequest, res:Response, next:NextFunction) : Promise<void> => {
  if (!req.user?.id || req.user.id !== req.params.userId) {
    return next(Error_Handler(403, 'You are not allowed to update this user'));
  }
  if (req.body.password) {
    if (req.body.password.length < 8 || req.body.password.length === 0) {
      return next(Error_Handler(400, 'Password must be at least 8 characters'));
    }
    req.body.password = bcryptjs.hashSync(req.body.password, 10);
  }
  if (req.body.username) {
    if (req.body.username.length < 3 || req.body.username.length > 20) {
      return next(
        Error_Handler(400, 'Username must be between 3 and 20 characters')
      );
    }
    if (req.body.username.includes(' ')) {
      return next(Error_Handler(400, 'Username cannot contain spaces'));
    }
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        Error_Handler(400, 'Username can only contain letters and numbers')
      );
    }
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          profilePicture: req.body.profilePicture,
          password: req.body.password,
        },
      },
      { new: true }
    );
    if (!updatedUser) {
      return next(Error_Handler(404, 'User not found'));
    }
    const { password, ...rest } = updatedUser.toObject();
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
// ? UPDATE USER ? \\




// ? DELETE PROFILE ? \\
export const DeleteUser = async (req:CustomRequest, res:Response, next:NextFunction) : Promise<void> => {
  const userId = req.params.userId;
  if (!req.user?.id || req.user.id !== userId) {
    return next(Error_Handler(403, 'You are not allowed to delete this user'));
  }
  try {
    await User.findByIdAndDelete(userId);
    res.status(200).json({message:"User deleted successfully"});
  } catch (error) {
    next(error);
  }
}
// ? DELETE PROFILE ? \\



// ? ADMIN DELETE USER ? \\
export const AdminDeleteUser = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // ? Check if user exists and is admin ? \\
    if (!req.user || !req.user.isAdmin) {
      return next(Error_Handler(403, 'Only Admins Can Delete Users!'));
    }

    const userId = req.params.userId;
    
    // ? Check if userId is valid ? \\
    if (!userId) {
      return next(Error_Handler(400, 'User ID is required'));
    }

    // ? Check if user to be deleted exists ? \\
    const userToDelete = await User.findById(userId);
    if (!userToDelete) {
      return next(Error_Handler(404, 'User not found'));
    }

    // ? Prevent admin from deleting themselves ? \\
    if (userId === req.user.id) {
      return next(Error_Handler(403, 'Admin cannot delete themselves'));
    }

    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "User deleted successfully" });
    
  } catch (error) {
    next(error);
  }
}
// ? ADMIN DELETE USER ? \\




// ? LOGOUT USER ? \\
export const LogoutUser = async (req:Request, res:Response, next:NextFunction) : Promise<void> => {
  res.clearCookie('token')
  res.status(200).json({message:"Logged Out Successfully"});
}
// ? LOGOUT USER ? \\




// ? USER POST CONTENT ? \\
export const UserCreatePost = async (req:CustomRequest, res:Response, next:NextFunction) : Promise<void> => {

  if(!req.user?.isAdmin){
    return next(Error_Handler(403, 'You Are Not Allowed To Create A Post'));
  }

  if(!req.body.title || !req.body.category || !req.body.content || !req.body.image){
    return next(Error_Handler(400, 'Please Fill In All Fields'));
  }

  const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-z0-9]/g,'');

  const newPost = new Post({
    ...req.body,
    slug,
    userId:req.user.id,
  })

try {
  const savedPost = await newPost.save();
  res.status(201).json({
    message:"Post Created Successfully",
    post:savedPost,
    success:true,
    slug:savedPost.slug
  })
} catch (error) {
  next(error);
}

}
// ? USER POST CONTENT ? \\




// ? GET ALL POSTS ? \\
export const GetAllPosts = async (req:CustomRequest & { query:PostQuery},res:Response,next:NextFunction):Promise<void> => {
  try {
    const startIndex = parseInt(req.query.startIndex as string) || 0;
    const limit = parseInt(req.query.limit as string) || 9;
    const sortDirection = req.query.order === 'asc' ? 1 : -1;

    // Create a filter object to reuse
    const filter = {
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: 'i' } },
          { content: { $regex: req.query.searchTerm, $options: 'i' } },
        ],
      }),
    };
    
    const posts = await Post.find(filter)
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalPosts = await Post.countDocuments(filter);

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts,
    });
  } catch (error) {
    next(error);
  }
}
// ? GET ALL POSTS ? \\





// ? GET POST BY SLUG - GET SINGLE POST ? \\
export const GetPostBySlug = async (req:CustomRequest, res:Response, next:NextFunction) : Promise<void> => {
  if(!req.params.postSlug){
    return next(Error_Handler(400, 'Post Slug Is Required'));
  }
  try {
    const post = await Post.findOne({slug:req.params.postSlug});
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
}
// ? GET POST BY SLUG - GET SINGLE POST ? \\





// ? DELETE POST ? \\
export const DeletePost = async (req:CustomRequest, res:Response, next:NextFunction) : Promise<void> => {
if(!req.user?.isAdmin || req.user?.id !== req.params.userId){
  return next(Error_Handler(403, 'You Are Not Allowed To Delete This Post'));
}
try {
  await Post.findByIdAndDelete(req.params.postId);
  res.status(200).json('Post Has Been Deleted Successfully !');
} catch (error) {
  next(error);
}
}
// ? DELETE POST ? \\





// ? UPDATE POST ? \\
export const UpdatePost = async (req:CustomRequest, res:Response, next:NextFunction) : Promise<void> => {
  if(!req.user?.isAdmin || req.user?.id !== req.params.userId){
    return next(Error_Handler(403, 'You Are Not Allowed To Update This Post'));
  }
  try {
    const updatedPost = await Post.findByIdAndUpdate(req.params.postId,
      {$set:{title:req.body.title,category:req.body.category,content:req.body.content,image:req.body.image}},
      {new:true},
    )
    res.status(200).json(updatedPost)
  } catch (error) {
    next(error);
  }
}
// ? UPDATE POST ? \\






// ? GET ALL USERS ? \\
export const GetAllUsers = async (req:CustomRequest, res:Response, next:NextFunction) : Promise<void> => {
  if(!req.user?.isAdmin){
    return next(Error_Handler(403, 'You Are Not Allowed To Get All Users'));
  }
  try {
    const startIndex = parseInt(req.query.startIndex as string) || 0;
    const limit = parseInt(req.query.limit as string) || 9;
    const sortDirection = req.query.sort === 'asc' ? 1 : -1;
    const users = await User.find().sort({createdAt:sortDirection}).skip(startIndex).limit(limit);
    const usersWithoutPassword = users.map((user) => {
      const {password,...rest} = user.toObject();
      return rest;
    })
    const totalUsers = await User.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(),now.getMonth()-1,now.getDate());
    const lastMonthUsers = await User.countDocuments({createdAt:{
      $gte:oneMonthAgo
    }});
    res.status(200).json({
      users:usersWithoutPassword,
      totalUsers,
      lastMonthUsers,
    });
  } catch (error) {
    next(error);
  }
}
// ? GET ALL USERS ? \\





// ? USER POST COMMENT ? \\
export const UserPostComment = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      return next(Error_Handler(403, 'You must be logged in to comment'));
    }

    const { content, postId, userId } = req.body;

    // Verify the user is commenting as themselves
    if (userId !== req.user.id) {
      return next(Error_Handler(403, 'You can only comment as yourself'));
    }

    if (!content || !postId || !userId) {
      return next(Error_Handler(400, 'Please fill in all fields'));
    }

    const newComment = new Comment({ content, postId, userId });
    await newComment.save();
    res.status(200).json(newComment);
  } catch (error) {
    next(error);
  }
}
// ? USER POST COMMENT ? \\






// ? GET USER COMMENTS ? \\
export const UserGetComments = async (req:CustomRequest, res:Response, next:NextFunction) : Promise<void> => {
  try {
    const comments = await Comment.find({postId:req.params.postId}).sort({createdAt:-1});
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
}
// ? GET USER COMMENTS ? \\





// ? GET USER BY ID ? \\
export const GetUserById = async (req:CustomRequest, res:Response, next:NextFunction) : Promise<void> => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return next(Error_Handler(404, 'User not found'));
    }
    const {password, ...rest} = user.toObject();
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
}
// ? GET USER BY ID ? \\





// ? LIKE COMMENT ? \\
export const LikeComment = async (req:CustomRequest, res:Response, next:NextFunction) : Promise<void> => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if(!comment){
      return next(Error_Handler(404, 'Comment Not Found'));
    }
    const userIndex = comment.likes.indexOf(req?.user?.id);
    if(userIndex === -1){
      comment.numberOfLikes += 1;
      comment.likes.push(req?.user?.id);
    }else{
      comment.numberOfLikes -= 1;
      comment.likes.splice(userIndex,1);
    }
    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
}
// ? LIKE COMMENT ? \\






// ? UPDATE COMMENT ? \\
export const UpdateComment = async (req:CustomRequest, res:Response, next:NextFunction) : Promise<void> => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if(!comment){
      return next(Error_Handler(404, 'Comment Not Found'));
    }
    if(comment.userId !== req.user?.id && !req.user?.isAdmin){
      return next(Error_Handler(403, 'You Are Not Allowed To Update This Comment'));
    }
    const updatedComment = await Comment.findByIdAndUpdate(req.params.commentId,{$set:{content:req.body.content}},{new:true});
    res.status(200).json(updatedComment);
  } catch (error) {
    next(error);
  }
}
// ? UPDATE COMMENT ? \\






// ? DELETE COMMENT ? \\
export const DeleteComment = async (req:CustomRequest, res:Response, next:NextFunction) : Promise<void> => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if(!comment){
      return next(Error_Handler(404, 'Comment Not Found'));
    }
    if(comment.userId !== req.user?.id && !req.user?.isAdmin){
      return next(Error_Handler(403, 'You Are Not Allowed To Delete This Comment'));
    }
    await Comment.findByIdAndDelete(req.params.commentId);
    res.status(200).json({
      message:'Comment Has Been Deleted Successfully !',
      success:true,
      deleted:true,
    });

  } catch (error) {
    next(error);
  }
}
// ? DELETE COMMENT ? \\






// ? GET ALL COMMENTS ? \\
export const GetAllComments = async (req:CustomRequest, res:Response, next:NextFunction) : Promise<void> => {
  try {
    if(!req.user?.isAdmin){
      return next(Error_Handler(403, 'You Are Not Allowed To Get All Comments'));
    }
    const startIndex = parseInt(req.query.startIndex as string) || 0;
    const limit = parseInt(req.query.limit as string) || 9;
    const sortDirection = req.query.order === 'asc' ? 1 : -1;
    const comments = await Comment.find().sort({createdAt:sortDirection}).skip(startIndex).limit(limit);
    const totalComments = await Comment.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(),now.getMonth()-1,now.getDate());
    const lastMonthComments = await Comment.countDocuments({createdAt:{
      $gte:oneMonthAgo
    }});
    res.status(200).json({
      comments,
      totalComments,
      lastMonthComments,
      success:true,
    });
  } catch (error) {
    next(error);
  }
}
// ? GET ALL COMMENTS ? \\



































// export const GetAllPosts = async (req:CustomRequest & { query:PostQuery},res:Response,next:NextFunction):Promise<void> => {
//   try {
//     const startIndex = parseInt(req.query.startIndex as string) || 0;
//     const limit = parseInt(req.query.limit as string) || 9;
//     const sortDirection = req.query.order === 'asc' ? 1 : -1;


//     const posts = await Post.find({
//       ...(req.query.userId && { userId: req.query.userId }),
//       ...(req.query.category && { category: req.query.category }),
//       ...(req.query.slug && { slug: req.query.slug }),
//       ...(req.query.postId && { _id: req.query.postId }),
//       ...(req.query.searchTerm && {
//         $or: [
//           { title: { $regex: req.query.searchTerm, $options: 'i' } },
//           { content: { $regex: req.query.searchTerm, $options: 'i' } },
//         ],
//       }),
//     })
//       .sort({ updatedAt: sortDirection })
//       .skip(startIndex)
//       .limit(limit);

//     const totalPosts = await Post.countDocuments();

//     const now = new Date();

//     const oneMonthAgo = new Date(
//       now.getFullYear(),
//       now.getMonth() - 1,
//       now.getDate()
//     );

//     const lastMonthPosts = await Post.countDocuments({
//       createdAt: { $gte: oneMonthAgo },
//     });

//     res.status(200).json({
//       posts,
//       totalPosts,
//       lastMonthPosts,
//     });
//   } catch (error) {
//     next(error);
//   }
// }