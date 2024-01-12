import express from "express";
import path from "path";
import { Telegraf } from "telegraf";
import {
    getAdaPrice,
    removeBot,
    getDolarOficialPrice,
    getDolarBluePrice,
    getDolarTuristaPrice,
    getDolarMayoristaPrice,
    getDolarFuturoPrice,
    getDolarCclPrice,
    getDolarMepPrice,
    getDolarCriptoPrice,
    getAcciones,
} from "./controllers/messages.js";
import logger from "./config/winstonLogger.js";

const expressApp = express();
expressApp.use(express.static("static"));
expressApp.use(express.json());

const bot = new Telegraf(process.env.BOT_TOKEN);

expressApp.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "src/index.html"));
});

logger.info("Starting bot");

bot.command("oficial", getDolarOficialPrice);
bot.command("ada", getAdaPrice);
bot.command("andate", removeBot);
bot.command("informal", getDolarBluePrice);
bot.command("turista", getDolarTuristaPrice);
bot.command("mayorista", getDolarMayoristaPrice);
bot.command("futuro", getDolarFuturoPrice);
bot.command("ccl", getDolarCclPrice);
bot.command("mep", getDolarMepPrice);
bot.command("cripto", getDolarCriptoPrice);
bot.command("acciones", getAcciones);

bot.launch();
