import { 
    MessageTransformer, 
    Message as GreenApiMessage, 
    GreenApiWebhook 
} from '@green-api/greenapi-integration';
import { TelegramWebhook, TelegramMessage } from '../types/types';

export class TelegramTransformer extends MessageTransformer<TelegramWebhook, TelegramMessage> {
    // WhatsApp -> Telegram
    toPlatformMessage(webhook: GreenApiWebhook): TelegramMessage {
        if (webhook.typeWebhook === "incomingMessageReceived") {
            if (webhook.messageData.typeMessage !== "textMessage") {
                throw new Error("Only text messages are supported");
            }
            
            return {
                chat_id: Number(process.env.TELEGRAM_GROUP_CHAT_ID),
                text: `WhatsApp message from ${webhook.senderData.senderName} (${webhook.senderData.sender}):\n\n${webhook.messageData.textMessageData.textMessage}`
            };
        }
        throw new Error("Unsupported webhook type");
    }

    // Telegram -> WhatsApp
    toGreenApiMessage(message: TelegramWebhook): GreenApiMessage {
        if (message.message && message.message.text) {
            const phoneNumber = message.message.from.username 
                ? message.message.from.username 
                : message.message.from.id.toString();
                
            return {
                chatId: `${phoneNumber}@c.us`,
                message: message.message.text
            };
        }
        throw new Error("Only text messages are supported");
    }
}