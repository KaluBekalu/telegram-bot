const { Telegraf } = require("telegraf");
const LocalSession = require("telegraf-session-local");
const express = require("express");
require("dotenv").config();
var QRCode = require("qrcode");

const token = process.env.BOT_TOKEN;
const SERVER_URL =
  process.env.SERVER_URL || "https://ato-meda-test.herokuapp.com";

const bot = new Telegraf(token); // Your Bot token here
bot.use(new LocalSession({ database: "db.json" }).middleware());

// START
const start = require("./modules/commands/start");
start(bot);

// LOGOUT
bot.command("/logout", (ctx) => {
  ctx.session = null;
  ctx.replyWithMarkdown("*Logged out!*");
});
bot.command("/help", (ctx) => {
  ctx.replyWithMarkdown(
    "*Use the following commands.*\n\n/start - _Starts the bot_\n/activeTickets - _Views your active tickets_\n/help - _Views available commands_\n/logout - _Logs you out_"
  );
});

// ActiveTickets
bot.command("/active_tickets", (ctx) => {
  const ticketData = {
    movieTicketId: "66f5bd53-4556-4d6e-8d58-88a8ab84caa5",
    seatId: "f7406774-1755-41d0-aff4-d26a667097a4",
    ticketKey: "E211",
    ticketStatus: "ACTIVE",
    redeemdAt: null,
    ticketValidatorUserId: null,
    receiptStatus: "NOTISSUED",
    fsNumber: null,
    redeemdBy: null,
    seat: {
      id: "f7406774-1755-41d0-aff4-d26a667097a4",
      seatName: "O1",
      seatColumnId: "5e6034c6-ebb7-4402-9231-0861297cc437",
      seatType: "REGULAR",
    },
    movieTicket: {
      id: "66f5bd53-4556-4d6e-8d58-88a8ab84caa5",
      createdAt: "2022-01-26T18:39:55.727Z",
      medaUserId: "testId",
      showTimeId: "cd462280-7acb-4e66-929d-f6a02be6a12f",
      transactionId: "testTransactionId",
      referenceNumber: null,
      amount: 0,
      showTime: {
        id: "cd462280-7acb-4e66-929d-f6a02be6a12f",
        time: "2022-01-25T23:00:00.992Z",
        movieType: "TWO",
        cinemaHallId: "c4cf1641-33d4-4393-90f6-8754a08a5156",
        cinemaMovieScheduleId: "858a4a24-4e5e-4057-9e41-160d5c912748",
        active: true,
        cinemaHall: {
          id: "c4cf1641-33d4-4393-90f6-8754a08a5156",
          name: "C1",
        },
        CinemaMovieSchedule: {
          id: "858a4a24-4e5e-4057-9e41-160d5c912748",
          date: "2022-01-26T00:00:00.000Z",
          movieId: "642950c0-6ed4-4416-a900-cef3a1c80dc7",
          regularTicketPrice: 80,
          vipTicketPrice: 100,
          movie: {
            title: "Straight Outta Compton",
            id: "642950c0-6ed4-4416-a900-cef3a1c80dc7",
          },
        },
      },
    },
  };
  const ticketKey = ticketData.ticketKey;
  const movieTitle =
    ticketData.movieTicket.showTime.CinemaMovieSchedule.movie.title;
  const hall = ticketData.movieTicket.showTime.cinemaHall.name;
  const seatType = ticketData.seat.seatType;
  const seatNumber = ticketData.seat.seatName;
  const payee = "Biruk Hailu";
  const time = ticketData.movieTicket.showTime.time;
  const createdAt = ticketData.movieTicket.createdAt;
  const paymentMode = "CBE_Birr";
  const referenceNumber = ticketData.movieTicket.referenceNumber;
  const transactionId = ticketData.movieTicket.transactionId;

  ctx.replyWithMarkdown(`You have _1 active ticket_`);

  bot.telegram.sendPhoto(ctx.chat.id, "https://bit.ly/3PvgPAR", {
    caption: `Item: Century Cinema Ticket\nMovie: ${movieTitle}\nHall: ${hall}\nSeat: #${seatType} - ${seatNumber}\n\nPayee: ${payee}\nSchedule Time: ${new Intl.DateTimeFormat(
      "en-US"
    ).format(
      new Date(time)
    )}\nPurchase Date: ${new Intl.DateTimeFormat(
      "en-US"
    ).format(
      new Date(createdAt)
    )}\nPayment Mode: ${paymentMode}\nReference Number: ${referenceNumber}\nTransaction Id: ${"KKASJKJSL9879770987"}
    `,
  });
});

const onContact = require("./modules/commands/onContact");
onContact(bot);

// Actions
const onServiceSelect = require("./modules/commands/onServiceSelect");
onServiceSelect(bot);

const onDateSelect = require("./modules/commands/onDateSelect");
onDateSelect(bot);

const onMovieSelect = require("./modules/commands/onMovieSelect");
onMovieSelect(bot);

const onMessage = require("./modules/commands/onMessage");
onMessage(bot);

const secretPath = `/telegraf/${bot.secretPathComponent()}`;

bot.telegram.setWebhook(`${SERVER_URL + secretPath}`);
const app = express();

// Set the bot API endpoint
app.use(bot.webhookCallback(secretPath));
app.listen(process.env.PORT, () => {
  console.log(`Bot Running on port ${process.env.PORT}`);
});
