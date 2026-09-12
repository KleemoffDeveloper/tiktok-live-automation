import express from "express";
import cors from "cors";
import { getConnection } from "./script.js";

const app = express();
const PORT = 3000;

app.use(cors());

app.get("/gift", (req, res) => {
    const username = req.query.username;

    if (!username) {
        return res.status(400).json({
            error: "Username is required"
        });
    }

    const connection = getConnection(username);

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    res.write(`data: ${JSON.stringify({
        type: "connected",
        username: username
    })}\n\n`);

    const giftListener = (data) => {
        console.log(`Livestream @${username}:`, data);

        res.write(`data: ${JSON.stringify({
            ...data,
            streamer: username
        })}\n\n`);
    };

    connection.on("gift", giftListener);

    req.on("close", () => {
        connection.off("gift", giftListener);
    });
});

app.listen(PORT, () => {
    console.log(`Server is listening at http://localhost:${PORT}`);
});