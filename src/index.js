import express from "express";
import path from "path";
import { Telegraf } from "telegraf";
import {
    getStarted,
    getAdaPrice,
    removeBot,
    getDolarOficialPrice,
    getDolarBluePrice,
    getDolarTuristaPrice,
    getDolarImportadorPrice,
    getDolarFuturoPrice,
    getDolarCclPrice,
    getDolarMepPrice,
    getDolarCriptoPrice,
    getAcciones,
    getGranos,
    generalData,
    convertCurrency,
    getCryptoPrices,
} from "./controllers/messages.js";
import logger from "./config/winstonLogger.js";

const port = process.env.PORT || 3000;

const expressApp = express();
expressApp.use(express.static("static"));
expressApp.use(express.json());
expressApp.use(express.urlencoded({ extended: true }));
expressApp.listen(port, () => {
    logger.info(`Server running on port ${port}`);
});

const bot = new Telegraf(process.env.BOT_TOKEN);
logger.info("Starting the bot...");

bot.start(getStarted);

bot.command("general", generalData);
bot.command("oficial", getDolarOficialPrice);
bot.command("informal", getDolarBluePrice);
bot.command("turista", getDolarTuristaPrice);
bot.command("mep", getDolarMepPrice);
bot.command("ccl", getDolarCclPrice);
bot.command("cripto", getDolarCriptoPrice);
bot.command("importador", getDolarImportadorPrice);
bot.command("futuro", getDolarFuturoPrice);
bot.command("acciones", getAcciones);
bot.command("granos", getGranos);
bot.command(["usd", "ars"], convertCurrency);
bot.command("cryptos", getCryptoPrices);

// EASTER EGGS
bot.command("ada", getAdaPrice);
bot.command("andate", removeBot);

bot.launch();
