import mongoose from "mongoose";

const mongooseConnection = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected to database Successfully ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
  }
};

export default mongooseConnection;
