import { CustomSession } from "../interfaces/Interfaces";
import {
  ConversationFlavor,
  Conversation,
} from "@grammyjs/conversations/out/conversation";

type ContextType = CustomSession & ConversationFlavor;
type ConversationType = Conversation<ContextType>;
type MediasType = "audio" | "document" | "photo" | "video";
type IndexSigniture<T extends object> = {
  [key in keyof T]: T[key];
};

export { ContextType, ConversationType, MediasType, IndexSigniture };
