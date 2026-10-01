import mongoose from 'mongoose';
import { Activity, Leaderboard, Team, User, Workout } from '../models';
import { updateLeaderboardForUser } from '../services/leaderboard';

const daysAgo = (days: number) => new Date(Date.now() - days * 24 * 60 * 60 * 1000);

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await mongoose.connect(connectionString);

    console.log('Connected to octofit_db');

    await Promise.all([
      User.deleteMany({}),
      Team.deleteMany({}),
      Activity.deleteMany({}),
      Leaderboard.deleteMany({}),
      Workout.deleteMany({}),
    ]);
    await Promise.all([User.syncIndexes(), Team.syncIndexes(), Leaderboard.syncIndexes()]);

    const [paul, maria] = await User.create([
      { name: 'Paul Octo', email: 'paul.octo@mergington.edu', role: 'teacher', fitnessLevel: 'advanced' },
      { name: 'Maria Bianchi', email: 'maria.bianchi@mergington.edu', role: 'teacher', fitnessLevel: 'intermediate' },
    ]);

    const students = await User.create([
      { name: 'Luca Rossi', email: 'luca.rossi@mergington.edu', grade: '9A', fitnessLevel: 'beginner' },
      { name: 'Giulia Verdi', email: 'giulia.verdi@mergington.edu', grade: '9A', fitnessLevel: 'intermediate' },
      { name: 'Marco Neri', email: 'marco.neri@mergington.edu', grade: '10B', fitnessLevel: 'advanced' },
      { name: 'Sara Gallo', email: 'sara.gallo@mergington.edu', grade: '10B', fitnessLevel: 'beginner' },
      { name: 'Andrea Costa', email: 'andrea.costa@mergington.edu', grade: '11C', fitnessLevel: 'intermediate' },
      { name: 'Elena Fontana', email: 'elena.fontana@mergington.edu', grade: '11C', fitnessLevel: 'advanced' },
    ]);

    const [blue, red] = await Team.create([
      {
        name: 'Team Blue',
        description: 'Squadra dedicata alla resistenza',
        goal: '1000 minuti di attività al mese',
        coach: paul._id,
        members: students.slice(0, 3).map((s) => s._id),
      },
      {
        name: 'Team Red',
        description: 'Squadra dedicata a forza e agilità',
        goal: '50 allenamenti al mese',
        coach: maria._id,
        members: students.slice(3).map((s) => s._id),
      },
    ]);

    await User.updateMany({ _id: { $in: blue.members } }, { team: blue._id });
    await User.updateMany({ _id: { $in: red.members } }, { team: red._id });

    const [luca, giulia, marco, sara, andrea, elena] = students;
    await Activity.create([
      { user: luca._id, type: 'walking', durationMinutes: 30, distanceKm: 2.5, calories: 120, date: daysAgo(1) },
      { user: luca._id, type: 'cycling', durationMinutes: 45, distanceKm: 12, calories: 300, date: daysAgo(3) },
      { user: giulia._id, type: 'running', durationMinutes: 40, distanceKm: 6, calories: 400, date: daysAgo(1) },
      { user: giulia._id, type: 'yoga', durationMinutes: 30, calories: 100, date: daysAgo(2) },
      { user: marco._id, type: 'running', durationMinutes: 60, distanceKm: 11, calories: 700, date: daysAgo(1) },
      { user: marco._id, type: 'strength', durationMinutes: 50, calories: 350, date: daysAgo(4) },
      { user: marco._id, type: 'swimming', durationMinutes: 45, distanceKm: 1.5, calories: 450, date: daysAgo(6) },
      { user: sara._id, type: 'team-sport', durationMinutes: 60, calories: 380, date: daysAgo(2) },
      { user: andrea._id, type: 'cycling', durationMinutes: 70, distanceKm: 20, calories: 500, date: daysAgo(1) },
      { user: andrea._id, type: 'strength', durationMinutes: 40, calories: 280, date: daysAgo(5) },
      { user: elena._id, type: 'swimming', durationMinutes: 60, distanceKm: 2, calories: 600, date: daysAgo(2) },
      { user: elena._id, type: 'running', durationMinutes: 35, distanceKm: 7, calories: 420, date: daysAgo(3) },
    ]);

    await Workout.create([
      { title: 'Camminata veloce', description: 'Camminata a passo sostenuto, mantenendo un ritmo costante.', category: 'walking', difficulty: 'beginner', durationMinutes: 25 },
      { title: 'Yoga di base', description: 'Sequenza di posizioni base per flessibilità e respirazione.', category: 'yoga', difficulty: 'beginner', durationMinutes: 20 },
      { title: 'Corpo libero', description: '3 serie di 10 squat, 8 piegamenti sulle ginocchia e 20s di plank.', category: 'strength', difficulty: 'beginner', durationMinutes: 15 },
      { title: 'Corsa leggera', description: 'Alterna 2 minuti di corsa e 1 di camminata per 8 ripetizioni.', category: 'running', difficulty: 'beginner', durationMinutes: 24 },
      { title: 'Corsa a intervalli', description: '6 ripetute da 400m con 90s di recupero.', category: 'running', difficulty: 'intermediate', durationMinutes: 30 },
      { title: 'Circuito di forza', description: '4 giri: 15 squat, 12 piegamenti, 10 affondi per gamba, 40s plank.', category: 'strength', difficulty: 'intermediate', durationMinutes: 30 },
      { title: 'Nuoto tecnico', description: '10 vasche alternando stile libero e dorso, focus sulla tecnica.', category: 'swimming', difficulty: 'intermediate', durationMinutes: 35 },
      { title: 'Uscita in bici', description: 'Percorso di 15 km a ritmo moderato.', category: 'cycling', difficulty: 'intermediate', durationMinutes: 45 },
      { title: 'Ripetute in salita', description: '8 sprint in salita da 30s con recupero in discesa.', category: 'running', difficulty: 'advanced', durationMinutes: 35 },
      { title: 'HIIT total body', description: '5 giri: burpees, jump squat, mountain climber, 40s on / 20s off.', category: 'strength', difficulty: 'advanced', durationMinutes: 30 },
      { title: 'Nuoto di resistenza', description: '1500m continui a ritmo costante.', category: 'swimming', difficulty: 'advanced', durationMinutes: 40 },
      { title: 'Partita a calcetto', description: 'Partita 5 contro 5 con riscaldamento e defaticamento.', category: 'team-sport', difficulty: 'intermediate', durationMinutes: 60 },
    ]);

    for (const user of students) {
      await updateLeaderboardForUser(user._id);
    }

    console.log('Database seeding complete');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
