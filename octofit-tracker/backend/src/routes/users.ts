import { Router } from 'express';
import { Activity, Leaderboard, Team, User, IUser } from '../models';
import { pick } from '../utils/pick';
import { getWorkoutSuggestions } from '../services/suggestions';

const USER_FIELDS = ['name', 'email', 'role', 'grade', 'fitnessLevel'] as const;

const router = Router();

router.get('/', async (req, res) => {
  const filter: Record<string, string> = {};
  if (req.query.role === 'student' || req.query.role === 'teacher') {
    filter.role = req.query.role;
  }
  const users = await User.find(filter).populate('team', 'name').sort({ name: 1 });
  res.json(users);
});

router.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id).populate('team', 'name');
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

router.get('/:id/suggestions', async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(await getWorkoutSuggestions(user));
});

router.post('/', async (req, res) => {
  const user = await User.create(pick<IUser>(req.body, USER_FIELDS));
  res.status(201).json(user);
});

router.put('/:id', async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, pick<IUser>(req.body, USER_FIELDS), {
    new: true,
    runValidators: true,
  });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

router.delete('/:id', async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  await Promise.all([
    Activity.deleteMany({ user: user._id }),
    Leaderboard.deleteOne({ user: user._id }),
    Team.updateMany({ members: user._id }, { $pull: { members: user._id } }),
    Team.updateMany({ coach: user._id }, { $unset: { coach: 1 } }),
  ]);
  res.status(204).end();
});

export default router;
