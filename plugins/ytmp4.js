import { ytdownloader } from '../config/ytdlp.config.js';
import { log, err } from '../config/logger.config.js';

export default {
  command: 'ytmp4',
  exec: async ({ sock, msg, body, reply, react  }) => {
    const url = body.slice(6).trim();
    if (!url || !url.startsWith('https://')) return reply('no url detected!');

    try {
      react('⏳');
      reply('Proses ini memakan waktu beberapa menit. Mohon tunggu...')
      const ytdlp = await ytdownloader('mp4', url);
      await sock.sendMessage(msg.key.remoteJid, {
        video: ytdlp,
        caption: '✅ Berhasil diunduh!' },{
        quoted: msg
      }).then(() => react('✅'));
    } catch (e) {
      reply('❌ Gagal Mengunduh media!')
      log(err(e));
    }
  }
}