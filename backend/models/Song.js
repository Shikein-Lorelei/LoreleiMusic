const mongoose = require('mongoose');

const SongSchema = new mongoose.Schema({
    title: String,
    artist: String,
    audioUrl: String,
}, { timestamps: true });

module.exports = mongoose.model('Song', SongSchema);
