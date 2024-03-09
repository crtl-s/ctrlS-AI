require('dotenv').config();
const message = require('./systemMessages');
const fs = require('fs');
const xml2js = require('xml2js');

const openAIHeader = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + process.env.OPENAI_API_KEY
}

// Ja ću dobiti generalno šta korisnik oće naučiti 
// ono šta trebamo je skontati šta sve ne zna kako bismo mogli utvrditi čšta učiti

// generiranje roadmapa općenito
// pronalazak šta korisnik ne zna
//     provjera točnosti odgovora
// generiranje roadmapa za učenika
// generiranje lekcija

async function checkCategoryForTheme(tema) {
    systemMessage = message.generateSystemMessageForCheckingThemecategory(tema);
    category = await generateAiResponse(tema, systemMessage);
    data = { 'category': category };
    return data

}


async function generateRoadmap(tema) {
    systemMessage = message.GeneralRoadmapSystemMessage(tema);
    roadmap = await generateAiResponse("Generiraj mi roadmap", systemMessage);
    data = roadmap.slice(7, -3);
    const parser = new xml2js.Parser({ explicitArray: false });
    a = ''
    parser.parseString(data, (error, result) => {
        if (error) {
            console.error('Error parsing XML:', error);
        } else {
            const jsonData = JSON.stringify(result, null, 2);
            a = jsonData
        }
    });

    const compactJsonString = a.replace(/\n\s*/g, '');
    return compactJsonString

}

async function checkAnswer(pitanje, odgovor) {
    systemMessage = message.checkAnswerSystemMessage(pitanje);
    prompt = 'Pitanje: ' + pitanje + '\n Odgovor: ' + odgovor
    roadmap = await generateAiResponse(prompt, systemMessage);
    response = { 'response': roadmap }
    return response
}

async function generatePersonalizedRoadmap(tema, roadmap) {
    systemMessage = message.studentRoadmapSystemMessage(roadmap, tema);
    response = await generateAiResponse("Generiraj mi roadmap", systemMessage);
    const compactJsonString = response.slice(7, -3).replace(/\n\s*/g, '');
    return response;
}

async function generateLection(ime_lekcije, vrstaUcenja) {
    systemMessage = message.lectureSystemMessage(vrstaUcenja);
    response = await generateAiResponse(ime_lekcije, systemMessage);
    data = { 'data': response, };
    return data
}

async function generateAiResponse(prompt, systemMessage) {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: 'POST',
        headers: openAIHeader,
        body: JSON.stringify({
            model: "gpt-4-turbo-preview",
            messages: [{ "role": "system", "content": systemMessage },
            { "role": "user", "content": prompt }
            ],
        })
    });
    if (response.ok) {
        return response.json().then(data => {
            text = data['choices'][0]['message']['content'];
            return text;
        })
    }
}


module.exports = {
    generateAiResponse,
    generateRoadmap,
    checkAnswer,
    generatePersonalizedRoadmap,
    generateLection,
    checkCategoryForTheme,
}