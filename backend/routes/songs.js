const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Song = require('../models/Song');

// Konfigurasi penyimpanan file
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// CREATE - Tambah lagu
router.post('/', upload.single('audio'), async (req, res) => {
    try {
        const { title, artist } = req.body;
        const audioUrl = `/uploads/${req.file.filename}`;
        const song = new Song({ title, artist, audioUrl });
        await song.save();
        res.json(song);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// READ - Ambil semua lagu
router.get('/', async (req, res) => {
    try {
        const songs = await Song.find();
        res.json(songs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// SEARCH - Cari lagu berdasarkan title atau artist
router.get('/search', async (req, res) => {
    try {
        const q = req.query.q;
        const songs = await Song.find({
            $or: [
                { title: new RegExp(q, 'i') },
                { artist: new RegExp(q, 'i') }
            ]
        });
        res.json(songs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE - Edit lagu (optional audio update)
router.put('/:id', upload.single('audio'), async (req, res) => {
    try {
        const update = {
            title: req.body.title,
            artist: req.body.artist,
        };

        if (req.file) {
            const song = await Song.findById(req.params.id);
            if (song && song.audioUrl) {
                const oldPath = path.join(__dirname, '..', song.audioUrl);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }
            update.audioUrl = `/uploads/${req.file.filename}`;
        }

        const updatedSong = await Song.findByIdAndUpdate(req.params.id, update, { new: true });
        res.json(updatedSong);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE - Hapus lagu dan file audionya
router.delete('/:id', async (req, res) => {
    try {
        const song = await Song.findById(req.params.id);
        if (!song) return res.status(404).json({ message: 'Song not found' });

        // Hapus file audio
        const filePath = path.join(__dirname, '..', song.audioUrl);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // Hapus dari database
        await Song.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
