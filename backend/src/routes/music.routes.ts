import { Router } from 'express';
import musicController from '../controllers/music.controller';

const router = Router();

// Music styles
router.get('/styles', musicController.getMusicStyles);
router.get('/styles/:styleId', musicController.getMusicStyleById);

// Lyrics generation (only Gemini, no Suno required)
router.post('/generate-lyrics', musicController.generateLyrics);

// Complete song generation (Gemini + Suno if enabled)
router.post('/generate-song', musicController.generateCompleteSong);

// Song status
router.get('/song/:songId', musicController.getSongStatus);

// Suno API status
router.get('/suno-status', musicController.checkSunoStatus);

export default router;
