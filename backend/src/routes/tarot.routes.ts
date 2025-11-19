import { Router } from 'express';
import tarotController from '../controllers/tarot.controller';

const router = Router();

// Decks
router.get('/decks', tarotController.getAllDecks);
router.get('/decks/:deckId', tarotController.getDeckById);
router.post('/decks/:deckId/shuffle', tarotController.shuffleAndDraw);

// Cards
router.get('/decks/:deckId/cards/:cardId', tarotController.getCard);

// Spreads
router.get('/spreads', tarotController.getAllSpreads);
router.get('/spreads/:spreadId', tarotController.getSpreadById);

export default router;
