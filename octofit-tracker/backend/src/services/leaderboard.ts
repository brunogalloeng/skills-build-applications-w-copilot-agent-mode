import { Types } from 'mongoose';
import { Activity, Leaderboard, User } from '../models';

export function calculatePoints(durationMinutes: number, calories = 0): number {
  return Math.round(durationMinutes + calories / 10);
}

export async function updateLeaderboardForUser(userId: Types.ObjectId | string): Promise<void> {
  const id = new Types.ObjectId(String(userId));
  const [stats] = await Activity.aggregate<{
    totalMinutes: number;
    totalCalories: number;
    totalActivities: number;
  }>([
    { $match: { user: id } },
    {
      $group: {
        _id: '$user',
        totalMinutes: { $sum: '$durationMinutes' },
        totalCalories: { $sum: { $ifNull: ['$calories', 0] } },
        totalActivities: { $sum: 1 },
      },
    },
  ]);

  const user = await User.findById(id);
  if (!user) {
    await Leaderboard.deleteOne({ user: id });
    return;
  }

  await Leaderboard.findOneAndUpdate(
    { user: id },
    {
      user: id,
      team: user.team,
      points: stats ? calculatePoints(stats.totalMinutes, stats.totalCalories) : 0,
      totalMinutes: stats?.totalMinutes ?? 0,
      totalActivities: stats?.totalActivities ?? 0,
    },
    { upsert: true }
  );
}
