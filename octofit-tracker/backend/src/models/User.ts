import { Schema, model, Types } from 'mongoose';

export type UserRole = 'student' | 'teacher';

export interface IUser {
  name: string;
  email: string;
  role: UserRole;
  grade?: string;
  team?: Types.ObjectId;
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    role: { type: String, enum: ['student', 'teacher'], default: 'student' },
    grade: { type: String, trim: true, maxlength: 20 },
    team: { type: Schema.Types.ObjectId, ref: 'Team' },
    fitnessLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
  },
  { timestamps: true }
);

export const User = model<IUser>('User', userSchema, 'users');
