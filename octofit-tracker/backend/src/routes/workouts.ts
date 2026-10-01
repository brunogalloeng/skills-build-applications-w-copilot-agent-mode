import { Router } from 'express';
import { Workout, IWorkout } from '../models';
import { pick } from '../utils/pick';

const WORKOUT_FIELDS = ['title', 'description', 'category', 'difficulty', 'durationMinutes'] as const;

const router = Router();

router.get('/', async (req, res) => {
  const filter: Record<string, string> = {};
  if (typeof req.query.difficulty === 'string') filter.difficulty = req.query.difficulty;
  if (typeof req.query.category === 'string') filter.category = req.query.category;
  res.json(await Workout.find(filter).sort({ difficulty: 1, title: 1 }));
});

router.get('/:id', async (req, res) => {
  const workout = await Workout.findById(req.params.id);
  if (!workout) return res.status(404).json({ error: 'Workout not found' });
  res.json(workout);
});

router.post('/', async (req, res) => {
  const workout = await Workout.create(pick<IWorkout>(req.body, WORKOUT_FIELDS));
  res.status(201).json(workout);
});

router.delete('/:id', async (req, res) => {
  const workout = await Workout.findByIdAndDelete(req.params.id);
  if (!workout) return res.status(404).json({ error: 'Workout not found' });
  res.status(204).end();
});

export default router;
