/// <reference path='./types/.d.ts' />

import "./utils/LoadEnv";
import { ContextType } from "./types/Types";
import { setMiddlewares } from "./utils/Prepare";

import { Bot } from "grammy";

const bot = new Bot<ContextType>(process.env.secret_key!);

setMiddlewares(bot);

bot.start();
