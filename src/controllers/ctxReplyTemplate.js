import axios from "axios";

export const GenerateTemplate = async (ctx, api, title) => {
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

    console.log(precio);
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
