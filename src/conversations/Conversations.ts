import { ContextType, ConversationType } from "../types/Types";
import {
  getPostInputMedia,
  getStoryInputMedia,
  isInstagramUrl,
} from "../utils/Helpers";

const downloadPostConversation = async (
  conversation: ConversationType,
  ctx: ContextType
) => {
  await ctx.reply("enter the url of post: ");

  const { message } = await conversation.wait();

  if (isInstagramUrl(message?.text!)) {
    try {
      await ctx.reply("please wait...");
      const slideUrls: any = await getPostInputMedia(message?.text!);

      await ctx.replyWithMediaGroup(slideUrls);
    } catch (error) {
      await ctx.reply("something went wrong... please try again later.");
      console.log(error);
    }
  } else {
    await ctx.reply("please enter the url of post that you want to download.");
  }
};

const downloadStoryConversation = async (
  conversation: ConversationType,
  ctx: ContextType
) => {
  await ctx.reply("enter the url of story: ");

  const { message } = await conversation.wait();

  if (isInstagramUrl(message?.text!)) {
    try {
      await ctx.reply("please wait...");
      const storyUrl: any = await getStoryInputMedia(message?.text!);

      await ctx.replyWithMediaGroup(storyUrl);
    } catch (error) {
      await ctx.reply("something went wrong... please try again later.");
      console.log(error);
    }
  } else {
    await ctx.reply("please enter the url of post that you want to download.");
  }
};

const downloadProfileImageConversation = async (
  conversation: ConversationType,
  ctx: ContextType
) => {
  ctx.reply("downloading profile image is not available now! coming soon...");
};

export {
  downloadPostConversation,
  downloadStoryConversation,
  downloadProfileImageConversation,
};
