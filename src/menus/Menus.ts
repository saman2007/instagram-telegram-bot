import { Menu } from "@grammyjs/menu";

const downloadMenu = new Menu("download")
  .text("a post", async (ctx: any) => {
    await ctx.conversation.enter("downloadPostConversation");
  })
  .text("a story", async (ctx: any) => {
    await ctx.conversation.enter("downloadStoryConversation");
  })
  .text("a profile image", async (ctx: any) => {
    await ctx.conversation.enter("downloadProfileImageConversation");
  });

export { downloadMenu };
