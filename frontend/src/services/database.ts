import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { School, Visit, Observation, ActionPlan, MentorProfile } from '../types';
import {
  SEED_SCHOOLS,
  SEED_VISITS,
  SEED_OBSERVATIONS,
  SEED_ACTION_PLANS,
  SEED_PROFILE
} from './seedData';

interface Mentor360DB extends DBSchema {
  schools: {
    key: string;
    value: School;
    indexes: { 'by-name': string };
  };
  visits: {
    key: string;
    value: Visit;
    indexes: { 'by-school': string; 'by-date': string; 'by-status': string };
  };
  observations: {
    key: string;
    value: Observation;
    indexes: { 'by-school': string; 'by-visit': string };
  };
  actionPlans: {
    key: string;
    value: ActionPlan;
    indexes: { 'by-school': string; 'by-visit': string; 'by-status': string };
  };
  profile: {
    key: string;
    value: MentorProfile;
  };
}

const DB_NAME = 'mentor360_db';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<Mentor360DB>> | null = null;

export function getDB(): Promise<IDBPDatabase<Mentor360DB>> {
  if (!dbPromise) {
    dbPromise = openDB<Mentor360DB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Schools store
        if (!db.objectStoreNames.contains('schools')) {
          const schoolStore = db.createObjectStore('schools', { keyPath: 'id' });
          schoolStore.createIndex('by-name', 'name');
        }

        // Visits store
        if (!db.objectStoreNames.contains('visits')) {
          const visitStore = db.createObjectStore('visits', { keyPath: 'id' });
          visitStore.createIndex('by-school', 'schoolId');
          visitStore.createIndex('by-date', 'scheduledDate');
          visitStore.createIndex('by-status', 'status');
        }

        // Observations store
        if (!db.objectStoreNames.contains('observations')) {
          const obsStore = db.createObjectStore('observations', { keyPath: 'id' });
          obsStore.createIndex('by-school', 'schoolId');
          obsStore.createIndex('by-visit', 'visitId');
        }

        // Action plans store
        if (!db.objectStoreNames.contains('actionPlans')) {
          const planStore = db.createObjectStore('actionPlans', { keyPath: 'id' });
          planStore.createIndex('by-school', 'schoolId');
          planStore.createIndex('by-visit', 'visitId');
          planStore.createIndex('by-status', 'status');
        }

        // Profile store
        if (!db.objectStoreNames.contains('profile')) {
          db.createObjectStore('profile', { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
}

/**
 * Ensure database has initial seed data
 */
export async function initializeDatabase(): Promise<void> {
  const db = await getDB();
  const schoolCount = await db.count('schools');

  if (schoolCount === 0) {
    const tx = db.transaction(['schools', 'visits', 'observations', 'actionPlans', 'profile'], 'readwrite');
    for (const school of SEED_SCHOOLS) {
      await tx.objectStore('schools').put(school);
    }
    for (const visit of SEED_VISITS) {
      await tx.objectStore('visits').put(visit);
    }
    for (const obs of SEED_OBSERVATIONS) {
      await tx.objectStore('observations').put(obs);
    }
    for (const plan of SEED_ACTION_PLANS) {
      await tx.objectStore('actionPlans').put(plan);
    }
    await tx.objectStore('profile').put(SEED_PROFILE);
    await tx.done;
  }
}

/**
 * Reset database to default seed state
 */
export async function resetDatabaseToSeed(): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(['schools', 'visits', 'observations', 'actionPlans', 'profile'], 'readwrite');
  await tx.objectStore('schools').clear();
  await tx.objectStore('visits').clear();
  await tx.objectStore('observations').clear();
  await tx.objectStore('actionPlans').clear();
  await tx.objectStore('profile').clear();

  for (const school of SEED_SCHOOLS) {
    await tx.objectStore('schools').put(school);
  }
  for (const visit of SEED_VISITS) {
    await tx.objectStore('visits').put(visit);
  }
  for (const obs of SEED_OBSERVATIONS) {
    await tx.objectStore('observations').put(obs);
  }
  for (const plan of SEED_ACTION_PLANS) {
    await tx.objectStore('actionPlans').put(plan);
  }
  await tx.objectStore('profile').put(SEED_PROFILE);
  await tx.done;
}

// -------------------------------------------------------------
// School Services
// -------------------------------------------------------------
export async function getAllSchools(): Promise<School[]> {
  await initializeDatabase();
  const db = await getDB();
  return db.getAll('schools');
}

export async function getSchoolById(id: string): Promise<School | undefined> {
  await initializeDatabase();
  const db = await getDB();
  return db.get('schools', id);
}

export async function saveSchool(school: School): Promise<void> {
  const db = await getDB();
  await db.put('schools', school);
}

// -------------------------------------------------------------
// Visit Services
// -------------------------------------------------------------
export async function getAllVisits(): Promise<Visit[]> {
  await initializeDatabase();
  const db = await getDB();
  const visits = await db.getAll('visits');
  // Enrich with schoolName if not present
  const schools = await db.getAll('schools');
  const schoolMap = new Map(schools.map(s => [s.id, s.name]));
  return visits.map(v => ({
    ...v,
    schoolName: v.schoolName || schoolMap.get(v.schoolId) || 'Unknown School'
  }));
}

export async function getVisitById(id: string): Promise<Visit | undefined> {
  await initializeDatabase();
  const db = await getDB();
  const visit = await db.get('visits', id);
  if (visit && !visit.schoolName) {
    const school = await db.get('schools', visit.schoolId);
    if (school) visit.schoolName = school.name;
  }
  return visit;
}

export async function saveVisit(visit: Visit): Promise<void> {
  const db = await getDB();
  await db.put('visits', visit);

  // Also update nextVisitDate or lastVisitDate on the associated school
  const school = await db.get('schools', visit.schoolId);
  if (school) {
    if (visit.status === 'Completed') {
      school.lastVisitDate = visit.completedDate || visit.scheduledDate;
    } else if (visit.status === 'Scheduled') {
      // If no nextVisitDate or this visit is sooner, update nextVisitDate
      if (!school.nextVisitDate || visit.scheduledDate <= school.nextVisitDate) {
        school.nextVisitDate = visit.scheduledDate;
      }
    }
    await db.put('schools', school);
  }
}

export async function deleteVisit(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('visits', id);
}

// -------------------------------------------------------------
// Observation Services
// -------------------------------------------------------------
export async function getAllObservations(): Promise<Observation[]> {
  await initializeDatabase();
  const db = await getDB();
  return db.getAll('observations');
}

export async function getObservationById(id: string): Promise<Observation | undefined> {
  await initializeDatabase();
  const db = await getDB();
  return db.get('observations', id);
}

export async function getObservationsBySchoolId(schoolId: string): Promise<Observation[]> {
  await initializeDatabase();
  const db = await getDB();
  return db.getAllFromIndex('observations', 'by-school', schoolId);
}

export async function getObservationsByVisitId(visitId: string): Promise<Observation[]> {
  await initializeDatabase();
  const db = await getDB();
  return db.getAllFromIndex('observations', 'by-visit', visitId);
}

export async function saveObservation(observation: Observation): Promise<void> {
  const db = await getDB();
  await db.put('observations', observation);

  // If this observation is completed, update the visit status to Completed
  if (observation.status === 'Completed' && observation.visitId) {
    const visit = await db.get('visits', observation.visitId);
    if (visit && visit.status !== 'Completed') {
      visit.status = 'Completed';
      visit.completedDate = new Date().toISOString().split('T')[0];
      visit.updatedAt = new Date().toISOString();
      await db.put('visits', visit);

      // Update school last visit date
      const school = await db.get('schools', visit.schoolId);
      if (school) {
        school.lastVisitDate = visit.completedDate;
        await db.put('schools', school);
      }
    }
  }
}

// -------------------------------------------------------------
// Action Plan Services
// -------------------------------------------------------------
export async function getAllActionPlans(): Promise<ActionPlan[]> {
  await initializeDatabase();
  const db = await getDB();
  return db.getAll('actionPlans');
}

export async function getActionPlanById(id: string): Promise<ActionPlan | undefined> {
  await initializeDatabase();
  const db = await getDB();
  return db.get('actionPlans', id);
}

export async function getActionPlansBySchoolId(schoolId: string): Promise<ActionPlan[]> {
  await initializeDatabase();
  const db = await getDB();
  return db.getAllFromIndex('actionPlans', 'by-school', schoolId);
}

export async function saveActionPlan(plan: ActionPlan): Promise<void> {
  const db = await getDB();
  await db.put('actionPlans', plan);
}

// -------------------------------------------------------------
// Mentor Profile Services
// -------------------------------------------------------------
export async function getMentorProfile(): Promise<MentorProfile> {
  await initializeDatabase();
  const db = await getDB();
  const profile = await db.get('profile', 'mentor-1');
  return profile || SEED_PROFILE;
}

export async function saveMentorProfile(profile: MentorProfile): Promise<void> {
  const db = await getDB();
  await db.put('profile', profile);
}

// -------------------------------------------------------------
// Storage Summary & Stats
// -------------------------------------------------------------
export async function getStorageSummary(): Promise<{
  schoolsCount: number;
  visitsCount: number;
  observationsCount: number;
  actionPlansCount: number;
  isDeviceLocal: boolean;
  indexedDBName: string;
}> {
  await initializeDatabase();
  const db = await getDB();
  const schoolsCount = await db.count('schools');
  const visitsCount = await db.count('visits');
  const observationsCount = await db.count('observations');
  const actionPlansCount = await db.count('actionPlans');

  return {
    schoolsCount,
    visitsCount,
    observationsCount,
    actionPlansCount,
    isDeviceLocal: true,
    indexedDBName: DB_NAME
  };
}
