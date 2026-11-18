import {
  makeWASocket,
  useMultiFileAuthState,
  makeCacheableSignalKeyStore,
  fetchLatestBaileysVersion
} from "@whiskeysockets/baileys";
import { log, logger, warn, info, err } from "./config/logger.config.js";
import readline from "readline/promises";
import connection from "./auth/connection.js";
import { loader } from "./events/loader.js";
import handle from "./events/message.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export default async function bot() {
  let isPairing = null;
  const session = `session/users`;

  try {
    const { state, saveCreds } = await useMultiFileAuthState(session);
    loader();
    
    const { version } = await fetchLatestBaileysVersion();
    const sock = (makeWASocket.default || makeWASocket)({
      version,
      logger,
      printQRInTerminal: !isPairing,
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, logger)
      },
      syncFullHistory: false
    });
    
    try {
      if (!state.creds.registered) {
        const question = await rl.question("Gunakan pairing code? [y/n] ");
        if (question.trim().toLowerCase() === "y") {
          isPairing = true;
        } else {
          isPairing = false;
        }
      } else {
        log(info(`Session ${sock.user.id.split(':')[0]} is already`));
      }
    } catch (e) {
      isPairing = null;
      log(err(e));
    }


    if (isPairing && !sock.authState.creds.registered) {
      try {
        const inputNumber = await rl.question('Masukan Nomor anda (628xx): ');
        const number = parseInt(inputNumber);
        setTimeout(async () => {
          try {
            const code = await sock.requestPairingCode(number);
            log(info(`pairing code anda: ${code}`));
          } catch (e) {
            log(err(e));
          }
        }, 3000);
      } finally {
        rl.close();
      }
    }

    connection(sock, isPairing);

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("messages.upsert", async (events) => {
      try {
        await handle(sock, events);
      } catch (e) {
        log(err(e));
      }
    });
  } catch (e) {
    log(err(e));
  }
}

bot();
