import express from "express";
import cors from "cors";
import { connection } from "./script.js";

const app = express();
const PORT = 3000;

app.use(cors());

app.get("/gift", (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    res.write(`data: ${JSON.stringify({
        type: "connected"
    })}\n\n`);

    const giftListener = (data) => {
        console.log(data);
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    connection.on("gift", giftListener);

    req.on("close", () => {
        connection.off("gift", giftListener);
    });
});

app.listen(PORT, () => {
    console.log(`Server is listening at http://localhost:${PORT}`);
});