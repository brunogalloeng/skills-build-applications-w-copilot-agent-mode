import { Router } from 'express';
import { isValidObjectId } from 'mongoose';
import { Activity, ACTIVITY_TYPES, IActivity, User } from '../models';
import { pick } from '../utils/pick';
import { updateLeaderboardForUser } from '../services/leaderboard';

const ACTIVITY_FIELDS = ['user', 'type', 'durationMinutes', 'distanceKm', 'calories', 'date', 'notes'] as const;

const router = Router();

router.get('/types', (_req, res) => {
  res.json(ACTIVITY_TYPES);
});

router.get('/', async (req, res) => {
  const filter: Record<string, string> = {};
  if (typeof req.query.user === 'string' && isValidObjectId(req.query.user)) {
    filter.user = req.query.user;
  }
  const activities = await Activity.find(filter)
    .populate('user', 'name email')
    .sort({ date: -1 })
    .limit(200);
  res.json(activities);
});

router.post('/', async (req, res) => {
  const data = pick<IActivity>(req.body, ACTIVITY_FIELDS);
  if (!data.user || !(await User.exists({ _id: data.user }))) {
    return res.status(400).json({ error: 'A valid user is required' });
  }
  const activity = await Activity.create(data);
  await updateLeaderboardForUser(activity.user);
  res.status(201).json(activity);
});

router.delete('/:id', async (req, res) => {
  const activity = await Activity.findByIdAndDelete(req.params.id);
  if (!activity) return res.status(404).json({ error: 'Activity not found' });
  await updateLeaderboardForUser(activity.user);
  res.status(204).end();
});

export default router;
