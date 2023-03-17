import { ContextType, ConversationType } from "../types/Types";
import { getSlidesInputMedia, isInstagramUrl } from "../utils/Helpers";

const downloadPostConversation = async (
  conversation: ConversationType,
  ctx: ContextType
) => {
  await ctx.reply("enter the url of post: ");

  const { message } = await conversation.wait();

  if (isInstagramUrl(message?.text!)) {
    try {
      await ctx.reply("please wait...");
      const slideUrls: any = await getSlidesInputMedia(message?.text!);

      await ctx.replyWithMediaGroup(slideUrls);
    } catch (error) {
      await ctx.reply("something went wrong... please try again later.");
      console.log(error);
    }
  } else {
    await ctx.reply("please enter the url of post that you want to download.");
  }
};

export { downloadPostConversation };
