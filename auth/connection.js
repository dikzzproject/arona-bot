import { log, warn, info, err } from "../config/logger.config.js";
import bot from "../index.js";
import { DisconnectReason } from "@whiskeysockets/baileys";
import qrcode from "qrcode-terminal";
import chalk from "chalk";

const connection = (sock, isPairing) => {
  sock.ev.on("connection.update", async (update) => {
    const { qr, connection: status, lastDisconnect: connect } = update;

    if (!isPairing && qr) {
      qrcode.generate(qr, { small: true });
    }

    if (status === "open") {
      log(info(`User: ${sock.user.id.split(":")[0]}`));
      log(info("Bot Active!"));
    }
    if (status === "close") {
      if (connect?.error?.output?.statusCode !== DisconnectReason.loggedOut) {
        bot();
        log(warn("Reconnected..."));
      } else {
        log(err("Connection Error!", false));
      }
    }
  });
};

export default connection;
