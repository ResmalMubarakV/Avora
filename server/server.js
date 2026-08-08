const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium');

dotenv.config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const memoryRoutes = require("./routes/memoryRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const userRoutes = require("./routes/userRoutes");
const publicRoutes = require("./routes/publicRoutes");
const aiRoutes = require("./routes/aiRoutes");
const adminRoutes = require("./routes/adminRoutes");
const searchRoutes = require("./routes/searchRoutes");

const app = express();

connectDB();

app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true,
    })
);

app.use(express.json({ limit: '10mb' })); // Increased limit to accept rich HTML content with base64/images

// ==========================================
// SERVER-SIDE PUPPETEER PDF GENERATION ROUTE
// ==========================================
async function getBrowser() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const localPuppeteer = require('puppeteer');
    return localPuppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true,
    });
  } else {
    return puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });
  }
}

app.post('/api/export-pdf', async (req, res) => {
  let browser = null;
  try {
    const { htmlContent } = req.body; 

    browser = await getBrowser();
    const page = await browser.newPage();
    
    // Set exact viewport to match your template dimensions (800x1131)
    await page.setViewport({ width: 800, height: 1131 });
    
    // Load the HTML content directly
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      width: '800px',
      height: '1131px',
      printBackground: true,
    });

    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=memory-diary.pdf');
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Server PDF generation error:", error);
    if (browser) await browser.close();
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});
// ==========================================

app.use("/api/auth", authRoutes);
app.use("/api/memories", memoryRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/users", userRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/search", searchRoutes);

app.get("/", (req, res) => {
    res.send("Avora API Running...");
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});