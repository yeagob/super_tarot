import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

export class EditorController {
  private dataPath = path.join(__dirname, '../data');

  /**
   * Listar todos los mazos disponibles
   */
  listDecks = async (req: Request, res: Response) => {
    try {
      const files = fs.readdirSync(this.dataPath);
      const deckFiles = files.filter(f => f.startsWith('tarot-') && f.endsWith('.json'));

      const decks = deckFiles.map(file => {
        const filePath = path.join(this.dataPath, file);
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        return {
          id: data.id,
          name: data.name,
          description: data.description,
          cardCount: data.cards.length,
          fileName: file
        };
      });

      res.json(decks);
    } catch (error) {
      console.error('Error listing decks:', error);
      res.status(500).json({ error: 'Failed to list decks' });
    }
  };

  /**
   * Obtener un mazo específico con todas sus cartas
   */
  getDeck = async (req: Request, res: Response) => {
    try {
      const { deckId } = req.params;
      const fileName = `${deckId}.json`;
      const filePath = path.join(this.dataPath, fileName);

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'Deck not found' });
      }

      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      res.json(data);
    } catch (error) {
      console.error('Error getting deck:', error);
      res.status(500).json({ error: 'Failed to get deck' });
    }
  };

  /**
   * Crear un nuevo mazo
   */
  createDeck = async (req: Request, res: Response) => {
    try {
      const { id, name, description } = req.body;

      if (!id || !name) {
        return res.status(400).json({ error: 'ID and name are required' });
      }

      // Validar que el ID sea válido (solo letras, números y guiones)
      if (!/^tarot-[a-z0-9-]+$/.test(id)) {
        return res.status(400).json({
          error: 'Invalid ID format. Must start with "tarot-" and contain only lowercase letters, numbers and hyphens'
        });
      }

      const fileName = `${id}.json`;
      const filePath = path.join(this.dataPath, fileName);

      // Verificar que no exista ya
      if (fs.existsSync(filePath)) {
        return res.status(409).json({ error: 'Deck already exists' });
      }

      const newDeck = {
        id,
        name,
        description: description || '',
        cards: []
      };

      fs.writeFileSync(filePath, JSON.stringify(newDeck, null, 2), 'utf-8');
      console.log(`✅ Created new deck: ${name} (${id})`);

      res.status(201).json(newDeck);
    } catch (error) {
      console.error('Error creating deck:', error);
      res.status(500).json({ error: 'Failed to create deck' });
    }
  };

  /**
   * Actualizar un mazo completo
   */
  updateDeck = async (req: Request, res: Response) => {
    try {
      const { deckId } = req.params;
      const { name, description, cards } = req.body;

      const fileName = `${deckId}.json`;
      const filePath = path.join(this.dataPath, fileName);

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'Deck not found' });
      }

      const currentData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

      const updatedDeck = {
        ...currentData,
        name: name || currentData.name,
        description: description !== undefined ? description : currentData.description,
        cards: cards || currentData.cards
      };

      fs.writeFileSync(filePath, JSON.stringify(updatedDeck, null, 2), 'utf-8');
      console.log(`✅ Updated deck: ${updatedDeck.name} (${deckId})`);

      res.json(updatedDeck);
    } catch (error) {
      console.error('Error updating deck:', error);
      res.status(500).json({ error: 'Failed to update deck' });
    }
  };

  /**
   * Eliminar un mazo
   */
  deleteDeck = async (req: Request, res: Response) => {
    try {
      const { deckId } = req.params;
      const fileName = `${deckId}.json`;
      const filePath = path.join(this.dataPath, fileName);

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'Deck not found' });
      }

      // Crear backup antes de eliminar
      const backupPath = path.join(this.dataPath, `${deckId}.backup.json`);
      fs.copyFileSync(filePath, backupPath);

      fs.unlinkSync(filePath);
      console.log(`🗑️ Deleted deck: ${deckId} (backup created)`);

      res.json({ message: 'Deck deleted successfully', backup: backupPath });
    } catch (error) {
      console.error('Error deleting deck:', error);
      res.status(500).json({ error: 'Failed to delete deck' });
    }
  };

  /**
   * Añadir una carta a un mazo
   */
  addCard = async (req: Request, res: Response) => {
    try {
      const { deckId } = req.params;
      const cardData = req.body;

      const fileName = `${deckId}.json`;
      const filePath = path.join(this.dataPath, fileName);

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'Deck not found' });
      }

      const deck = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

      // Validar campos requeridos
      if (!cardData.id || !cardData.name) {
        return res.status(400).json({ error: 'Card ID and name are required' });
      }

      // Verificar que no exista una carta con el mismo ID
      if (deck.cards.some((c: any) => c.id === cardData.id)) {
        return res.status(409).json({ error: 'Card with this ID already exists' });
      }

      // Crear carta con valores por defecto
      const newCard = {
        id: cardData.id,
        name: cardData.name,
        description: cardData.description || '',
        keywords: cardData.keywords || [],
        uprightMeaning: cardData.uprightMeaning || '',
        reversedMeaning: cardData.reversedMeaning || '',
        arcana: cardData.arcana || 'major',
        number: cardData.number !== undefined ? cardData.number : null
      };

      deck.cards.push(newCard);
      fs.writeFileSync(filePath, JSON.stringify(deck, null, 2), 'utf-8');
      console.log(`✅ Added card "${newCard.name}" to deck ${deckId}`);

      res.status(201).json(newCard);
    } catch (error) {
      console.error('Error adding card:', error);
      res.status(500).json({ error: 'Failed to add card' });
    }
  };

  /**
   * Actualizar una carta específica
   */
  updateCard = async (req: Request, res: Response) => {
    try {
      const { deckId, cardId } = req.params;
      const cardData = req.body;

      const fileName = `${deckId}.json`;
      const filePath = path.join(this.dataPath, fileName);

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'Deck not found' });
      }

      const deck = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      const cardIndex = deck.cards.findIndex((c: any) => c.id === cardId);

      if (cardIndex === -1) {
        return res.status(404).json({ error: 'Card not found' });
      }

      // Actualizar carta manteniendo el ID
      deck.cards[cardIndex] = {
        ...deck.cards[cardIndex],
        ...cardData,
        id: cardId // Mantener el ID original
      };

      fs.writeFileSync(filePath, JSON.stringify(deck, null, 2), 'utf-8');
      console.log(`✅ Updated card "${deck.cards[cardIndex].name}" in deck ${deckId}`);

      res.json(deck.cards[cardIndex]);
    } catch (error) {
      console.error('Error updating card:', error);
      res.status(500).json({ error: 'Failed to update card' });
    }
  };

  /**
   * Eliminar una carta específica
   */
  deleteCard = async (req: Request, res: Response) => {
    try {
      const { deckId, cardId } = req.params;
      const fileName = `${deckId}.json`;
      const filePath = path.join(this.dataPath, fileName);

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'Deck not found' });
      }

      const deck = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      const cardIndex = deck.cards.findIndex((c: any) => c.id === cardId);

      if (cardIndex === -1) {
        return res.status(404).json({ error: 'Card not found' });
      }

      const deletedCard = deck.cards[cardIndex];
      deck.cards.splice(cardIndex, 1);

      fs.writeFileSync(filePath, JSON.stringify(deck, null, 2), 'utf-8');
      console.log(`🗑️ Deleted card "${deletedCard.name}" from deck ${deckId}`);

      res.json({ message: 'Card deleted successfully', card: deletedCard });
    } catch (error) {
      console.error('Error deleting card:', error);
      res.status(500).json({ error: 'Failed to delete card' });
    }
  };

  /**
   * Duplicar un mazo existente
   */
  duplicateDeck = async (req: Request, res: Response) => {
    try {
      const { deckId } = req.params;
      const { newId, newName } = req.body;

      if (!newId || !newName) {
        return res.status(400).json({ error: 'New ID and name are required' });
      }

      // Validar formato del nuevo ID
      if (!/^tarot-[a-z0-9-]+$/.test(newId)) {
        return res.status(400).json({
          error: 'Invalid ID format. Must start with "tarot-" and contain only lowercase letters, numbers and hyphens'
        });
      }

      const sourceFile = `${deckId}.json`;
      const sourcePath = path.join(this.dataPath, sourceFile);

      if (!fs.existsSync(sourcePath)) {
        return res.status(404).json({ error: 'Source deck not found' });
      }

      const newFile = `${newId}.json`;
      const newPath = path.join(this.dataPath, newFile);

      if (fs.existsSync(newPath)) {
        return res.status(409).json({ error: 'Deck with new ID already exists' });
      }

      const sourceDeck = JSON.parse(fs.readFileSync(sourcePath, 'utf-8'));

      const duplicatedDeck = {
        ...sourceDeck,
        id: newId,
        name: newName,
        description: `${sourceDeck.description} (Copia)`,
        cards: sourceDeck.cards.map((card: any) => ({
          ...card,
          id: card.id.replace(deckId.replace('tarot-', ''), newId.replace('tarot-', ''))
        }))
      };

      fs.writeFileSync(newPath, JSON.stringify(duplicatedDeck, null, 2), 'utf-8');
      console.log(`✅ Duplicated deck: ${deckId} -> ${newId}`);

      res.status(201).json(duplicatedDeck);
    } catch (error) {
      console.error('Error duplicating deck:', error);
      res.status(500).json({ error: 'Failed to duplicate deck' });
    }
  };
}

export default new EditorController();
