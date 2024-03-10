const sql = require('mssql');
const mysql = require('mysql2');
require('dotenv').config();

const openAIHeader = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + process.env.OPENAI_API_KEY
}

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,

});

async function getDataFromDatabase(embeding) {

    await new Promise((resolve, reject) => {
        db.connect((err) => {
            if (err) reject(err);
            else resolve();
        });
    });

    const query = `select cached, dot_product(vector, JSON_ARRAY_PACK("[${embeding}]")) as score
        from ctrlS
        order by score desc
        limit 2;`;

    const result = await new Promise((resolve, reject) => {
        db.query(query, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });

    const informacije = await result.map(item => item.text);
    return informacije;
}

async function addDataToDatabase(text) {
    embeding = await createEmbedding(text);
    await new Promise((resolve, reject) => {
        db.connect((err) => {
            if (err) reject(err);
            else resolve();
        });
    });

    const query = `INSERT INTO cached (text, vector) VALUES ("${text}", JSON_ARRAY_PACK("[${embeding}]"));`;


    const result = await new Promise((resolve, reject) => {
        db.query(query, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });

    return result;
}

async function createEmbedding(text) {
    const response = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: openAIHeader,
        body: JSON.stringify({
            "input": text,
            "model": "text-embedding-ada-002"
        })
    })
    if (response.ok) {
        return response.json().then(data => {
            const embedding = data['data'][0]['embedding'];
            return embedding;
        })
    }

}



module.exports = {
    getDataFromDatabase,
    addDataToDatabase,
    createEmbedding,
}

