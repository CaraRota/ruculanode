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

export const getAdaPrice = async (ctx) => {
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
        console.error(error);
    }
};

export const removeBot = async (ctx) => {
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
            console.error(error);
        }
    } else {
        ctx.reply("No me voy a nigun lado puto. Vos no sos admin.");
    }
};

export const getDolarOficialPrice = async (ctx) => {
    GenerateTemplate(ctx, oficial, "🏦 PRECIO DOLAR OFICIAL");
};

export const getDolarBluePrice = async (ctx) => {
    GenerateTemplate(ctx, blue, "💸 PRECIO DOLAR BLUE");
};

export const getDolarTuristaPrice = async (ctx) => {
    GenerateTemplate(ctx, turista, "🏖 PRECIO DOLAR TURISTA");
};

export const getDolarMayoristaPrice = async (ctx) => {
    GenerateTemplate(ctx, mayorista, "🏭 PRECIO DOLAR MAYORISTA");
};

export const getDolarFuturoPrice = async (ctx) => {
    GenerateTemplate(ctx, futuro, "🔮 PRECIO DOLAR FUTURO");
};

export const getDolarCclPrice = async (ctx) => {
    GenerateTemplate(ctx, ccl, "🌐 PRECIO DOLAR CCL");
};

export const getDolarMepPrice = async (ctx) => {
    GenerateTemplate(ctx, mep, "💵 PRECIO DOLAR MEP");
};

export const getDolarCriptoPrice = async (ctx) => {
    GenerateTemplate(ctx, cripto, "🤖 PRECIO DOLAR CRIPTO");
};
