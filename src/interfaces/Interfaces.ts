import { ConversationFlavor } from "@grammyjs/conversations/out/conversation";
import { SessionFlavor, Context } from "grammy";

interface SessionDatas {}

interface CustomSession extends SessionFlavor<SessionDatas>, Context {}

export { CustomSession, SessionDatas };
