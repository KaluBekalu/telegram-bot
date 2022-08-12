const { Markup } = require("telegraf");

// FUNCTIONS
const ScheduleReply = (ctx, obj, dayName) => {
  var responseData = `Movies on ${dayName}\n\n`;
  ctx.session.choosenSchedule = obj.schedules;

  moviesList = [];
  obj.schedules.map((el, idx) => {
    moviesList.push({
      text: el.movie.title,
      callback_data: el.movie.id,
    });

    moviesListKeyboard = {
      reply_markup: JSON.stringify({
        inline_keyboard: moviesList.map((x) => [
          {
            text: x.text,
            callback_data: x.callback_data,
          },
        ]),
      }),
    };
    responseData =
      responseData +
      `Title: ${el.movie.title}\nRating: ${
        el.movie.rating
      }\nSynopsis: ${el.movie.synopsis.substring(
        0,
        31
      )}\nGenre: ${el.movie.genre.map(
        (i) => " " + i
      )}\nShow Times: \n${el.showTimes.map((i) =>
        i.movieType === "TWO"
          ? " 2D at "
          : " 3D at " + i.time.split("T")[1].substring(0, 5)
      )} \n\n`;
  });

  return [responseData, moviesListKeyboard];
};

const dateFormatter = (arg, toWhat) => {
  if (toWhat === "day") {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
    }).format(new Date(arg));
  } else if (toWhat === "fullDate") {
    return new Intl.DateTimeFormat("en-US", { dateStyle: "full" }).format(
      new Date(arg)
    );
  }
};
// END FUNCTIONS

// HANDLER FOR DATE SELECTOR
module.exports = function onDateSelect(bot) {
  bot.action(
    [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ],
    (ctx) => {
      ctx.answerCbQuery();
      if (ctx.session.isAuthorized) {
        switch (ctx.update.callback_query.data) {
          case "monday":
            ctx.session.scheduleResult.map((el, i) => {
              dayName = dateFormatter(el.date, "day");
              if (dayName.toLocaleLowerCase() === "monday") {
                bot.telegram.sendMessage(
                  ctx.chat.id,
                  ScheduleReply(ctx, el, dayName)[0],
                  ScheduleReply(ctx, el, dayName)[1]
                );
              }
            });
            break;

          case "tuesday":
            ctx.session.scheduleResult.map((el, i) => {
              dayName = dateFormatter(el.date, "day");
              if (dayName.toLocaleLowerCase() === "tuesday") {
                bot.telegram.sendMessage(
                  ctx.chat.id,
                  ScheduleReply(ctx, el, dayName)[0],
                  ScheduleReply(ctx, el, dayName)[1]
                );
              }
            });
            break;

          case "wednesday":
            ctx.session.scheduleResult.map((el, i) => {
              dayName = dateFormatter(el.date, "day");
              if (dayName.toLocaleLowerCase() === "wednesday") {
                bot.telegram.sendMessage(
                  ctx.chat.id,
                  ScheduleReply(ctx, el, dayName)[0],
                  ScheduleReply(ctx, el, dayName)[1]
                );
              }
            });
            break;

          case "thursday":
            ctx.session.scheduleResult.map((el, i) => {
              dayName = dateFormatter(el.date, "day");
              if (dayName.toLocaleLowerCase() === "thursday") {
                bot.telegram.sendMessage(
                  ctx.chat.id,
                  ScheduleReply(ctx, el, dayName)[0],
                  ScheduleReply(ctx, el, dayName)[1]
                );
              }
            });
            break;
          case "friday":
            ctx.session.scheduleResult.map((el, i) => {
              dayName = dateFormatter(el.date, "day");
              if (dayName.toLocaleLowerCase() === "friday") {
                bot.telegram.sendMessage(
                  ctx.chat.id,
                  ScheduleReply(ctx, el, dayName)[0],
                  ScheduleReply(ctx, el, dayName)[1]
                );
              }
            });

            break;
          case "saturday":
            ctx.session.scheduleResult.map((el, i) => {
              dayName = dateFormatter(el.date, "day");
              if (dayName.toLocaleLowerCase() === "saturday") {
                bot.telegram.sendMessage(
                  ctx.chat.id,
                  ScheduleReply(ctx, el, dayName)[0],
                  ScheduleReply(ctx, el, dayName)[1]
                );
              }
            });

            break;

          case "sunday":
            ctx.session.scheduleResult.map((el, i) => {
              dayName = dateFormatter(el.date, "day");
              if (dayName.toLocaleLowerCase() === "sunday") {
                bot.telegram.sendMessage(
                  ctx.chat.id,
                  ScheduleReply(ctx, el, dayName)[0],
                  ScheduleReply(ctx, el, dayName)[1]
                );
              }
            });

            break;

          default:
            console.log("Some other");
            break;
        }
      } else {
        bot.telegram.sendMessage(
          ctx.chat.id,
          "You need to login first. Try /start."
        );
      }
    }
  );
};

// END HANDLER FOR DATE SELECTOR
