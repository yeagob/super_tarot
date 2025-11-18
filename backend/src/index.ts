// IMPORTANTE: dotenv.config() debe estar PRIMERO antes de cualquier otro import
// para que las variables de entorno estén disponibles cuando se inicialicen los servicios
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import tarotRoutes from './routes/tarot.routes';
import geminiRoutes from './routes/gemini.routes';
import musicRoutes from './routes/music.routes';
import editorRoutes from './routes/editor.routes';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api/tarot', tarotRoutes);
app.use('/api/gemini', geminiRoutes);
app.use('/api/music', musicRoutes);
app.use('/api/editor', editorRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Tarot API is running' });
});

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

app.listen(PORT, () => {
  console.log(`🔮 Tarot API server running on http://localhost:${PORT}`);
  console.log(`📡 CORS enabled for: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`);
});
