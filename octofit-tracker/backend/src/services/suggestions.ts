import { trusted, Types } from 'mongoose';
import { Activity, ACTIVITY_TYPES, IUser, Workout } from '../models';

const WEEKLY_TARGET_MINUTES = 150;

export async function getWorkoutSuggestions(user: IUser & { _id: Types.ObjectId }) {
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const recent = await Activity.find({ user: user._id, date: trusted({ $gte: oneWeekAgo }) }).lean();

  const weeklyMinutes = recent.reduce((sum, a) => sum + a.durationMinutes, 0);
  const doneTypes = new Set(recent.map((a) => a.type));
  // Favour categories the student has not practised this week for a balanced routine.
  const missingTypes = ACTIVITY_TYPES.filter((t) => t !== 'other' && !doneTypes.has(t));

  const workouts = await Workout.find({ difficulty: user.fitnessLevel }).lean();
  const ranked = workouts.sort((a, b) => {
    const aScore = missingTypes.includes(a.category) ? 0 : 1;
    const bScore = missingTypes.includes(b.category) ? 0 : 1;
    return aScore - bScore;
  });

  const remaining = Math.max(WEEKLY_TARGET_MINUTES - weeklyMinutes, 0);
  const message =
    remaining > 0
      ? `Ti mancano ${remaining} minuti per raggiungere l'obiettivo settimanale di ${WEEKLY_TARGET_MINUTES} minuti.`
      : `Ottimo lavoro! Hai raggiunto l'obiettivo settimanale di ${WEEKLY_TARGET_MINUTES} minuti.`;

  return {
    weeklyMinutes,
    weeklyTargetMinutes: WEEKLY_TARGET_MINUTES,
    message,
    suggestions: ranked.slice(0, 3),
  };
}
