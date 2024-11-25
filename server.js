// server.js
const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const cors = require('cors');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors({
    origin: ['https://image-resize-psi.vercel.app'],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept']
}));


app.options('/resize', cors());

app.post('/resize', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No image uploaded' });
    }

    try {
        console.log("trying to resize");
        
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

        res.set('Content-Type', `image/${format}`);
        res.send(processedImage);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Image processing failed' });
    }
});

app.use(express.static('public'));

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
