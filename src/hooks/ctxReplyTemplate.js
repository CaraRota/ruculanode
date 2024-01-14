import axios from "axios";

export const generateTemplate = async (ctx, api, title) => {
    const response = await axios.get(api);
    const precio = response.data;

    const variacionFloat = parseFloat(precio.variacion.replace("%", "").replace(",", "."));
    let handleStatus = "";

    if (variacionFloat < -5) {
        handleStatus = "C congeló papá! 🥶";
    }
    if (variacionFloat > 5) {
        handleStatus = "C picó papá! 🔥";
    }
    ctx.reply(
        `*${title}*
        ${handleStatus}
*📅 Fecha:* ${precio.fecha}
*🟢 Compra:* $${precio.compra}
*🔴 Venta:* $${precio.venta}
*💱 Variacion:* ${variacionFloat > 0 ? `${variacionFloat}% 📈` : `${variacionFloat}% 📉`}
*👴🏻 Cierre Ant:* ${precio.valor_cierre_ant ? precio.valor_cierre_ant : " -- "}`,
        { parse_mode: "Markdown", reply_to_message_id: ctx.message.message_id }
    );
};

export const formatNumber = (number) => {
    return parseInt(number).toLocaleString("ES-ar");
};

//DATA FETCHER FOR GENERAL COMMAND
export const fetchDolarData = async (url, tx) => {
    const response = await axios.get(url);
    if (tx) {
        const parsedData = parseFloat(response.data.venta.replace(",", "."));
        return response.data.venta ? parsedData : "S/C";
    }
    return response.data.venta ? `$${response.data.venta}` : "S/C";
};
