import { ContextType, ConversationType } from "../types/Types";
import {
  chooseWinnersFromPostComments,
  getPostCaption,
  getPostInputMedia,
  getProfileInputMedia,
  getStoryInputMedia,
  isInstagramUrl,
} from "../utils/Helpers";

//conversation for downloading a post
const downloadPostConversation = async (
  conversation: ConversationType,
  ctx: ContextType
) => {
  await ctx.reply("enter the url of post: ");

  const { message } = await conversation.waitFrom(ctx.from?.id!);

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
    await ctx.reply(
      "please enter the url of post that you want to download. a correct instagram url starts with https://www.instagram.com/ or https://instagram.com/"
    );
  }
};

//conversation for downloading a story
const downloadStoryConversation = async (
  conversation: ConversationType,
  ctx: ContextType
) => {
  await ctx.reply("enter the url of story: ");

  const { message } = await conversation.waitFrom(ctx.from?.id!);

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
    await ctx.reply(
      "please enter the url of story that you want to download. a correct instagram url starts with https://www.instagram.com/ or https://instagram.com/"
    );
  }
};

//conversation for downloading a profile image
const downloadProfileImageConversation = async (
  conversation: ConversationType,
  ctx: ContextType
) => {
  await ctx.reply("enter the username of user that you want his/her profile:");

  const { message } = await conversation.waitFrom(ctx.from?.id!);

  try {
    await ctx.reply("please wait...");
    const profileUrl: any = await getProfileInputMedia(message?.text!);

    await ctx.replyWithMediaGroup(profileUrl);
  } catch (error) {
    await ctx.reply("something went wrong... please try again later.");
    console.log(error);
  }
};

//conversation for choosing n winners base on comments of a post
const chooseWinnersConversation = async (
  conversation: ConversationType,
  ctx: ContextType
) => {
  await ctx.reply("to choose your winners, enter your url of instagram post:");
  const { message: postUrl } = await conversation.waitFrom(ctx.from?.id!);

  if (isInstagramUrl(postUrl?.text!)) {
    try {
      await ctx.reply(
        "how many winners do you want to choose? (enter a number)"
      );

      const { message: winnersNum } = await conversation.waitFrom(
        ctx.from?.id!
      );

      await ctx.reply("please wait...");

      const winners = await chooseWinnersFromPostComments(
        postUrl?.text!,
        +winnersNum?.text!
      );

      const stringWinners = winners.join("\n");

      await ctx.reply(stringWinners);

      if (winners.length != 0)
        await ctx.reply("these are the winners! good luck to them!");
      else
        await ctx.reply(
          "there are no winners! meybe no one commented under your post or you entered 0 winners?!"
        );
    } catch (error) {
      await ctx.reply("something went wrong... please try again later.");
      console.log(error);
    }
  } else {
    await ctx.reply(
      "please enter the url of post that you want to choose winners from comments. a correct instagram url starts with https://www.instagram.com/ or https://instagram.com/"
    );
  }
};

const getPostCaptionConversation = async (
  conversation: ConversationType,
  ctx: ContextType
) => {
  await ctx.reply(
    "to get caption of an instagram post, enter the url of that instagram post:"
  );
  
  const { message: postUrl } = await conversation.waitFrom(ctx.from?.id!);

  if (isInstagramUrl(postUrl?.text!)) {
    await ctx.reply("please wait...");

    try {
      const postCaption = await getPostCaption(postUrl?.text!);
      await ctx.reply(postCaption);
    } catch (error) {
      await ctx.reply("something went wrong... please try again later.");
      console.log(error);
    }
  }
};

export {
  downloadPostConversation,
  downloadStoryConversation,
  downloadProfileImageConversation,
  chooseWinnersConversation,
  getPostCaptionConversation,
};
