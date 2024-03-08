const express = require('express');
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