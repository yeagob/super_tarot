import { Router } from 'express';
import editorController from '../controllers/editor.controller';

const router = Router();

// Rutas de mazos
router.get('/decks', editorController.listDecks);
router.get('/decks/:deckId', editorController.getDeck);
router.post('/decks', editorController.createDeck);
router.put('/decks/:deckId', editorController.updateDeck);
router.delete('/decks/:deckId', editorController.deleteDeck);
router.post('/decks/:deckId/duplicate', editorController.duplicateDeck);

// Rutas de cartas
router.post('/decks/:deckId/cards', editorController.addCard);
router.put('/decks/:deckId/cards/:cardId', editorController.updateCard);
router.delete('/decks/:deckId/cards/:cardId', editorController.deleteCard);

export default router;
