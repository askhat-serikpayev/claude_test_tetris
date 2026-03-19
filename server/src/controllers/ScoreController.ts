import { Request, Response, NextFunction } from 'express';
import { ScoreService } from '../services/ScoreService';
import { CreateScoreData } from '../models/Score';

export class ScoreController {
  private readonly scoreService: ScoreService;

  constructor(scoreService: ScoreService) {
    this.scoreService = scoreService;
  }

  create = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = req.body as CreateScoreData;
      const score = this.scoreService.createScore(data);
      res.status(201).json(score.toJSON());
    } catch (err) {
      next(err);
    }
  };

  getById = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const id = parseInt(String(req.params['id'] ?? '0'), 10);
      const score = this.scoreService.getScoreById(id);
      res.json(score.toJSON());
    } catch (err) {
      next(err);
    }
  };

  getLeaderboard = (_req: Request, res: Response, next: NextFunction): void => {
    try {
      const scores = this.scoreService.getLeaderboard();
      res.json(scores.map((s) => s.toJSON()));
    } catch (err) {
      next(err);
    }
  };

  delete = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const id = parseInt(String(req.params['id'] ?? '0'), 10);
      this.scoreService.deleteScore(id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}
