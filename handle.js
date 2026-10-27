import fs from 'fs';
import {pathToFileURL} from 'url';

const plugins = new Map();

export function loadPlugin() {
  fs.readdirSync('plugins').forEach(file => {
    import(pathToFileURL(`plugins/${file}`)).then(module => {
      if (module.default?.name) plugins.set(module.default.name, module.default);
    }).catch(e => console.log(e));
  });
}
export function handleMsg(sock, {messages}) {
  const msg = messages[0];
  if (!msg || !msg.message) return;

  const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';
  if (!text.startsWith('!')) return;

  msg.reply = (txt) => sock.sendMessage(msg.key.remoteJid, {text: txt},{quoted: msg});
  msg.video = (media, desk) => sock.sendMessage(msg.key.remoteJid, {video: media, caption: desk},{quoted: msg});
  msg.audio = (media, type) => sock.sendMessage(msg.key.remoteJid, {audio: media, mimetype: 'audio/mpeg'},{quoted: msg});
  msg.chat = (txt) => sock.sendMessage(msg.key.remoteJid, {text: txt},{quoted: msg});

  const [cmd, ...args] = text.slice(1).trim().split(/\s+/);

  Promise.resolve().then(() => {
    plugins.get(cmd)?.run(sock, msg, args);
  }).catch(e => console.log(e));
}