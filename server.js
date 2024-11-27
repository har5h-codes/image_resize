const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const cors = require('cors');

const app = express();
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

// Updated CORS configuration
app.use(cors({
    origin: ['https://image-resize-psi.vercel.app', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept']
}));

// Main resize endpoint
app.post('/resize', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No image uploaded' });
    }

    try {
        console.log("Processing image resize request");
        console.log("File size:", req.file.size);
        console.log("Requested dimensions:", req.body.width, "x", req.body.height);
        
        const width = parseInt(req.body.width) || 800;
        const height = parseInt(req.body.height) || 600;
        const format = req.body.format || 'jpeg';

        const processedImage = await sharp(req.file.buffer)
            .resize(width, height, {
                fit: 'contain',
                withoutEnlargement: true,
                kernel: 'lanczos3'
            })
            [format]({
                quality: 90,
                progressive: true,
                chromaSubsampling: '4:4:4'
            })
            .toBuffer();

        console.log("Image processed successfully");
        res.set('Content-Type', `image/${format}`);
        res.send(processedImage);
    } catch (error) {
        console.error('Error processing image:', error);
        res.status(500).json({ error: 'Image processing failed', details: error.message });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));