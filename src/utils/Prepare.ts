import { Bot, session } from "grammy";
import { conversations, createConversation } from "@grammyjs/conversations";
import { ContextType } from "../types/Types";
import { downloadMenu } from "../menus/Menus";
import { commands } from "../command/Commands";
import { downloadCommandAc, startCommandAc } from "../command/CommandsAction";
import { downloadPostConversation } from "../conversations/Conversations";

const setMiddlewares = (bot: Bot<ContextType>) => {
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

  //set all commands of bot
  bot.api.setMyCommands(commands);

  //set menues
  bot.use(downloadMenu);

  //set actions of commands
  bot.command("start", startCommandAc);
  bot.command("download", downloadCommandAc);
};

export { setMiddlewares };
