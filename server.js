const express = require("express");
const fs = require("fs");

const app = express();

app.use(express.json());

const FILE_PATH = "./history.json";
const REPLY_PATH = "./reply.json";

// history functions
const getChats = () => {
    try {
        const data = fs.readFileSync(FILE_PATH, "utf8");
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};

const saveChats = (data) => {
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
};

// reply loader
const getReplies = () => {
    try {
        const data = fs.readFileSync(REPLY_PATH, "utf8");
        return JSON.parse(data);
    } catch (err) {
        return {};
    }
};

app.post("/chat", (req, res) => {
    const { message } = req.body;

    const msg = message.toLowerCase().trim();
    const replies = getReplies();

    let reply = "";

    // exact match first
    if (replies[msg]) {
        reply = replies[msg];
    } else {
        // partial match fallback
        const foundKey = Object.keys(replies).find(key =>
            msg.includes(key)
        );

        if (foundKey) {
            reply = replies[foundKey];
        } else {
            reply = `I don't understand: ${message}`;
        }
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
    res.json(getChats());
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