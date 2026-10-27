import axios from 'axios';
import cache,{setCache} from '../lib/cache.js';

export default function tiktok(sock) {
  sock.ev.on('messages.upsert', ({messages, type}) => {
    if (type !== 'notify') return;
    const msg = messages[0];
    if (!msg || !msg.message) return;
    
    const jid = msg.key.remoteJid;
    const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';

    if (text.startsWith('!tt')) {
      const url = text.split(' ')[1];
      if (!url || !url.includes('https://')) {
        sock.sendMessage(jid, {text: 'Harap masukan link dengan benar!! \nContoh: https://vt.tiktok.com/xxxxx/'},{quoted: msg});
        return;
      }
      
      sock.sendMessage(jid, {text: 'Proses!! mohon tunggu...'},{quoted: msg});

      if (cache.has(url)) {
        const dc = cache.get(url);
        sock.sendMessage(jid, {video: {url: dc.vid}, caption: dc.cap},{quoted: msg}).then(() => {
          sock.sendMessage(jid, {audio: {url: dc.aud}, mimetype: 'audio/mpeg'},{quoted: msg});
        });
      } else {
      axios.get('https://tikwm.com/api/', {params: {url}}).then(({data: {data}}) => {
        setCache(url, {
          vid: data.play,
          aud: data.music,
          cap: data.title
        });
        
        sock.sendMessage(jid, {video: {url: data.play}, caption: data.title},{quoted: msg}).then(() => {
          sock.sendMessage(jid, {audio: {url: data.music}, mimetype: 'audio/mpeg'},{quoted: msg});
        });
      }).catch((e) => {
        sock.sendMessage(jid, {text: 'Gagal mendownload media!'},{quoted: msg});
        console.log(e);
      });
      }
    }
  });
}