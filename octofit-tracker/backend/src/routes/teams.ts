import { Router } from 'express';
import { Leaderboard, Team, User, ITeam } from '../models';
import { pick } from '../utils/pick';

const TEAM_FIELDS = ['name', 'description', 'goal', 'coach'] as const;

const router = Router();

router.get('/', async (_req, res) => {
  const teams = await Team.find()
    .populate('members', 'name email role')
    .populate('coach', 'name email')
    .sort({ name: 1 });
  res.json(teams);
});

router.get('/:id', async (req, res) => {
  const team = await Team.findById(req.params.id)
    .populate('members', 'name email role')
    .populate('coach', 'name email');
  if (!team) return res.status(404).json({ error: 'Team not found' });
  res.json(team);
});

router.post('/', async (req, res) => {
  const team = await Team.create(pick<ITeam>(req.body, TEAM_FIELDS));
  res.status(201).json(team);
});

router.put('/:id', async (req, res) => {
  const team = await Team.findByIdAndUpdate(req.params.id, pick<ITeam>(req.body, TEAM_FIELDS), {
    new: true,
    runValidators: true,
  });
  if (!team) return res.status(404).json({ error: 'Team not found' });
  res.json(team);
});

router.delete('/:id', async (req, res) => {
  const team = await Team.findByIdAndDelete(req.params.id);
  if (!team) return res.status(404).json({ error: 'Team not found' });
  await Promise.all([
    User.updateMany({ team: team._id }, { $unset: { team: 1 } }),
    Leaderboard.updateMany({ team: team._id }, { $unset: { team: 1 } }),
  ]);
  res.status(204).end();
});

router.post('/:id/members', async (req, res) => {
  const userId = String(req.body?.userId ?? '');
  const [team, user] = await Promise.all([Team.findById(req.params.id), User.findById(userId)]);
  if (!team) return res.status(404).json({ error: 'Team not found' });
  if (!user) return res.status(404).json({ error: 'User not found' });

  // A student belongs to one team at a time.
  if (user.team && !user.team.equals(team._id)) {
    await Team.updateOne({ _id: user.team }, { $pull: { members: user._id } });
  }
  await Promise.all([
    Team.updateOne({ _id: team._id }, { $addToSet: { members: user._id } }),
    User.updateOne({ _id: user._id }, { team: team._id }),
    Leaderboard.updateOne({ user: user._id }, { team: team._id }),
  ]);
  res.json(await Team.findById(team._id).populate('members', 'name email role'));
});

router.delete('/:id/members/:userId', async (req, res) => {
  const team = await Team.findById(req.params.id);
  if (!team) return res.status(404).json({ error: 'Team not found' });
  await Promise.all([
    Team.updateOne({ _id: team._id }, { $pull: { members: req.params.userId } }),
    User.updateOne({ _id: req.params.userId, team: team._id }, { $unset: { team: 1 } }),
    Leaderboard.updateOne({ user: req.params.userId, team: team._id }, { $unset: { team: 1 } }),
  ]);
  res.status(204).end();
});

export default router;
