import TelegramBot from 'node-telegram-bot-api';
import { updateChannelSettings, getChannelSettings } from '../db.js';
import type { Express } from 'express';

const TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const ADMIN_IDS = (process.env.ADMIN_CHAT_IDS || '')
  .split(',')
  .map(id => Number(id.trim()))
  .filter(Boolean);

console.log('[BOT] Starting simple bot for Facebook link management');
console.log('[BOT] ADMIN_IDS:', ADMIN_IDS);

function isAdmin(chatId: number): boolean {
  return ADMIN_IDS.includes(chatId);
}

export function startBot(_app: Express) {
  const bot = new TelegramBot(TOKEN, { polling: true });

  // Handle /start command - use exact match
  bot.onText(/^\/start$/, (msg) => {
    if (!isAdmin(msg.chat.id)) {
      bot.sendMessage(msg.chat.id, '⛔ Access denied. You are not an admin.');
      return;
    }
    try {
      const settings = getChannelSettings();
      bot.sendMessage(msg.chat.id,
        '📱 Facebook Link Manager\n\n' +
        `Current Facebook link: ${settings.facebook_link || '—'}\n\n` +
        'Commands:\n' +
        '/setfacebook <link> — Set new Facebook link\n' +
        '/getfacebook — Get current Facebook link\n' +
        '/start — Show this menu'
      );
    } catch (err) {
      console.error('[BOT] Error in /start:', err);
      bot.sendMessage(msg.chat.id, '❌ Error retrieving settings');
    }
  });

  // Handle /getfacebook command - exact match
  bot.onText(/^\/getfacebook$/, (msg) => {
    if (!isAdmin(msg.chat.id)) {
      bot.sendMessage(msg.chat.id, '⛔ Access denied.');
      return;
    }
    try {
      const settings = getChannelSettings();
      bot.sendMessage(msg.chat.id, `🔗 Current Facebook link: ${settings.facebook_link || '—'}`);
    } catch (err) {
      console.error('[BOT] Error in /getfacebook:', err);
      bot.sendMessage(msg.chat.id, '❌ Error retrieving settings');
    }
  });

  // Handle /setfacebook <link> - match with space and at least one character
  bot.onText(/^\/setfacebook\s+(.+)$/, (msg, match) => {
    if (!isAdmin(msg.chat.id)) {
      bot.sendMessage(msg.chat.id, '⛔ Access denied.');
      return;
    }
    if (!match?.[1]) {
      bot.sendMessage(msg.chat.id, '❌ Please provide a link. Usage: /setfacebook <link>');
      return;
    }
    try {
      const newLink = match[1].trim();
      updateChannelSettings({ facebook_link: newLink });
      bot.sendMessage(msg.chat.id, `✅ Facebook link updated!\n\nNew link: ${newLink}`);
    } catch (err) {
      console.error('[BOT] Error in /setfacebook:', err);
      bot.sendMessage(msg.chat.id, '❌ Error updating settings');
    }
  });

  // Handle any other text - only for non-commands
  bot.on('message', (msg) => {
    // Skip commands - they are handled by onText
    if (msg.text?.startsWith('/')) return;
    if (!isAdmin(msg.chat.id)) {
      bot.sendMessage(msg.chat.id, '⛔ Access denied.');
      return;
    }
    bot.sendMessage(msg.chat.id, '📱 Отправьте команду. Используйте /start для списка команд.');
  });

  console.log('[BOT] Simple Facebook link bot started');
}