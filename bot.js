import makeWaSocket, {useMultiFileAuthState} from '@whiskeysockets/baileys';
import pino from 'pino';
import cache, {setCache} from './lib/cache.js';
import ttDownload from './scripts/tt.js';
import {loadPlugin, handleMsg} from './handle.js';

process.on('SIGINT', () => {
  cache.clear();
  console.log(`\n\n[Cache Is Cleared!]`);
  process.exit(0);
});

function bot(nomer) {
  loadPlugin();
  
  const session = `session/${nomer}`;
  useMultiFileAuthState(session).then(({state, saveCreds}) => {
    const sock = (makeWaSocket.default || makeWaSocket)({
      auth: state,
      printQRInTerminal: false,
      logger: pino({level: 'silent'}),
      syncFullHistory: false
    });

    sock.ev.on('connection.update', ({connection}) => {
      if (connection === "close") bot(nomer);
      if (connection === "open") {
        console.log(`session ${nomer} active!`);
        cache.clear();
      }  
    });

    if (!sock.authState.creds.registered) {
      setTimeout(() => {
        sock.requestPairingCode(nomer).then(kode => {
          console.log(`pairing code: ${kode.match(/.{1,4}/g, '')}`);
        }).catch(e => console.log(e));
      },3000);
    }

    sock.ev.on('creds.update', saveCreds);

    ttDownload(sock);

    sock.ev.on('messages.upsert', (m) => {
      handleMsg(sock, m);
    });
    
  }).catch(err => console.log(err));
}

bot(6285111509070);
