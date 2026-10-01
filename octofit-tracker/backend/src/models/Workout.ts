import { Schema, model } from 'mongoose';
import { ACTIVITY_TYPES, ActivityType } from './Activity';

export interface IWorkout {
  title: string;
  description: string;
  category: ActivityType;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  durationMinutes: number;
}

const workoutSchema = new Schema<IWorkout>(
  {
    title: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, required: true, trim: true, maxlength: 1000 },
    category: { type: String, enum: ACTIVITY_TYPES, required: true },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true,
    },
    durationMinutes: { type: Number, required: true, min: 1, max: 600 },
  },
  { timestamps: true }
);

export const Workout = model<IWorkout>('Workout', workoutSchema, 'workouts');
