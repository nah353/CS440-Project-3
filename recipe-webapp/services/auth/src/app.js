import express from "express";
import authRouter from "./routes/auth.js";

const app = express();

app.use(express.json({ limit: '10mb' }));

// simple health endpoint
app.get('/health', (req, res) => res.json({ ok: true, service: 'auth' }));

// health endpoint that matches gateway path
app.get('/api/auth/health', (req, res) => res.json({ ok: true, service: 'auth', via: 'gateway' }));

app.use("/api/auth", authRouter);

app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(500).json({ error: "Internal Server Error", message: err.message });
});

export default app;
