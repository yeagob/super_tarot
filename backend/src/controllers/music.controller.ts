import { Request, Response } from 'express';
import sunoService from '../services/suno.service';
import { SongGenerationRequest } from '../types';

export class MusicController {
  /**
   * Obtiene todos los estilos musicales disponibles
   */
  getMusicStyles = async (req: Request, res: Response) => {
    try {
      const styles = sunoService.getMusicStyles();

      res.json({
        styles,
        count: styles.length,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error getting music styles:', error);
      res.status(500).json({
        error: 'Failed to get music styles',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * Obtiene un estilo musical específico por ID
   */
  getMusicStyleById = async (req: Request, res: Response) => {
    try {
      const { styleId } = req.params;

      if (!styleId) {
        return res.status(400).json({ error: 'Style ID is required' });
      }

      const style = sunoService.getMusicStyleById(styleId);

      if (!style) {
        return res.status(404).json({
          error: 'Style not found',
          styleId
        });
      }

      res.json({
        style,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error getting music style:', error);
      res.status(500).json({
        error: 'Failed to get music style',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * Genera solo la letra de una canción usando Gemini
   */
  generateLyrics = async (req: Request, res: Response) => {
    try {
      const songRequest: SongGenerationRequest = req.body;

      if (!songRequest.readingSummary) {
        return res.status(400).json({ error: 'Reading summary is required' });
      }

      if (!songRequest.styleId) {
        return res.status(400).json({ error: 'Style ID is required' });
      }

      const lyricsResponse = await sunoService.generateSongLyrics(songRequest);

      res.json({
        ...lyricsResponse,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error generating lyrics:', error);
      res.status(500).json({
        error: 'Failed to generate lyrics',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * Genera una canción completa (letra + audio con Suno si está habilitado)
   */
  generateCompleteSong = async (req: Request, res: Response) => {
    try {
      const songRequest: SongGenerationRequest = req.body;

      if (!songRequest.readingSummary) {
        return res.status(400).json({ error: 'Reading summary is required' });
      }

      if (!songRequest.styleId) {
        return res.status(400).json({ error: 'Style ID is required' });
      }

      const result = await sunoService.generateCompleteSong(songRequest);

      res.json({
        ...result,
        sunoEnabled: sunoService.isSunoApiEnabled(),
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error generating complete song:', error);
      res.status(500).json({
        error: 'Failed to generate complete song',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * Consulta el estado de una canción en generación
   */
  getSongStatus = async (req: Request, res: Response) => {
    try {
      const { songId } = req.params;

      if (!songId) {
        return res.status(400).json({ error: 'Song ID is required' });
      }

      if (!sunoService.isSunoApiEnabled()) {
        return res.status(503).json({
          error: 'Suno API is not enabled',
          message: 'Song status checking requires Suno API to be configured'
        });
      }

      const songStatus = await sunoService.getSongStatus(songId);

      res.json({
        ...songStatus,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error getting song status:', error);
      res.status(500).json({
        error: 'Failed to get song status',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * Verifica si la API de Suno está habilitada
   */
  checkSunoStatus = async (req: Request, res: Response) => {
    try {
      const enabled = sunoService.isSunoApiEnabled();

      res.json({
        enabled,
        message: enabled
          ? 'Suno API is enabled and configured'
          : 'Suno API is disabled or not configured',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error checking Suno status:', error);
      res.status(500).json({
        error: 'Failed to check Suno status',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
}

export default new MusicController();
