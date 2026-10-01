import { Schema, model, Types } from 'mongoose';

export interface ITeam {
  name: string;
  description?: string;
  goal?: string;
  coach?: Types.ObjectId;
  members: Types.ObjectId[];
}

const teamSchema = new Schema<ITeam>(
  {
    name: { type: String, required: true, unique: true, trim: true, maxlength: 100 },
    description: { type: String, trim: true, maxlength: 500 },
    goal: { type: String, trim: true, maxlength: 200 },
    coach: { type: Schema.Types.ObjectId, ref: 'User' },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

export const Team = model<ITeam>('Team', teamSchema, 'teams');
