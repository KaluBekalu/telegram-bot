const { Markup } = require("telegraf");

module.exports = function (bot) {
  const requestPhoneKeyboard = {
    reply_markup: {
      one_time_keyboard: true,
      keyboard: [
        [
          {
            text: "Share my number.",
            request_contact: true,
            one_time_keyboard: true,
          },
        ],
        ["Cancel"],
      ],
    },
  };

  const welcomeKeybord = Markup.inlineKeyboard([
    Markup.button.callback("Century Cinema", "cinema"),
  ]);
  bot.start((ctx, next) => {
    // console.log(ctx);
    if (!ctx.session.isAuthorized) {
      ctx.session.isAuthorized = false;
    }
    if (ctx.session.isAuthorized) {
      ctx.replyWithMarkdown(
        `Hello there _${ctx.session.contact.first_name}!_\nChoose from our services below.`,
        welcomeKeybord
      );
    } else {
      bot.telegram.sendMessage(
        ctx.chat.id,
        "Hello, Welcome to AtoMeda!\nPlease share your phone number.",
        requestPhoneKeyboard
      );
    }
  });
};
