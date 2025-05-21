import { 
    BaseAdapter, 
    Instance 
} from '@green-api/greenapi-integration';
import axios from 'axios';
import { TelegramWebhook, TelegramMessage } from '../types/types';

export class TelegramAdapter extends BaseAdapter<TelegramWebhook, TelegramMessage> {
    private telegramBotToken = process.env.TELEGRAM_BOT_TOKEN!;
    
    async createPlatformClient(config: any): Promise<any> {
        return axios.create({
            baseURL: `https://api.telegram.org/bot ${this.telegramBotToken}`,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    async sendToPlatform(message: TelegramMessage, instance: Instance): Promise<void> {
        const telegramClient = await this.createPlatformClient({});
        
        try {
            await telegramClient.post('/sendMessage', {
                chat_id: message.chat_id,
                text: message.text,
                reply_to_message_id: message.reply_to_message_id
            });
        } catch (error) {
            console.error('Failed to send message to Telegram:', error);
            throw error;
        }
    }

    async handleTelegramWebhook(webhook: TelegramWebhook): Promise<void> {
        if (webhook.message && 
            webhook.message.chat.id.toString() === process.env.TELEGRAM_GROUP_CHAT_ID &&
            !webhook.message.from.is_bot) {
            
            try {
                await this.handlePlatformWebhook(webhook, 1); // 1 - fake instance ID
            } catch (error) {
                console.error('Error handling Telegram webhook:', error);
            }
        }
    }
}