import express from 'express';
import { TelegramAdapter } from '../core/adapter';
import { TelegramTransformer } from '../core/transformer';
import { TelegramStorage } from '../core/storage';

const router = express.Router();

const storage = new TelegramStorage();
const transformer = new TelegramTransformer();
const adapter = new TelegramAdapter(transformer, storage);

// Webhook для Telegram
router.post('/telegram', async (req, res) => {
    try {
        await adapter.handleTelegramWebhook(req.body);
        res.status(200).send();
    } catch (error) {
        console.error('Failed to handle Telegram webhook:', error);
        res.status(500).send();
    }
});

// Webhook для Green API (WhatsApp)
router.post('/green-api', async (req, res) => {
    try {
        await adapter.handleGreenApiWebhook(req.body, ['incomingMessageReceived']);
        res.status(200).send();
    } catch (error) {
        console.error('Failed to handle Green API webhook:', error);
        res.status(500).send();
    }
});

export default router;