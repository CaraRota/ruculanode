import axios from "axios";
import {
    ccl,
    oficial,
    blue,
    turista,
    mayorista,
    futuro,
    cripto,
    mep,
    cryptoPrices,
    acciones,
} from "../config/api.js";
import { GenerateTemplate } from "./ctxReplyTemplate.js";
import logger from "../config/winstonLogger.js";

export const getAdaPrice = async (ctx) => {
    logger.info(`${ctx.from.username} asked for the ADA price`);
    try {
        const response = await axios.get(cryptoPrices);
        let adaPrice;
        response.data.forEach((crypto) => {
            if (crypto.symbol === "ada") {
                adaPrice = crypto.current_price.toFixed(2);
            }
        });
        // Reply with the ADA price
        await ctx.reply(
            `El precio de ADA es ${adaPrice} que equivale a ${(adaPrice * 45645564).toLocaleString(
                "ES-es"
            )} Ximerines`
        );
    } catch (error) {
        ctx.reply(`Error: ${error}`);
        logger.error(error);
    }
};

export const removeBot = async (ctx) => {
    logger.info(`${ctx.from.username} asked me to leave`);
    const chatId = ctx.message.chat.id;
    const userId = ctx.message.from.id;

    // Get information about the user's chat member status
    const chatMember = await ctx.telegram.getChatMember(chatId, userId);

    // Check if the user is an admin or creator
    const isAdmin = chatMember.status === "administrator" || chatMember.status === "creator";

    if (isAdmin) {
        try {
            ctx.reply("Volveré y seré millones (de ADAs)");
            ctx.leaveChat();
        } catch (error) {
            ctx.reply(`Error: ${error}`);
            logger.error(error);
        }
    } else {
        ctx.reply("No me voy a nigun lado puto. Vos no sos admin.");
    }
};

export const getAcciones = async (ctx) => {
    logger.info(`${ctx.from.username} asked for the stock market`);
    try {
        const response = await axios.get(acciones);
        const cotizacion = response.data.values;
        let message = "";
        cotizacion.forEach((accion) => {
            const parsePrice = accion[1].slice(0, -3).replace(",", "");
            const parsedVariation = accion[2].replace("%", "");
            message += `${parsedVariation > 0 ? `🟢` : `🔴`} ${accion[0]}: $${parseInt(
                parsePrice
            ).toLocaleString("ES-ar")} | ${parsedVariation}% \n`;
        });

        if (message === "") {
            message = "No hay cotizaciones disponibles";
        }
        ctx.reply(message);
    } catch (error) {
        ctx.reply(`Error: ${error}`);
        logger.error(error);
    }
};

//LISTA PRECIO DE DOLARES

export const getDolarOficialPrice = async (ctx) => {
    logger.info(`${ctx.from.username} asked for the official dollar price`);
    GenerateTemplate(ctx, oficial, "🏦 PRECIO DOLAR OFICIAL");
};

export const getDolarBluePrice = async (ctx) => {
    logger.info(`${ctx.from.username} asked for the blue dollar price`);
    GenerateTemplate(ctx, blue, "💸 PRECIO DOLAR BLUE");
};

export const getDolarTuristaPrice = async (ctx) => {
    logger.info(`${ctx.from.username} asked for the turista dollar price`);
    GenerateTemplate(ctx, turista, "🏖 PRECIO DOLAR TURISTA");
};

export const getDolarMayoristaPrice = async (ctx) => {
    logger.info(`${ctx.from.username} asked for the mayorista dollar price`);
    GenerateTemplate(ctx, mayorista, "🏭 PRECIO DOLAR MAYORISTA");
};

export const getDolarFuturoPrice = async (ctx) => {
    logger.info(`${ctx.from.username} asked for the futuro dollar price`);
    GenerateTemplate(ctx, futuro, "🔮 PRECIO DOLAR FUTURO");
};

export const getDolarCclPrice = async (ctx) => {
    logger.info(`${ctx.from.username} asked for the ccl dollar price`);
    GenerateTemplate(ctx, ccl, "🌐 PRECIO DOLAR CCL");
};

export const getDolarMepPrice = async (ctx) => {
    logger.info(`${ctx.from.username} asked for the mep dollar price`);
    GenerateTemplate(ctx, mep, "💵 PRECIO DOLAR MEP");
};

export const getDolarCriptoPrice = async (ctx) => {
    logger.info(`${ctx.from.username} asked for the cripto dollar price`);
    GenerateTemplate(ctx, cripto, "🤖 PRECIO DOLAR CRIPTO");
};
