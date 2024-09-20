import mongoose from "mongoose";
const connectMongo = async () =>
  mongoose.connect(
    process.env.DB as string,
    
  );
export default connectMongo;
