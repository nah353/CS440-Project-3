import express from "express";
import fs from "fs";
import path from "path";

const app = express();
app.use(express.json({ limit: '50mb' }));

// store uploads at /app/uploads inside the container
const UPLOAD_DIR = path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

app.get('/health', (req, res) => res.json({ ok: true, service: 'media' }));

app.post('/upload-base64', (req, res) => {
  try {
    const { filename, data } = req.body || {};
    if (!filename || !data) return res.status(400).json({ error: 'missing filename or data' });
    const buffer = Buffer.from(data, 'base64');
    const outPath = path.join(UPLOAD_DIR, filename);
    fs.writeFileSync(outPath, buffer);
    res.json({ ok: true, path: `/uploads/${filename}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default app;
