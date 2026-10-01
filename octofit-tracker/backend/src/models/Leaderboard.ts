import { Schema, model, Types } from 'mongoose';

export interface ILeaderboard {
  user: Types.ObjectId;
  team?: Types.ObjectId;
  points: number;
  totalMinutes: number;
  totalActivities: number;
}

const leaderboardSchema = new Schema<ILeaderboard>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    team: { type: Schema.Types.ObjectId, ref: 'Team' },
    points: { type: Number, default: 0 },
    totalMinutes: { type: Number, default: 0 },
    totalActivities: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Leaderboard = model<ILeaderboard>('Leaderboard', leaderboardSchema, 'leaderboard');
