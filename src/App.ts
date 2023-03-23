/// <reference path='./types/.d.ts' />

import "./utils/LoadEnv";
import { ContextType } from "./types/Types";
import { setMiddlewares } from "./utils/Prepare";

import { Bot } from "grammy";
import express from "express";

const port = process.env.PORT || 3000;
const devMode = process.env.NODE_ENV === "development";

const bot = new Bot<ContextType>(
  devMode ? process.env.dev_secret_key! : process.env.secret_key!
);
const server = express();

setMiddlewares(bot, server, devMode);

if (devMode) {
  bot.start();
} else {
  server.listen(port, async () => {
    console.log(`server is listening to port ${port}`);

    const webhookUrl = `https://${process.env.DETA_SPACE_APP_HOSTNAME}`;
    
    await bot.api.setWebhook(webhookUrl, {
      drop_pending_updates: true,
    });
  });
}
