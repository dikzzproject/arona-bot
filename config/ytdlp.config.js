import { spawn } from 'child_process';

const ytdownloader = (type, url) => {
  return new Promise((resolve, reject) => {
    try {
      new URL(url);
    } catch {
      return reject(new Error('URL tidak valid'));
    }

    const baseArgs = [
      '--js-runtimes', `node:${process.execPath}`,
      '--remote-components', 'ejs:github',
      '--no-playlist',
      '--max-filesize', '100M',
      '-o', '-'
    ];

    const args = type === 'audio'
    ? [...baseArgs, '-f', 'bestaudio[ext=m4a]/bestaudio/best', '--', url]
    : [...baseArgs, '-f', 'best[height<=720][ext=mp4]/best[height<=720]/best', '--', url];
    
    const ytdlp = spawn('yt-dlp', args);
    const chunks = [];
    const errorChunks = [];

    ytdlp.stdout.on('data', (c) => chunks.push(c));
    ytdlp.stderr.on('data', (c) => errorChunks.push(c));
    ytdlp.on('close', (code) => {
      if (code === 0 && chunks.length > 0) {
        resolve(Buffer.concat(chunks));
      } else {
        const errorMsg = Buffer.concat(errorChunks).toString() || `Process exited with code ${code}`;
        reject(new Error(`yt-dlp error: ${errorMsg}`));
      }
    });
    ytdlp.on('error', (err) => {
      reject(new Error(`Gagal menjalankan yt-dlp: ${err.message}`));
    });
  });
};

export default ytdownloader;