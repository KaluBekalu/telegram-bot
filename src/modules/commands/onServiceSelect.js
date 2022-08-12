const { default: axios } = require("axios");
require("dotenv").config();

var scheduleDays = [];
var dateFormatOptions = { dateStyle: "full" };

module.exports = function (bot) {
  bot.action("cinema", (ctx, next) => {
    ctx.answerCbQuery();
    if (ctx.session.isAuthorized) {
      var daysOptions;
      axios({
        method: "get",
        url: `${process.env.API_URL}/api/cinema-schedule/schedules-preview`,
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImE5Mjk3MjFmLWUxM2ItNDhhNS05NmU4LWY2NzEyYzc1ZTQyMCIsInJvbGUiOnsiaWQiOjEsIm5hbWUiOiJBZG1pbiJ9LCJmaXJzdE5hbWUiOiJTdXBlclVzZXIiLCJsYXN0TmFtZSI6IlN1cGVyVXNlciIsInVzZXJuYW1lIjoiU3VwZXJVc2VyIiwiaWF0IjoxNjUyMTYyMDgyLCJleHAiOjE2NTI3NjY4ODJ9.9aerJGTP6qGhW4kUOWn8-6yxf-GpqiPdUEXtxa-szUI",
        },
      })
        .then((res) => {
          ctx.session.scheduleResult = res.data;
          scheduleDays = [];
          res.data.forEach((el) => {
            scheduleDays.push({
              text: new Intl.DateTimeFormat("en-US", dateFormatOptions).format(
                new Date(el.date)
              ),
              callback_data: new Intl.DateTimeFormat("en-US", {
                weekday: "long",
              })
                .format(new Date(el.date))
                .toLocaleLowerCase(),
            });
          });
          if (scheduleDays.length > 0) {
            daysOptions = {
              reply_markup: JSON.stringify({
                inline_keyboard: scheduleDays.map((x) => [
                  {
                    text: x.text,
                    callback_data: x.callback_data,
                  },
                ]),
              }),
            };
            bot.telegram.sendMessage(ctx.chat.id, "Choose a day.", daysOptions);
          } else {
            bot.telegram.sendMessage(ctx.chat.id, "Sorry, no schedule found.");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      bot.telegram.sendMessage(
        ctx.chat.id,
        "You need to login first. Try /start."
      );
    }
    return next;
  });
};
