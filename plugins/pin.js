import { searchPinterest } from '../config/pinterest.config.js';
import { log, err } from '../config/logger.config.js';

export default {
  command: 'pin',
  exec: async ({ sock, msg, body, reply, react }) => {
    const query = body.slice(4).trim();
    if (!query) return reply('Harap Masukan query pencarian!');

    try {
      react('⏳');
      const images = await searchPinterest(query);
      
      if (!images || !Array.isArray(images) || !images.length === 0) return reply('Gambar tidak ditemukan!');

      const randomImg = images[Math.floor(Math.random() * images.length)];
      
      sock.sendMessage(msg.key.remoteJid, {
        image: { url: randomImg },
        caption: `Hasil dari query *${query}*` },{
        quoted: msg
      }).then(() => react('✅'));
    } catch (e) {
      react('❌');
      reply('Gagal mendownload gambar!!');
      log(err(e));
    }
  }
}