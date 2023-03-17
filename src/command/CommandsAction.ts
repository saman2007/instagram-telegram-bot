import { downloadMenu } from "../menus/Menus";
import { ContextType } from "../types/Types";

const startCommandAc = async (ctx: ContextType) => {
  await ctx.reply(
    "hello! welcome to this bot. in this bot, you have access to great instagram tools for free!"
  );
};

const downloadCommandAc = async (ctx: ContextType) => {
  await ctx.reply("what do you want to download?", {
    reply_markup: downloadMenu,
  });
};

export { startCommandAc, downloadCommandAc };
