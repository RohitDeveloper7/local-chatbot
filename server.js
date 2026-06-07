const express = require("express");
const fs = require("fs");

const app = express();

app.use(express.json());

const FILE_PATH = "./history.json";

const getChats = () => {
    try {
        const data = fs.readFileSync(FILE_PATH, "utf8");
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};

// helper: write data
const saveChats = (data) => {
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
};

app.post("/chat", (req, res) => {
    const { message } = req.body;

    const msg = message.toLowerCase();

    if (msg === "hi" || msg === "hello") {
        reply = "How are you?";
    } else if (msg.includes("how are you")) {
        reply = "I'm fine 😊 What about you?";
    } else if (msg.includes("bye")) {
        reply = "Goodbye 👋 Have a nice day!";
    } else {
        reply = `You said: ${message}`;
    }

    const chats = getChats();

    chats.push({
        user: message,
        bot: reply,
        time: new Date().toISOString()
    });

    saveChats(chats);

    res.json({ reply });
});

app.get("/history", (req, res) => {
    const chats = getChats();
    res.json(chats);
});

app.get("/", (req, res) => {
    res.send("Server is running 🚀");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
});


// ===========================
// require("dotenv").config();

// const express = require("express");
// const OpenAI = require("openai");

// const app = express();
// app.use(express.json());

// const client = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY
// });

// app.post("/chat", async (req, res) => {
//     try {
//         const { message } = req.body;

//         const response = await client.responses.create({
//             model: "gpt-5",
//             input: message
//         });

//         res.json({
//             reply: response.output_text
//         });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             error: "Something went wrong"
//         });
//     }
// });

// app.listen(3000);