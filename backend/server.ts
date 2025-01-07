import express, { NextFunction, Request, Response } from "express"
import dotenv from "dotenv"
import cors from "cors";
import helmet from "helmet"
import ConnectDataBase from './DataBase/DataBase';
import UserRouter from './Routes/UserRoutes';
import {ErrorHandler} from "./Middlewares/ErrorHandler"
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import path from "path";



const __dirname = path.resolve();


const app = express();
dotenv.config()





// ? MIDDLEWARES ? \\
app.use(express.json())
app.use(cors({
  origin: 'http://localhost:5173',  // Frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(helmet())
app.use(ErrorHandler)
app.use(cookieParser())
app.use(bodyParser.json())
// ? MIDDLEWARES ? \\




// Add this before routes to debug
app.use((req:Request, res:Response, next:NextFunction) => {
  console.log('Request:', req.method, req.url);
  next();
});



// ? ROUTES ? \\
app.use('/api/users',UserRouter)
// ? ROUTES ? \\



// Test route
app.get('/api/test', (req:Request, res:Response) => {
  res.json({ message: 'API is working' });
});



app.use(express.static(path.join(__dirname, 'frontend/dist')));

app.get('*', (req:Request, res:Response) => {
  res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
})


// ? DATABASE ? \\
ConnectDataBase()
// ? DATABASE ? \\






// ? LISTEN TO THE SERVER ? \\
const PORT = process.env.PORT || 5555

app.listen(PORT , () => {
    console.log(`Server is running on port ${PORT}`)
})
// ? LISTEN TO THE SERVER ? \\