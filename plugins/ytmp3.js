import ytdownloader from '../config/ytdlp.config.js';
import { log, err } from '../config/logger.config.js';

export default {
  command: 'ytmp3',
  exec: async ({ sock, msg, body, reply, react  }) => {
    const url = body.slice(6).trim();
    if (!url) return reply('no url detected!');

    try {
      await react('⏳');
      await reply('Proses ini memakan waktu beberapa menit. Mohon tunggu...')
      const ytdlp = await ytdownloader('mp3', url);
      await sock.sendMessage(msg.key.remoteJid, {
        audio: ytdlp,
        mimetype: 'audio/mp4' },{
        quoted: msg
      }).then(() => react('✅'));
    } catch (e) {
      reply('❌ Gagal mengunduh media!');
      log(err(e));
    }
  }
}