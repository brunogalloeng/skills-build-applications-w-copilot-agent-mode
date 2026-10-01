import { Schema, model, Types } from 'mongoose';

export const ACTIVITY_TYPES = [
  'running',
  'walking',
  'cycling',
  'swimming',
  'strength',
  'yoga',
  'team-sport',
  'other',
] as const;

export type ActivityType = (typeof ACTIVITY_TYPES)[number];

export interface IActivity {
  user: Types.ObjectId;
  type: ActivityType;
  durationMinutes: number;
  distanceKm?: number;
  calories?: number;
  date: Date;
  notes?: string;
}

const activitySchema = new Schema<IActivity>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ACTIVITY_TYPES, required: true },
    durationMinutes: { type: Number, required: true, min: 1, max: 600 },
    distanceKm: { type: Number, min: 0, max: 500 },
    calories: { type: Number, min: 0, max: 10000 },
    date: { type: Date, default: Date.now },
    notes: { type: String, trim: true, maxlength: 500 },
  },
  { timestamps: true }
);

export const Activity = model<IActivity>('Activity', activitySchema, 'activities');
