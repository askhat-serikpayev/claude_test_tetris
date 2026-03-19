import { Router } from 'express';
import { z } from 'zod';
import { ScoreController } from '../controllers/ScoreController';
import { ScoreService } from '../services/ScoreService';
import { validate } from '../middleware/validate';

const createScoreSchema = z.object({
  playerName: z.string().min(1).max(50),
  score: z.number().int().min(0),
  level: z.number().int().min(1),
  linesCleared: z.number().int().min(0),
});

export function createScoreRoutes(): Router {
  const router = Router();
  const scoreService = new ScoreService();
  const controller = new ScoreController(scoreService);

  router.post('/', validate(createScoreSchema), controller.create);
  router.get('/leaderboard', controller.getLeaderboard);
  router.get('/:id', controller.getById);
  router.delete('/:id', controller.delete);

  return router;
}
