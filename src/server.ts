import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import authRoutes from './routes/authRoutes';
import studentRoutes from './routes/studentRoutes';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), 'public')));

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);

app.get('/health', (_request, response) => {
  response.json({ success: true, message: 'Server aktif.' });
});

if (process.env.VERCEL !== '1') {
  app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
  });
}

export default app;
