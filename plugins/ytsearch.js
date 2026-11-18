import { ytfastsearch } from '../config/ytdlp.config.js';
import { log, err } from '../config/logger.config.js';

export default {
  command: 'yt',
  exec: async ({ sock, msg, body, reply, react }) => {
    const query = body.slice(3).trim();
    if (!query) {
      reply('Harap masukan query! contoh: .yt dj breakbeat');
      return;
    }

    try {
      react('⏳');
      const video = await ytfastsearch(query);
      if (!video) {
        react('❌');
        reply('Video tidak ditemukan');
        return;
      }

      const desc = `*${video.title}*\n` +
                    `Channel: ${video.channel}\n` +
                    `Durasi: ${video.duration}\n` +
                    `Link: ${video.url}`;
      
      await sock.sendMessage(msg.key.remoteJid, {
        video: video.buffer,
        mimetype: 'video/mp4',
        caption: desc },{
        quoted: msg
      }).then(() => react('✅'))
    } catch (e) {
      log(err(e));
      reply('Gagal mencari video!!');
    }
  }
}