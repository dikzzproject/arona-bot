import { spawn } from 'child_process';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

async function ytsearch(query) {
  const args = [
    `ytsearch1:${query}`,
    '--dump-json',
    '--flat-playlist',
    '--no-warnings'
  ];

  const { stdout } = await execFileAsync('yt-dlp', args, {
    maxBuffer: 1024 * 1024 * 2
  });

  const output = (stdout || '').trim();
  if (!output) return null;

  // Wajib ambil indeks [0] dari hasil split('\n')
  const firstLine = output.split('\n')[0];
  const data = JSON.parse(firstLine);

  return {
    id: data.id,
    title: data.title || 'Tanpa Judul',
    url: data.url || `https://youtube.com{data.id}`,
    duration: data.duration_string || 'Tidak diketahui',
    channel: data.uploader || data.channel || 'Tidak diketahui'
  };
}

// 2. Buat stream video langsung ke stdout tanpa menyimpan file ke disk
function ytstream(videoUrl) {
  return new Promise((resolve, reject) => {
    // 1. Jalankan yt-dlp dengan prioritas codec H.264 (avc1) + AAC (mp4a)
    const ytdlpArgs = [
      videoUrl,
      '-f', 'bv*[height<=480]+ba/b[height<=480]/b',
      '--merge-output-format', 'mkv',
      '--no-warnings',
      '-o', '-'
    ];

    // 2. Konversi MKV dari pipe ke MP4 (H.264 + AAC) untuk WhatsApp
    const ffmpegArgs = [
      '-i', 'pipe:0',
      '-map', '0:v:0',             // Ambil trek video pertama
      '-map', '0:a:0?',            // Ambil trek audio pertama (tanda ? agar aman jika video bisu)
      '-c:v', 'libx264',
      '-preset', 'ultrafast',
      '-crf', '28',
      '-pix_fmt', 'yuv420p',
      '-c:a', 'aac',               // Encode audio ke AAC standar WhatsApp
      '-b:a', '128k',
      '-ar', '44100',              // Sample rate audio standar HP
      '-ac', '2',                  // Audio stereo
      '-movflags', 'frag_keyframe+empty_moov+default_base_moof',
      '-f', 'mp4',
      'pipe:1'
    ];

    const ytdlp = spawn('yt-dlp', ytdlpArgs);
    const ffmpeg = spawn('ffmpeg', ffmpegArgs);

    // Hubungkan output yt-dlp langsung ke input ffmpeg di RAM
    ytdlp.stdout.pipe(ffmpeg.stdin);

    const chunks = [];
    let errorLog = '';

    ffmpeg.stdout.on('data', (chunk) => {
      chunks.push(chunk);
    });

    ffmpeg.stderr.on('data', (data) => {
      errorLog += data.toString();
    });

    ytdlp.on('error', reject);
    ffmpeg.on('error', reject);

    // Tangani error pipe jika salah satu proses berhenti lebih awal
    ffmpeg.stdin.on('error', () => {});

    ffmpeg.on('close', (code) => {
      if (code === 0 && chunks.length > 0) {
        resolve(Buffer.concat(chunks));
      } else {
        reject(new Error(`Proses video gagal (kode ${code}): ${errorLog.slice(-300)}`));
      }
    });
  });
}

async function ytfastsearch(query) {
  // 1. Ambil metadata + cek codec dalam 1 perintah cepat (360p/480p H.264)
  const metaArgs = [
    `ytsearch1:${query}`,
    '-f', 'bv*[height<=480][vcodec^=avc1]+ba[acodec^=mp4a]/bv*[height<=480]+ba/b[height<=480]/b',
    '--print', '%(id)s|||%(title)s|||%(uploader)s|||%(duration_string)s|||%(vcodec)s|||%(webpage_url)s',
    '--no-warnings',
    '--no-playlist'
  ];

  const { stdout } = await execFileAsync('yt-dlp', metaArgs, {
    maxBuffer: 1024 * 1024
  });

  const line = (stdout || '').trim().split('\n')[0];
  if (!line) return null;

  const [id, title, channel, duration, vcodec, webpageUrl] = line.split('|||');
  
  // Cek apakah video dari YouTube sudah memakai codec H.264 (avc1)
  const isAlreadyH264 = (vcodec || '').includes('avc1');

  // 2. Ambil stream video + audio secara paralel dengan aria2c/downloader internal tercepat
  const buffer = await new Promise((resolve, reject) => {
    const ytdlpArgs = [
      webpageUrl || `https://youtube.com{id}`,
      '-f', 'bv*[height<=480][vcodec^=avc1]+ba[acodec^=mp4a]/bv*[height<=480]+ba/b[height<=480]/b',
      '--merge-output-format', 'mkv',
      '--concurrent-fragments', '4', // Unduh 4 bagian video sekaligus secara paralel
      '--no-warnings',
      '-o', '-'
    ];

    // Jika sudah H.264, langsung COPY tanpa encode ulang (10x lebih cepat!)
    const videoCodecArgs = isAlreadyH264
      ? ['-c:v', 'copy']
      : ['-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '28', '-pix_fmt', 'yuv420p'];

    const ffmpegArgs = [
      '-i', 'pipe:0',
      '-map', '0:v:0',
      '-map', '0:a:0?',
      ...videoCodecArgs,
      '-c:a', 'aac',
      '-b:a', '96k',
      '-ar', '44100',
      '-ac', '2',
      '-movflags', 'frag_keyframe+empty_moov+default_base_moof',
      '-f', 'mp4',
      'pipe:1'
    ];

    const ytdlp = spawn('yt-dlp', ytdlpArgs);
    const ffmpeg = spawn('ffmpeg', ffmpegArgs);

    ytdlp.stdout.pipe(ffmpeg.stdin);

    const chunks = [];
    let errorLog = '';

    ffmpeg.stdout.on('data', (chunk) => chunks.push(chunk));
    ffmpeg.stderr.on('data', (data) => { errorLog += data.toString(); });

    ytdlp.on('error', reject);
    ffmpeg.on('error', reject);
    ffmpeg.stdin.on('error', () => {});

    ffmpeg.on('close', (code) => {
      if (code === 0 && chunks.length > 0) {
        resolve(Buffer.concat(chunks));
      } else {
        reject(new Error(`Gagal memproses video: ${errorLog.slice(-200)}`));
      }
    });
  });

  return {
    title: title || 'Tanpa Judul',
    url: webpageUrl || `https://youtube.com${id}`,
    channel: channel || 'Tidak diketahui',
    duration: duration || 'Tidak diketahui',
    buffer
  };
}

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

export {
  ytdownloader,
  ytsearch,
  ytstream,
  ytfastsearch
}