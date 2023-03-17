import { CustomSession } from "../interfaces/Interfaces";
import {
  ConversationFlavor,
  Conversation,
} from "@grammyjs/conversations/out/conversation";

type ContextType = CustomSession & ConversationFlavor;
type ConversationType = Conversation<ContextType>;
type MediasType = "audio" | "document" | "photo" | "video";

export { ContextType, ConversationType, MediasType };
