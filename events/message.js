import { plugins } from '../events/loader.js';
import { log, warn, err, info } from '../config/logger.config.js';

global.prefixes = ['!', '.', '/', '>'];

const handle = async (sock, events) => {
  const { type, messages } = events;
  if (type !== 'notify') return;

  const msg = messages[0];
  const grub = msg.key.remoteJid.endsWith('@g.us');

  const m = msg.message, body = m.conversation ||
    m.extendedTextMessage?.text || m.imageMessage?.caption ||
    m.videoMessage?.caption || '';
  const prefix = global.prefixes.find(p => body.startsWith(p));

  if (!prefix) return;

  const args = body.slice(1).trim().split(' ');
  const command = args.shift().toLowerCase();

  const ctx = {
    sock,
    msg,
    body,
    args,
    grub,
    args,
    reply: (txt) => sock.sendMessage(msg.key.remoteJid, {text: txt},{quoted: msg}),
    react: (txt) => sock.sendMessage(msg.key.remoteJid, {react: {text: txt, key: msg.key}},{quoted: msg})
  }

  try {
    const plugin = plugins.get(command);

    if (plugin) {
      await plugin.exec(ctx);
      log(info(`Execution plugins ${command}`));
    }
  } catch (e) {
    log(err(e));
  }
}

export default handle;