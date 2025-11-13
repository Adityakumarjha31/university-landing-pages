const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 4000;

const db = {
  universities: [
    {
      id: "shivalik",
      name: "Shivalik University",
      overview: "Shivalik University offers engineering, management and design programmes.",
      courses: [
        { code: "btech", name: "B.Tech (CSE)", duration: "4 years", fees: { min: 250000, max: 400000 } },
        { code: "mba",  name: "MBA (Finance)", duration: "2 years", fees: { min: 180000, max: 300000 } },
        { code: "bdes", name: "B.Des", duration: "4 years", fees: { min: 120000, max: 220000 } }
      ],
      placements: { avg: 450000, top: 1200000, recruiters: ["TechCo","FinCorp","BuildIT"] },
      facilities: ["Hostel","Labs","Sports Complex","Placement Cell"]
    },
    {
      id: "kirantech",
      name: "Kiran Institute of Technology",
      overview: "Kiran Institute focuses on applied engineering and strong internship pipelines.",
      courses: [
        { code: "btech-me", name: "B.Tech (ME)", duration: "4 years", fees: { min: 200000, max: 350000 } },
        { code: "mtech-rob", name: "M.Tech (Robotics)", duration: "2 years", fees: { min: 150000, max: 280000 } },
        { code: "bba", name: "BBA", duration: "3 years", fees: { min: 90000, max: 160000 } }
      ],
      placements: { avg: 380000, top: 1000000, recruiters: ["AutoInc","RoboticsLab","DataWorks"] },
      facilities: ["Workshops","Research Labs","Hostel","Gym"]
    }
  ],
  leads: []
};

// GET /api/universities  -> list of universities (nested)
app.get('/api/universities', (req, res) => {
  res.json({ count: db.universities.length, data: db.universities });
});

// GET /api/universities/:id  -> details for one university
app.get('/api/universities/:id', (req, res) => {
  const u = db.universities.find(x => x.id === req.params.id);
  if (!u) return res.status(404).json({ error: 'University not found' });
  res.json(u);
});

// GET /api/fees/:univId/:courseCode -> fees for a single course
app.get('/api/fees/:univId/:courseCode', (req, res) => {
  const u = db.universities.find(x => x.id === req.params.univId);
  if (!u) return res.status(404).json({ error: 'University not found' });
  const c = u.courses.find(cc => cc.code === req.params.courseCode);
  if (!c) return res.status(404).json({ error: 'Course not found' });
  res.json({ university: u.id, course: c.code, fees: c.fees });
});

// POST /api/leads -> accept lead JSON (stores in memory)
app.post('/api/leads', (req, res) => {
  const lead = req.body;
  if (!lead || !lead.name || !lead.email || !lead.phone) {
    return res.status(400).json({ error: 'Invalid lead. name, email, phone required.' });
  }
  lead.id = db.leads.length + 1;
  lead.receivedAt = new Date().toISOString();
  db.leads.push(lead);
  console.log('New lead saved (in-memory):', lead);
  res.status(201).json({ message: 'Lead received', lead });
});

// simple health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
