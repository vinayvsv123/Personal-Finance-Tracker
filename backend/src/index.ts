import dotenv from 'dotenv';
import connectDB from './config/db.js';
import app from './app.js';

dotenv.config();

const PORT=process.env.PORT || 5000;

const server=async (): Promise<void>=>{
  try
  {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    }); 
  }
    catch(error)
    {
        console.error('Failed to start the server:', error);
        process.exit(1);
    }
}

server();

