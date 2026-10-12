/**
 * Mentor360 Backend API Server
 * Express.js REST API for the school mentor support platform
 * 
 * Endpoints:
 *   GET  /api/health           - Health check
 *   GET  /api/schools          - List all schools
 *   GET  /api/schools/:id      - Get school by ID
 *   GET  /api/visits           - List all visits
 *   POST /api/visits           - Create a new visit
 *   GET  /api/observations     - List all observations
 *   POST /api/observations     - Create a new observation
 *   GET  /api/action-plans     - List all action plans
 *   POST /api/action-plans     - Create a new action plan
 *   GET  /api/mentor/profile   - Get mentor profile
 */

import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// ─── In-memory data store (replace with DB in production) ───────────────────
const db = {
  schools: [
    {
      id: 'school-1',
      name: 'Saraswati Primary School',
      udiseCode: 'UP09042301',
      location: 'Raipur Rural',
      district: 'Barabanki',
      block: 'Ramnagar',
      cluster: 'Raipur Rural Cluster',
      headTeacher: 'Smt. Anita Gupta',
      totalTeachers: 4,
      totalStudents: 87,
      gradeRange: '1-5',
      lastVisitDate: '2026-10-05',
      priorityScore: 18,
      needSeverity: 2,
      urgency: 2,
      followUpImportance: 2,
      overdueLevel: 1,
      focusAreas: ['Literacy', 'Numeracy'],
      tags: ['High Priority', 'Follow-up Due'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'school-2',
      name: 'Govt. Primary School Rampur',
      udiseCode: 'UP09042302',
      location: 'Rampur Village',
      district: 'Barabanki',
      block: 'Ramnagar',
      cluster: 'Raipur Rural Cluster',
      headTeacher: 'Sh. Vijay Kumar',
      totalTeachers: 3,
      totalStudents: 64,
      gradeRange: '1-5',
      lastVisitDate: '2026-09-28',
      priorityScore: 14,
      needSeverity: 1,
      urgency: 2,
      followUpImportance: 1,
      overdueLevel: 1,
      focusAreas: ['Numeracy'],
      tags: ['Moderate Priority'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'school-3',
      name: 'Shakti Govt Primary School',
      udiseCode: 'UP09042303',
      location: 'Shaktipur',
      district: 'Barabanki',
      block: 'Ramnagar',
      cluster: 'Raipur Rural Cluster',
      headTeacher: 'Smt. Priya Singh',
      totalTeachers: 5,
      totalStudents: 112,
      gradeRange: '1-5',
      lastVisitDate: '2026-09-15',
      priorityScore: 16,
      needSeverity: 2,
      urgency: 1,
      followUpImportance: 2,
      overdueLevel: 1,
      focusAreas: ['Literacy', 'Classroom Management'],
      tags: ['High Priority', 'Overdue Follow-up'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  visits: [],
  observations: [],
  actionPlans: [],
  mentorProfile: {
    id: 'mentor-1',
    name: 'Ramesh Chandra Verma',
    designation: 'CRP - Cluster Resource Person',
    cluster: 'Raipur Rural Cluster',
    block: 'Ramnagar',
    district: 'Barabanki',
    state: 'Uttar Pradesh',
    employeeId: 'UP-CRP-2021-0456',
    phone: '+91-9876543210',
    email: 'ramesh.verma@up.edu.in',
    monthlyVisitTarget: 16,
    joiningDate: '2021-06-01'
  }
};

// ─── Routes ──────────────────────────────────────────────────────────────────

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Mentor360 API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Schools
app.get('/api/schools', (req, res) => {
  res.json({ success: true, data: db.schools, total: db.schools.length });
});

app.get('/api/schools/:id', (req, res) => {
  const school = db.schools.find(s => s.id === req.params.id);
  if (!school) return res.status(404).json({ success: false, error: 'School not found' });
  res.json({ success: true, data: school });
});

app.post('/api/schools', (req, res) => {
  const school = { id: `school-${Date.now()}`, ...req.body, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  db.schools.push(school);
  res.status(201).json({ success: true, data: school });
});

// Visits
app.get('/api/visits', (req, res) => {
  res.json({ success: true, data: db.visits, total: db.visits.length });
});

app.post('/api/visits', (req, res) => {
  const visit = { id: `visit-${Date.now()}`, ...req.body, createdAt: new Date().toISOString() };
  db.visits.push(visit);
  res.status(201).json({ success: true, data: visit });
});

app.put('/api/visits/:id', (req, res) => {
  const idx = db.visits.findIndex(v => v.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, error: 'Visit not found' });
  db.visits[idx] = { ...db.visits[idx], ...req.body, updatedAt: new Date().toISOString() };
  res.json({ success: true, data: db.visits[idx] });
});

// Observations
app.get('/api/observations', (req, res) => {
  res.json({ success: true, data: db.observations, total: db.observations.length });
});

app.post('/api/observations', (req, res) => {
  const obs = { id: `obs-${Date.now()}`, ...req.body, createdAt: new Date().toISOString() };
  db.observations.push(obs);
  res.status(201).json({ success: true, data: obs });
});

// Action Plans
app.get('/api/action-plans', (req, res) => {
  res.json({ success: true, data: db.actionPlans, total: db.actionPlans.length });
});

app.post('/api/action-plans', (req, res) => {
  const plan = { id: `plan-${Date.now()}`, ...req.body, createdAt: new Date().toISOString() };
  db.actionPlans.push(plan);
  res.status(201).json({ success: true, data: plan });
});

app.put('/api/action-plans/:id', (req, res) => {
  const idx = db.actionPlans.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, error: 'Action plan not found' });
  db.actionPlans[idx] = { ...db.actionPlans[idx], ...req.body, updatedAt: new Date().toISOString() };
  res.json({ success: true, data: db.actionPlans[idx] });
});

// Mentor Profile
app.get('/api/mentor/profile', (req, res) => {
  res.json({ success: true, data: db.mentorProfile });
});

app.put('/api/mentor/profile', (req, res) => {
  db.mentorProfile = { ...db.mentorProfile, ...req.body, updatedAt: new Date().toISOString() };
  res.json({ success: true, data: db.mentorProfile });
});

// Dashboard summary
app.get('/api/dashboard/summary', (req, res) => {
  const schoolCount = db.schools.length;
  const scheduledVisits = db.visits.filter(v => v.status === 'Scheduled').length;
  const pendingFollowups = db.actionPlans.filter(p => ['In Progress', 'Needs Further Support'].includes(p.status)).length;
  const completedActions = db.actionPlans.filter(p => p.status === 'Completed').length;

  res.json({
    success: true,
    data: {
      schoolCount,
      scheduledVisits,
      pendingFollowups,
      completedActions,
      monthlyVisitTarget: db.mentorProfile.monthlyVisitTarget,
      visitsThisMonth: db.visits.filter(v => v.status === 'Completed').length
    }
  });
});

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Route ${req.method} ${req.path} not found` });
});

// Start server in standalone environment
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`\n🚀 Mentor360 API Server running on http://localhost:${PORT}`);
    console.log(`   Health check: http://localhost:${PORT}/api/health`);
    console.log(`   Schools:      http://localhost:${PORT}/api/schools`);
    console.log(`   Dashboard:    http://localhost:${PORT}/api/dashboard/summary\n`);
  });
}

export default app;
