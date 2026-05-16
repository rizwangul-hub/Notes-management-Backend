import mongoose from "mongoose";
 
export const connnectionDB=async ()=>{
    await mongoose.connect(process.env.MONGO_URL);
    console.log("DataBase are connected");
    

}