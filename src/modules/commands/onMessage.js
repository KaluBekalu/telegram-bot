const { Markup } = require("telegraf");
const { default: axios } = require("axios");

module.exports = function onMessage(bot) {
  const welcomeKeybord = Markup.inlineKeyboard([
    Markup.button.callback("Century Cinema", "cinema"),
  ]);

  bot.on("text", (ctx, next) => {
    const authRequestId = ctx.session.authRequestId;
    var OTP_CODE = ctx.update.message.text;
    if (parseInt(OTP_CODE)) {
      axios({
        method: "post",
        url: `${process.env.AUTH_URL}/api/users/auth/otp/verify`,
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          authRequestId: authRequestId,
          otp: OTP_CODE,
        },
      })
        .then((res) => {
          if (res.data.bearerToken) {
            ctx.session.OTP_TOKEN_Result = res.data;
            if (ctx.session.OTP_TOKEN_Result.isNewUser) {
              axios({
                method: "post",
                url: `${process.env.AUTH_URL}/api/users/auth/otp/register`,
                headers: {
                  "Content-Type": "application/json",
                  Authorization: ctx.session.OTP_TOKEN_Result.bearerToken,
                },
                data: {
                  firstName: contact.first_name,
                  lastName: contact.lastName,
                  phone_number: contact.phone_number,
                },
              });
            } else {
              ctx.session.isAuthorized = true;
              bot.telegram.sendMessage(
                ctx.chat.id,
                "Your are successfully authorized.\nChoose from our services.",
                welcomeKeybord
              );
            }
            // next(ctx);
          }
        })
        .catch((err) => {
          console.log(err);
          bot.telegram.sendMessage(
            ctx.chat.id,
            "The Code is either Expired or Incorrect. Re-enter the code or Retry\nUse /start to start over. "
          );
        });
    }
    return next;
  });
};
