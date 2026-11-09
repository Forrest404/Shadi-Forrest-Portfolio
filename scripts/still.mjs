// Reads an image on stdin and writes an AVIF poster to the path in argv[2].
import sharp from 'sharp';
const chunks = [];
for await (const c of process.stdin) chunks.push(c);
await sharp(Buffer.concat(chunks)).avif({ quality: 55, effort: 5 }).toFile(process.argv[2]);
