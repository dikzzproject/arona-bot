export default {
  command: 'bc',
  exec: async ({ sock, msg, body, reply }) => {
    const text = body.slice(3).trim();
    if (!text) return reply('Masukan text!!');
    reply(text);
  }
}