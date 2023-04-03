import { Bot, session, webhookCallback } from "grammy";
import { conversations, createConversation } from "@grammyjs/conversations";
import { Express, json } from "express";

import { ContextType } from "../types/Types";
import { downloadMenu } from "../menus/Menus";
import { commands } from "../command/Commands";
import {
  chooseWinnerCommandAc,
  downloadCommandAc,
  getCaptionPostCommandAc,
  startCommandAc,
} from "../command/CommandsAction";
import {
  chooseWinnersConversation,
  downloadPostConversation,
  downloadProfileImageConversation,
  downloadStoryConversation,
  getPostCaptionConversation,
} from "../conversations/Conversations";

const setMiddlewares = (
  bot: Bot<ContextType>,
  server: Express,
  devMode: boolean
) => {
  //bot middlewares
  bot.use(
    session({
      initial() {
        return {};
      },
    })
  );
  bot.use(conversations());

  //set conversations
  bot.use(createConversation(downloadPostConversation));
  bot.use(createConversation(downloadStoryConversation));
  bot.use(createConversation(downloadProfileImageConversation));
  bot.use(createConversation(chooseWinnersConversation));
  bot.use(createConversation(getPostCaptionConversation));

  //set all commands of bot
  bot.api.setMyCommands(commands);

  //set menues
  bot.use(downloadMenu);

  //set actions of commands
  bot.command("start", startCommandAc);
  bot.command("download", downloadCommandAc);
  bot.command("choose_winner", chooseWinnerCommandAc);
  bot.command("get_caption", getCaptionPostCommandAc);

  //server middlewares(only in production)
  if (!devMode) {
    server.use(json());
    server.use(webhookCallback(bot, "express"));
  }
};

export { setMiddlewares };
