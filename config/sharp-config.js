module.exports = {
  jpeg: {
      quality: 90,
      progressive: true,
      chromaSubsampling: '4:4:4',
      force: false
  },
  png: {
      progressive: true,
      compressionLevel: 9,
      force: false
  },
  webp: {
      quality: 90,
      force: false
  },
  resize: {
      fit: 'contain',
      withoutEnlargement: true,
      kernel: 'lanczos3'
  }
};