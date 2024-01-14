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
    granos,
    generalApi,
} from "../config/api.js";
import { generateTemplate, formatNumber, fetchDolarData } from "../hooks/ctxReplyTemplate.js";
import logger from "../config/winstonLogger.js";

//THIS IS AN EASTER EGG
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

export const getStarted = (ctx) => {
    logger.info(`${ctx.from.username} started the bot`);
    ctx.reply(
        `👋🏻 Hola ${ctx.from.first_name}!

Soy un bot que te informa sobre el precio del dolar y otras cosas mas.

Fui creado por Sebastian Camia; Fullstack Web Developer.

Si queres saber mas sobre el, podes visitar su LinkedIn:
    https://www.linkedin.com/in/sebastian-emanuel-camia-trefs/

Tambien puedes visitar mi version web:
https://ruculaweb.netlify.app/
`
    ),
        {
            parse_mode: "Markdown",
        };
};

export const generalData = async (ctx) => {
    logger.info(`${ctx.from.username} asked for the general data`);
    try {
        const getGeneralData = await axios.get(generalApi);
        const general = getGeneralData.data;

        const dolarFuturo = await fetchDolarData(futuro);
        const dolarCCL = await fetchDolarData(ccl);
        const dolarMep = await fetchDolarData(mep);
        const dolarCripto = await fetchDolarData(cripto);
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // Ignore certificate errors just for this request
        const precioGranos = await axios.get(granos);
        const soja = precioGranos.data.pizarra[0].soja.rosario;
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "1"; // Ignore certificate errors just for this request

        ctx.reply(
            `*💼 COTIZACIONES GENERALES*

*🏦 Dolar Oficial:* ${general[0].venta ? `$${general[0].venta}` : "S/C"}
*🥬 Dolar Blue:* ${general[1].venta ? `$${general[1].venta}` : "S/C"}
*🏖 Dolar Turista:* ${general[2].venta ? `${general[2].venta}` : "S/C"}
*🏭 Dolar Importador:* ${general[4].venta ? `$${general[4].venta}` : "S/C"}
*🔮 Dolar Futuro:* ${dolarFuturo}
*🌎 Dolar CCL:* ${dolarCCL}
*💵 Dolar MEP:* ${dolarMep}
*🪙 Dolar Cripto:* ${dolarCripto}
*🌱 Soja:* ${soja ? `$${soja}` : "S/C"}
*🎢 Riesgo Pais:* ${general[7].val1 ? `$${general[7].val1}` : "S/C"}
`,
            { parse_mode: "Markdown", reply_to_message_id: ctx.message.message_id }
        );
    } catch (error) {
        logger.error(error);
        ctx.reply(`Error: ${error}`);
    }
};

export const convertCurrency = async (ctx) => {
    logger.info(`${ctx.from.username} asked to convert currency`);
    try {
        console.log("ctx.message.text", ctx.message.text);
        const deconstruct = ctx.message.text.split(" ");
        const currency = deconstruct[0];

        const amount = deconstruct[1];
        const parsedAmount = parseFloat(amount);

        if (!(parsedAmount > 0)) {
            ctx.reply(
                "Debes ingresar un número entero positivo para que pueda calcular tu conversión"
            );
        }

        const dolarOficial = await fetchDolarData(oficial, true);
        const dolarBlue = await fetchDolarData(blue, true);
        const dolarTurista = await fetchDolarData(turista, true);
        const dolarCCL = await fetchDolarData(ccl, true);
        const dolarMep = await fetchDolarData(mep, true);
        const dolarCripto = await fetchDolarData(cripto, true);

        if (currency === "/usd") {
            ctx.reply(
                `*🇺🇸 COMPRAR ${parsedAmount} USD*
$${(dolarOficial * parsedAmount).toFixed(2)} ARS (Oficial)
$${(dolarBlue * parsedAmount).toFixed(2)} ARS (Blue)
$${(dolarTurista * parsedAmount).toFixed(2)} ARS (Turista)
$${(dolarCCL * parsedAmount).toFixed(2)} ARS (CCL)
$${(dolarMep * parsedAmount).toFixed(2)} ARS (MEP)
$${(dolarCripto * parsedAmount).toFixed(2)} ARS (Cripto)
            `,
                { parse_mode: "Markdown", reply_to_message_id: ctx.message.message_id }
            );
        }
        if (currency === "/ars") {
            ctx.reply(
                `*🇦🇷  COMPRAR USD CON ${parsedAmount} ARS*
$${(parsedAmount / dolarOficial).toFixed(2)} USD (Oficial)
$${(parsedAmount / dolarBlue).toFixed(2)} USD (Blue)
$${(parsedAmount / dolarTurista).toFixed(2)} USD (Turista)
$${(parsedAmount / dolarCCL).toFixed(2)} USD (CCL)
$${(parsedAmount / dolarMep).toFixed(2)} USD (MEP)
$${(parsedAmount / dolarCripto).toFixed(2)} USD (Cripto)
            `,
                { parse_mode: "Markdown", reply_to_message_id: ctx.message.message_id }
            );
        }
    } catch (error) {
        logger.error(error);
        ctx.reply(`Error: ${error}`);
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

export const getGranos = async (ctx) => {
    logger.info(`${ctx.from.username} asked for the grain market`);
    try {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // Ignore certificate errors just for this request
        const response = await axios.get(granos);
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "1"; // Ignore certificate errors just for this request
        const grano = response.data.pizarra[0];

        const { fecha, soja, sorgo, girasol, trigo, maiz } = grano;

        ctx.reply(
            `*🚛 PIZARRA ROSARIO*

📅 *Fecha:* ${fecha}
🌱 *Soja:* ${soja.rosario === "0.00" ? "S/C" : "$" + formatNumber(soja.rosario)}
🌾 *Sorgo:* ${sorgo.rosario === "0.00" ? "S/C" : "$" + formatNumber(sorgo.rosario)}
🌻 *Girasol:* ${girasol.rosario === "0.00" ? "S/C" : "$" + formatNumber(girasol.rosario)}
🌾 *Trigo:* ${trigo.rosario === "0.00" ? "S/C" : "$" + formatNumber(trigo.rosario)}
🌽 *Maiz:* ${maiz.rosario === "0.00" ? "S/C" : "$" + formatNumber(maiz.rosario)}
`,
            {
                parse_mode: "Markdown",
                reply_to_message_id: ctx.message.message_id,
            }
        );
    } catch (error) {
        ctx.reply(`Error: ${error}`);
        logger.error(error);
    }
};

//LISTA PRECIO DE DOLARES

export const getDolarOficialPrice = async (ctx) => {
    logger.info(`${ctx.from.username} asked for the official dollar price`);
    generateTemplate(ctx, oficial, "🏦 PRECIO DOLAR OFICIAL");
};

export const getDolarBluePrice = async (ctx) => {
    logger.info(`${ctx.from.username} asked for the blue dollar price`);
    generateTemplate(ctx, blue, "💸 PRECIO DOLAR BLUE");
};

export const getDolarTuristaPrice = async (ctx) => {
    logger.info(`${ctx.from.username} asked for the turista dollar price`);
    generateTemplate(ctx, turista, "🏖 PRECIO DOLAR TURISTA");
};

export const getDolarMayoristaPrice = async (ctx) => {
    logger.info(`${ctx.from.username} asked for the mayorista dollar price`);
    generateTemplate(ctx, mayorista, "🏭 PRECIO DOLAR MAYORISTA");
};

export const getDolarFuturoPrice = async (ctx) => {
    logger.info(`${ctx.from.username} asked for the futuro dollar price`);
    generateTemplate(ctx, futuro, "🔮 PRECIO DOLAR FUTURO");
};

export const getDolarCclPrice = async (ctx) => {
    logger.info(`${ctx.from.username} asked for the ccl dollar price`);
    generateTemplate(ctx, ccl, "🌎 PRECIO DOLAR CCL");
};

export const getDolarMepPrice = async (ctx) => {
    logger.info(`${ctx.from.username} asked for the mep dollar price`);
    generateTemplate(ctx, mep, "💵 PRECIO DOLAR MEP");
};

export const getDolarCriptoPrice = async (ctx) => {
    logger.info(`${ctx.from.username} asked for the cripto dollar price`);
    generateTemplate(ctx, cripto, "🪙 PRECIO DOLAR CRIPTO");
};
