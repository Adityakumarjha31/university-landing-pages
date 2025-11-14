const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());
const PORT = 4000;
const db = {
  universities: [
    { id: "parul",
      name: "Parul University",
      overview: "Parul University in Gujarat, lots of courses and a big campus.",
      courses: [
        { code: "btech-cse", name: "B.Tech (CSE)", duration: "4 years", fees: { min: 280000, max: 450000 } },
        { code: "mba-finance",  name: "MBA (Finance)", duration: "2 years", fees: { min: 200000, max: 320000 } },
        { code: "bca", name: "BCA", duration: "3 years", fees: { min: 150000, max: 250000 } }
      ],
      placements: { avg: 500000, top: 1500000, recruiters: ["InfoSys","Wipro","TCS"] },
      facilities: ["Hostel","Big Labs","Food Court","Gym","Placement Cell"]
    },
    {id: "aditya",
      name: "Aditya Institute of Technology",
      overview: "Aditya Institute is known for its engineering and good placements.",
      courses: [
        { code: "btech-it", name: "B.Tech (IT)", duration: "4 years", fees: { min: 220000, max: 380000 } },
        { code: "mtech-vlsi", name: "M.Tech (VLSI)", duration: "2 years", fees: { min: 180000, max: 290000 } },
        { code: "bba", name: "BBA", duration: "3 years", fees: { min: 100000, max: 180000 } }
      ],
      placements: { avg: 420000, top: 1100000, recruiters: ["TechMahindra","HCL","DataWorks"] },
      facilities: ["Workshops","Research Labs","Hostel","Library"]
    }
  ],
  leads: []
};

app.get('/api/universities', (req, res) => {
res.json({ 
 count: db.universities.length, 
data: db.universities 
  });
});

app.get('/api/universities/:id', (req, res) => {
 const univId = req.params.id;
const university = db.universities.find(uni => uni.id === univId);
 if (!university) {
res.status(404).json({ error: 'University not found, check the ID' });
} else {
res.json(university);
}
});

app.get('/api/fees/:univId/:courseCode', (req, res) => {
 const univId = req.params.univId;
 const courseCode = req.params.courseCode;
 const university = db.universities.find(uni => uni.id === univId);
if (!university) {
 return res.status(404).json({ error: 'University not found' });
}

const course = university.courses.find(c => c.code === courseCode);
 if (!course) {
return res.status(404).json({ error: 'Course not found' });
 }
 res.json({ 
 university: university.name, 
course: course.name, 
fees: course.fees 
 });
});

app.post('/api/leads', (req, res) => {
 const leadData = req.body;

if (!leadData.name || !leadData.email || !leadData.phone) {
 return res.status(400).json({ error: 'Invalid lead. need name, email, and phone.' });
 } 
 leadData.id = db.leads.length + 1;
 leadData.receivedAt = new Date().toISOString();

 db.leads.push(leadData);

res.status(201).json({ message: 'Lead received, thanks!', data: leadData });
});

app.listen(PORT, () => {
console.log(`API server is running on http://localhost:${PORT}`);
});