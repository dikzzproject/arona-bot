export default {
  command: "ping",
  exec: async ({ sock, msg, reply, react, grub }) => {
    await react("😹");
    reply("hello world");
  },
};
