import tiktokdownloader from '../config/tiktok.config.js';
import axios from 'axios';
import { log, err } from '../config/logger.config.js';

export default {
  command: 'ttmp4',
  exec: async ({ sock, msg, body, reply, react }) => {
    const url = body.slice(6).trim();
    if (!url || !url.startsWith('https://')) return reply('No url detected!');

    try {
      react('⏳');

      const { data } = await tiktokdownloader(url) || {};
      sock.sendMessage(msg.key.remoteJid, {
        video: { url: data.play },
        caption: data.title },{
        quoted: msg
      }).then(() => react('✅'));
    } catch (e) {
      react('❌');
      log(err(e));
    }
  }
}