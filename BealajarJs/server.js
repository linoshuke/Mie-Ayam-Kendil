const express = require('express');
const app = express();
const path = require('path');

// Serve static files
app.use(express.static(__dirname));

// Route untuk halaman utama
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = 8000;
app.listen(PORT, (err) => {
    if (err) {
        console.error('Error starting server:', err);
        return;
    }
    console.log(`Server berjalan di http://localhost:${PORT}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} sudah digunakan. Silakan gunakan port lain.`);
    } else {
        console.error('Error:', err);
    }
}); 