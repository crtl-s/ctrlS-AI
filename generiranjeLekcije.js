require('dotenv').config();
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

async function generateRoadmap(tema) {
    systemMessage = prepareDataForSystemMessage(tema, 0);
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
    systemMessage = prepareDataForSystemMessage(pitanje, 1);
    prompt = 'Pitanje: ' + pitanje + '\n Odgovor: ' + odgovor
    roadmap = await generateAiResponse(prompt, systemMessage);
    response = { 'response': roadmap }
    return response
}

async function generateLection(tema, cjelina, vrstaUcenja) {
    systemMessage = prepareDataForSystemMessage(tema, 0);

    // logika
    data = { 'tema': tema, 'cjelina': cjelina, 'vrstaUcenja': vrstaUcenja };
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

function prepareDataForSystemMessage(promptInection, indexFunkcije) {
    // indexFunkcije označava koji nam pormpt treba
    // 0 - generiranje kompletnog roadmapa
    // 1 - provjera točnosti pitanja

    systemMessage = 'Dogodila se greška';
    if (indexFunkcije === 0) {
        systemMessage = 'Ti si ctrlS asistent za učenje. Tvoj primarni zadatak je pomoći učenicima i studentima naučiti neko novo gradivo.\
                        Primarni zadatak jest da generiraš roadmap za datu temu. Tvoja tema je "'+ promptInection + ' ". \
                        Ono što meni primarno treba je da mi gneriraš roadmap kao da sam kompletan početnik koji ništa ne \
                        zna o temi.\
                        Ovo je primjer dogborg odgovora:\
                        {\
                           "roadmap" : \
                        [\
                        {"title" : "najosnovniji pojmovi", "description" : "opis teme", "pitanja" : ["question": "Tvoje pitanje"]}\
                        ]\
                        }\
                        Bitno je da temu odradiš od početka do kraja. Studenti dolaze bez ikakvog predznanja.\
                        Za svaku temu pripremi neka pitanja koja mogu postaviti korisniku da vidim koliko je upoznat sa temom\
                        Važna napomena. Niakko nemoj vraćati u MD formatu. neka bude čisti XML bez ičega više'
    }
    if (indexFunkcije === 1) {
        systemMessage = 'Ti si ctrlS asistent. Tvoj zadatak je na postavlejno pitanje vratiti kratak  podgovor je li pitanje dobro odgovoreno ili ne.\
                         Ukoliko je učenik na pitanje odgvorio točno. Napiši samo DA. Ako je netočno odgovoreno objasni zašto je netočno'
    }



    return systemMessage;
}

module.exports = {
    generateLection,
    generateAiResponse,
    prepareDataForSystemMessage,
    generateRoadmap,
    checkAnswer,
}