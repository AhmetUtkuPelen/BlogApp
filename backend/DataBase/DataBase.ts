import mongoose from "mongoose"
import User from "../Models/UserModel";




const ConnectDataBase = async () => {
    const mongoUrl = process.env.MONGO_URL;
  
    if (!mongoUrl) {
      throw new Error("MONGO_URL Environment Variable Is Not Defined");
    }
  
    try {
      await mongoose.connect(mongoUrl);
      console.log("MongoDB Connection Is Successful!");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error Connecting To MongoDB:", error.message);
      } else {
        console.error("Error Connecting To MongoDB:", error);
      }
    }
  };
  


  export default ConnectDataBase;