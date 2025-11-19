import { Router } from 'express';
import geminiController from '../controllers/gemini.controller';

const router = Router();

// Reading generation
router.post('/reading', geminiController.generateReading);

// Image generation
router.post('/image-description', geminiController.generateCardImageDescription);
router.get('/card-placeholder/:deckId/:cardId', geminiController.getCardImagePlaceholder);

// Photo analysis
router.post('/analyze-photo', geminiController.analyzePhoto);

export default router;
