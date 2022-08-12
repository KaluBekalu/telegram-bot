require("dotenv").config();

module.exports = function (bot) {
  bot.on("callback_query", (ctx) => {
    if (ctx.session.isAuthorized) {
      const choosenSchedule = ctx.session.choosenSchedule;
        const timeOption = {hour:"numeric", minute  :"numeric"}
      if (choosenSchedule) {
        // baseurl/schedule/scheduleId/showtime/showtimeId?ref=tbot&phoneNumber=theirPhoneNum
        showTimesKeyboard = {
          reply_markup: JSON.stringify({
            inline_keyboard: choosenSchedule[0].showTimes.map((x) => [
              {
                text: `🕑 ${new Intl.DateTimeFormat('en-AU',timeOption ).format(new Date(x.time)).toLocaleUpperCase()} (${
                  x.cinemaHall.name
                }) 🎬${x.movieType === "TWO" ? "2D" : "3D"}  💺Select Seat.`,
                callback_data: x.id,
                url: `${"http://165.227.142.142"}/schedule/${
                  choosenSchedule[0].id
                }/showTime/${x.id}/?ref=tbot&phoneNumber=${
                  ctx.session.contact.phone_number
                }`,
              },
            ]),
          }),
        };

        ctx.answerCbQuery();
        choosenSchedule.map((i) => {
          if (i.movie.id === ctx.callbackQuery.data) {
            var reply;
            reply = `${i.movie.title} \n⭐️${i.movie.rating} 🕑${i.movie.runtime}Mins \n${i.movie.genre}\n\nSynopsis\n${i.movie.synopsis} `;
            bot.telegram.sendPhoto(ctx.chat.id, i.movie.posterImg, {
              reply_markup: showTimesKeyboard.reply_markup,
              caption:
                reply +
                `\n\nYou Will be redirected to web to choose a seat and get your ticket.\nClick on the button bellow.`,
            });
          }
        });
      }
    } else {
      bot.telegram.sendMessage(
        ctx.chat.id,
        "You need to login first. Try /start."
      );
    }
  });
};
