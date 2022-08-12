const { default: axios } = require("axios");
require("dotenv").config();

module.exports = function onContact(bot) {
  bot.on("contact", (ctx, next) => {
    ctx.session.contact = ctx.update.message.contact;
    const phone = ctx.session.contact.phone_number
    axios({
      method: "post",
      url: `${process.env.AUTH_URL}/api/users/auth/otp/request`,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        phoneNumber: `+${phone}`,
      },
    })
      .then((res) => {
        ctx.session.authRequestId = res.data.authRequestId;
        ctx.session.expiryDateTime = res.data.expiryDateTime;
        bot.telegram.sendMessage(
          ctx.chat.id,
          `A code is sent to +${phone}, via SMS.\nThe Code will be expired in [10 Minutes].\nEnter the code and send it to us.`
        );
      })
      .catch((err) => {
        console.error(err);
      });

    return next();
  });
};
