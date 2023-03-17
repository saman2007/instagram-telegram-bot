import { Menu } from "@grammyjs/menu";

const downloadMenu = new Menu("download")
  .text("a post", async (ctx: any) => {
    await ctx.conversation.enter("downloadPostConversation");
  })
  .text("a story")
  .text("a profile image");

export { downloadMenu };
