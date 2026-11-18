import { downloadMediaMessage, getContentType } from '@whiskeysockets/baileys';
import { Sticker, StickerTypes } from 'stickers-formatter';
import { log, err } from '../config/logger.config.js';

export default {
  command: 'sticker',
  exec: async ({ sock, msg, body, react, reply }) => {
    try {
      const context = msg.message?.extendedTextMessage?.contextInfo;
      const quoted = context?.quotedMessage;
      const media = quoted ? { message: quoted } : msg;
      
      const typeMsg = getContentType(media.message);

      if (typeMsg !== 'videoMessage' && typeMsg !== 'imageMessage' && typeMsg !== 'stickerMessage') {
        react('❌');
        await reply('Kirim atau reply media!!');
        return;
      }

      react('⏳')
      const buffer = await downloadMediaMessage(media, 'buffer', {},{
        reuploadRequest: sock.updateMediaMessage
      });

      const mySticker = new Sticker(buffer, {
        pack: 'Copyright',
        author: 'DikzBot',
        type: StickerTypes.FULL,
        quality: 80
      });

      await sock.sendMessage(
        msg.key.remoteJid,
        await mySticker.toMessage(),
        { quoted: msg }
      ).then(() => react('✅'))

    } catch (e) {
      react('❌');
      log(err(e));
    }
  }
};
