import { Router } from 'express';
import { isValidObjectId } from 'mongoose';
import { Leaderboard } from '../models';

const router = Router();

router.get('/', async (req, res) => {
  const filter: Record<string, string> = {};
  if (typeof req.query.team === 'string' && isValidObjectId(req.query.team)) {
    filter.team = req.query.team;
  }
  const entries = await Leaderboard.find(filter)
    .populate('user', 'name email role grade')
    .populate('team', 'name')
    .sort({ points: -1, totalMinutes: -1 })
    .lean();
  res.json(entries.map((entry, index) => ({ ...entry, rank: index + 1 })));
});

router.get('/teams', async (_req, res) => {
  const teams = await Leaderboard.aggregate([
    { $match: { team: { $ne: null } } },
    {
      $group: {
        _id: '$team',
        points: { $sum: '$points' },
        totalMinutes: { $sum: '$totalMinutes' },
        members: { $sum: 1 },
      },
    },
    { $lookup: { from: 'teams', localField: '_id', foreignField: '_id', as: 'team' } },
    { $unwind: '$team' },
    { $project: { _id: 0, team: { _id: '$team._id', name: '$team.name' }, points: 1, totalMinutes: 1, members: 1 } },
    { $sort: { points: -1 } },
  ]);
  res.json(teams.map((entry, index) => ({ ...entry, rank: index + 1 })));
});

export default router;
