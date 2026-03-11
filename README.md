# PDF ↔ Word Converter

A full-stack web and mobile application for converting PDF files to Word documents and vice versa. Built with React, Node.js, and Python, featuring a modern UI and Android mobile app support via Capacitor.

## 🚀 Features

- **Bidirectional Conversion**: Convert PDF to DOCX and DOCX to PDF
- **Real-time Statistics**: Track conversion metrics and success rates
- **File Upload**: Drag-and-drop or click to upload files
- **Progress Tracking**: Real-time upload and conversion progress
- **Mobile Ready**: Android app built with Capacitor
- **Free Tier**: 10MB file size limit for free conversions
- **Modern UI**: Clean, responsive interface with smooth animations
- **RESTful API**: Well-documented API endpoints

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Capacitor 8** - Native mobile wrapper
- **Axios** - HTTP client
- **CSS3** - Styling with modern animations

### Backend
- **Node.js** - Runtime environment
- **Express 5** - Web framework
- **Multer** - File upload middleware
- **Python** - PDF conversion engine
- **pdf2docx** - Python library for PDF to DOCX conversion

### Deployment
- **Render.com** - Backend hosting (Free tier)
- **Android** - Mobile platform

## 📋 Prerequisites

- Node.js (v14 or higher)
- Python 3.x
- npm or yarn
- Android Studio (for mobile development)
- Git

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/pdf-word-converter.git
cd pdf-word-converter
```

### 2. Setup Server

```bash
cd server
npm install
pip install -r requirements.txt
```

Create necessary directories:
```bash
mkdir uploads
mkdir outputs
```

### 3. Setup Client

```bash
cd ../client
npm install
```

## 🚀 Running the Application

### Start the Server

```bash
cd server
npm start
```

Server will run on `http://localhost:5000`

### Start the Client

```bash
cd client
npm run dev
```

Client will run on `http://localhost:5173`

### Build for Production

```bash
cd client
npm run build
```

## 📱 Android Development

### Setup Android Environment

1. Install Android Studio
2. Setup Android SDK
3. Configure environment variables

### Build Android App

```bash
cd client
npm run build
npx cap sync android
npx cap open android
```

### Run on Device/Emulator

Open in Android Studio and click Run, or use:

```bash
npx cap run android
```

## 📡 API Endpoints

### Health Check
```
GET /health
```
Returns server health status

### Upload & Convert
```
POST /upload
```
- **Body**: FormData with file (PDF or DOCX)
- **Response**: Converted file download

### Get Statistics
```
GET /stats
```
Returns conversion statistics:
```json
{
  "totalConversions": 100,
  "successfulConversions": 95,
  "failedConversions": 5,
  "pdfToDocx": 60,
  "docxToPdf": 40,
  "lastConversionTime": "2026-03-11T10:30:00.000Z"
}
```

## 📁 Project Structure

```
pdf-word-converter/
├── client/                 # React frontend
│   ├── android/           # Capacitor Android app
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── FileUpload.jsx
│   │   │   └── Stats.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                # Node.js backend
│   ├── uploads/          # Temporary file storage
│   ├── outputs/          # Converted files
│   ├── server.js         # Express server
│   ├── pdf_to_docx.py    # Python conversion script
│   ├── package.json
│   ├── requirements.txt
│   └── build.sh          # Build script for Render
│
├── DEPLOYMENT.md         # Deployment guide
├── render.yaml          # Render configuration
└── README.md            # This file
```

## 🎨 Features in Detail

### File Upload Component
- Drag and drop support
- File type validation (PDF, DOCX only)
- File size validation (10MB limit)
- Real-time upload progress
- Visual feedback with animations

### Statistics Dashboard
- Total conversions counter
- Success/failure rates
- Conversion type breakdown
- Last conversion timestamp
- Auto-refresh capabilities

### Mobile App
- Native Android experience
- Full feature parity with web app
- Optimized for mobile screens
- Hardware acceleration

## 🌐 Deployment

### Deploy to Render.com

1. Push your code to GitHub
2. Create a new Web Service on Render
3. Connect your repository
4. Configure build settings:
   - **Root Directory**: `server`
   - **Build Command**: `npm install && pip install -r requirements.txt`
   - **Start Command**: `node server.js`

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

### Update Frontend API URL

After deployment, update the API URL in:
- `client/src/App.jsx`
- `client/src/components/FileUpload.jsx`

Replace `http://localhost:5000` with your Render URL.

## ⚠️ Limitations

### Free Tier
- Maximum file size: 10MB
- Server sleeps after 15 minutes of inactivity
- First request after sleep: 30-60 seconds wake-up time
- 750 hours/month (sufficient for testing)

## 🔒 Security

- File type validation on both client and server
- File size limits enforced
- Temporary file cleanup
- CORS configured for allowed origins
- Input sanitization

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Rohit Kurade**

- GitHub: [@rohitkurade](https://github.com/rohitkurade)

## 🙏 Acknowledgments

- [pdf2docx](https://github.com/dothinking/pdf2docx) - Python library for PDF conversion
- [React](https://reactjs.org/) - Frontend framework
- [Express](https://expressjs.com/) - Backend framework
- [Capacitor](https://capacitorjs.com/) - Native mobile wrapper
- [Render](https://render.com/) - Hosting platform

## 📞 Support

For support, please open an issue in the GitHub repository.

---

Made with ❤️ by Rohit Kurade
