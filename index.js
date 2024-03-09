const express = require('express');
const lekcija = require('./generiranjeLekcije');
const pitanja = require('./chatWithExpert');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());
const port = 3000;

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
})

app.post('/studentRoadmap', async (req, res) => {
    const { tema, roadmap } = req.body;
    const data = await lekcija.generatePersonalizedRoadmap(tema, roadmap);
    res.status(200).json(data);

});

app.post('/checkQuestion', async (req, res) => {
    const { pitanje, odgovor } = req.body;
    const data = await lekcija.checkAnswer(pitanje, odgovor);
    res.status(200).json(data);
});

app.post('/generateRoadmap', async (req, res) => {
    const { tema } = req.body;
    const data = await lekcija.generateRoadmap(tema);
    res.status(200).json(data);
});

app.post('/askQuestion', async (req, res) => {
    const { lekcija, razgovor } = req.body;
    const data = await pitanja.askQuestion(lekcija, razgovor);
    res.status(200).json(data);
});

// tri stila učenja
// angdote, analogies, oversimplify


app.post('/generateLecture', async (req, res) => {
    const { ime_lekcije, vrstaUcenja } = req.body;
    const data = await lekcija.generateLection(ime_lekcije, vrstaUcenja);
    res.status(200).json(data);
});
app.get('/status', (req, res) => {
    res.status(200).json({ status: 'API radi' });
});

app.post('/req', (req, res) => {
    const { data } = req.body;
    res.status(200).json({ data: data });
});

app.listen(port, () => {
    console.log(`Express radi na lokaciji: http://localhost:${port}`);
});