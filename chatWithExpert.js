require('dotenv').config();


const openAIHeader = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + process.env.OPENAI_API_KEY
}

async function askQuestion(lekcija, razgovor) {
    // logika
    response = await generateAiResponse(razgovor, 'Ti predaješ u srednjoj školi');
    data = { 'response': response, };
    return data
}

async function generateAiResponse(razgovor, systemMessage) {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: 'POST',
        headers: openAIHeader,
        body: JSON.stringify({
            model: "gpt-4-turbo-preview",
            messages: [{ "role": "system", "content": systemMessage },
            ...razgovor
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
    askQuestion,
    generateAiResponse
}