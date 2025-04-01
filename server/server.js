import cors from 'cors';
import express from 'express';
import 'dotenv/config';
import cookieParser from 'cookie-parser';

import connectDB from './config/mongodb.js';
import authRouter from './routes/authRoutes.js';

const app = express();
const port = process.env.PORT || 4000;

connectDB();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({credentials: true}));

// API ENDPOINT
app.use('/api/auth', authRouter);

app.listen(port, () => console.log(`Server is running on port ${port}`));