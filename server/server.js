const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");

const app = express();

app.use(cors());
app.use(express.json());

// Conversion stats
let conversionStats = {
  totalConversions: 0,
  successfulConversions: 0,
  failedConversions: 0,
  pdfToDocx: 0,
  docxToPdf: 0,
  lastConversionTime: null
};

// File size limit (10MB for free tier)
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// File filter for validation
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === ".pdf" || ext === ".docx") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF and DOCX files are allowed"), false);
  }
};

const upload = multer({ 
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter
});

// Health check route
app.get("/", (req, res) => {
  res.json({
    status: "online",
    message: "PDF-Word Converter Server",
    version: "1.0.0",
    endpoints: ["/upload", "/stats", "/health"]
  });
});

// Stats endpoint
app.get("/stats", (req, res) => {
  res.json(conversionStats);
});

// Health endpoint
app.get("/health", (req, res) => {
  const uptime = process.uptime();
  res.json({
    status: "healthy",
    uptime: Math.floor(uptime) + " seconds",
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString()
  });
});


// Upload route with enhanced error handling
app.post("/upload", (req, res) => {
  upload.single("file")(req, res, (err) => {
    // Handle multer errors
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        conversionStats.failedConversions++;
        return res.status(400).json({ 
          success: false,
          message: "File too large. Maximum size is 10MB",
          maxSize: "10MB"
        });
      }
      conversionStats.failedConversions++;
      return res.status(400).json({ 
        success: false,
        message: err.message 
      });
    } else if (err) {
      conversionStats.failedConversions++;
      return res.status(400).json({ 
        success: false,
        message: err.message 
      });
    }

    if (!req.file) {
      conversionStats.failedConversions++;
      return res.status(400).json({ 
        success: false,
        message: "No file uploaded. Please select a PDF or DOCX file" 
      });
    }

    const startTime = Date.now();
    const inputPath = path.resolve(req.file.path);
    const outputDir = path.resolve("outputs");
    const ext = path.extname(req.file.originalname).toLowerCase();
    const originalFileName = path.basename(req.file.originalname, ext);

    console.log("\n[NEW CONVERSION]");
    console.log("File:", req.file.originalname);
    console.log("Size:", (req.file.size / 1024).toFixed(2), "KB");
    console.log("Type:", ext === ".pdf" ? "PDF → DOCX" : "DOCX → PDF");

    conversionStats.totalConversions++;

    let convertTo;
    let command;
    
    if (ext === ".pdf") {
      // PDF to DOCX - use Python pdf2docx
      convertTo = "docx";
      conversionStats.pdfToDocx++;
      const outputFileName = path.basename(inputPath, ext) + "." + convertTo;
      const outputPath = path.join(outputDir, outputFileName);
      command = `python pdf_to_docx.py "${inputPath}" "${outputPath}"`;
    } else if (ext === ".docx") {
      // DOCX to PDF - use LibreOffice
      convertTo = "pdf";
      conversionStats.docxToPdf++;
      command = `"C:\\Program Files\\LibreOffice\\program\\soffice.exe" --headless --convert-to ${convertTo} "${inputPath}" --outdir "${outputDir}"`;
    } else {
      conversionStats.failedConversions++;
      return res.status(400).json({ 
        success: false,
        message: "Invalid file format. Only PDF and DOCX are supported" 
      });
    }

    exec(command, (error, stdout, stderr) => {
      const conversionTime = ((Date.now() - startTime) / 1000).toFixed(2);

      if (error) {
        console.error("❌ Conversion failed:", error.message);
        conversionStats.failedConversions++;
        
        // Clean up input file on error
        if (fs.existsSync(inputPath)) {
          fs.unlinkSync(inputPath);
        }
        
        return res.status(500).json({ 
          success: false,
          message: "Conversion failed. Please try again or use a different file",
          error: error.message,
          conversionTime: conversionTime + "s"
        });
      }

      const outputFileName = path.basename(inputPath, ext) + "." + convertTo;
      const outputPath = path.join(outputDir, outputFileName);

      // Check if output file exists before sending
      if (fs.existsSync(outputPath)) {
        const outputSize = fs.statSync(outputPath).size;
        
        console.log("✅ Conversion successful!");
        console.log("Time:", conversionTime + "s");
        console.log("Output size:", (outputSize / 1024).toFixed(2), "KB\n");
        
        conversionStats.successfulConversions++;
        conversionStats.lastConversionTime = new Date().toISOString();
        
        // Set download filename to original name
        const downloadFileName = originalFileName + "." + convertTo;
        
        res.download(outputPath, downloadFileName, (err) => {
          // Clean up temporary files after download
          if (fs.existsSync(inputPath)) {
            fs.unlinkSync(inputPath);
          }
          if (fs.existsSync(outputPath)) {
            fs.unlinkSync(outputPath);
          }
          if (err) {
            console.error("Error during download:", err);
          }
        });
      } else {
        console.error("❌ Output file not found");
        conversionStats.failedConversions++;
        
        // Clean up input file
        if (fs.existsSync(inputPath)) {
          fs.unlinkSync(inputPath);
        }
        
        return res.status(500).json({ 
          success: false,
          message: "Conversion completed but output file not found. Please try again",
          conversionTime: conversionTime + "s"
        });
      }
    });
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});