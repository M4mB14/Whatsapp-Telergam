import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import webhookRouter from './core/router';
import { TelegramAdapter } from './core/adapter';
import { TelegramTransformer } from './core/transformer';
import { TelegramStorage } from './core/storage';
import { GreenApiClient } from '@green-api/greenapi-integration';

// Загрузка переменных окружения
dotenv.config();

async function bootstrap() {
    // Проверка наличия всех необходимных переменных окружения
    if (!process.env.GREENAPI_INSTANCE_ID || 
        !process.env.GREENAPI_API_TOKEN ||
        !process.env.GREENAPI_PHONE_NUMBER ||
        !process.env.TELEGRAM_BOT_TOKEN ||
        !process.env.TELEGRAM_GROUP_CHAT_ID ||
        !process.env.APP_URL) {
        
        throw new Error('Missing required environment variables');
    }

    // Инициализация компонентов
    const storage = new TelegramStorage();
    const transformer = new TelegramTransformer();
    const adapter = new TelegramAdapter(transformer, storage);
    
    // Создание клиента Green API
    const greenApiClient = new GreenApiClient({
        idInstance: process.env.GREENAPI_INSTANCE_ID,
        apiTokenInstance: process.env.GREENAPI_API_TOKEN
    });

    // Настройка Telegram вебхука
    const telegramWebhookUrl = `${process.env.APP_URL}/webhook/telegram`;
    await setupTelegramWebhook(telegramWebhookUrl);

    // Создание Express приложения
    const app = express();
    app.use(bodyParser.json());
    
    // Подключение webhook маршрутов
    app.use('/webhook', webhookRouter);
    
    // Запуск сервера
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
        console.log(`Telegram webhook URL: ${telegramWebhookUrl}`);
    });

    console.log('Integration platform ready!');
}

async function setupTelegramWebhook(webhookUrl: string): Promise<void> {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) throw new Error('TELEGRAM_BOT_TOKEN not set');
    
    try {
        const response = await fetch(`https://api.telegram.org/bot ${botToken}/setWebhook`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                url: webhookUrl,
                drop_pending_updates: true
            })
        });
        
        const result = await response.json();
        if (!result.ok) {
            throw new Error(`Failed to set Telegram webhook: ${JSON.stringify(result)}`);
        }
        
        console.log('Telegram webhook set successfully');
    } catch (error) {
        console.error('Error setting Telegram webhook:', error);
        throw error;
    }
}

// Обработка ошибок
bootstrap().catch(console.error);