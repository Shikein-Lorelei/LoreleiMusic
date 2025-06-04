import { createContext, useContext, useState, useEffect } from 'react';

const SongContext = createContext();

export const SongProvider = ({ children }) => {
    const [queue, setQueue] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [current, setCurrent] = useState(null);
    const [allSongs, setAllSongs] = useState([]);
    const [isQueueActive, setIsQueueActive] = useState(false);
    const [canGoToPrev, setCanGoToPrev] = useState(false);
    // State untuk memaksa re-render saat lagu sama dengan timestamp unik
    const [playbackId, setPlaybackId] = useState(0);

    // Ambil semua lagu dari server
    const fetchAllSongs = () => {
        fetch('lorelei-music-production.up.railway.app/api/songs')
            .then((res) => res.json())
            .then(setAllSongs)
            .catch(console.error);
    };

    useEffect(() => {
        fetchAllSongs();
    }, []);

    // Update lagu aktif berdasarkan currentIndex
    useEffect(() => {
        const source = isQueueActive ? queue : allSongs;
        
        if (currentIndex >= 0 && currentIndex < source.length) {
            // Tambahkan playbackId ke current untuk memastikan objek berubah
            const selectedSong = source[currentIndex];
            setCurrent({
                ...selectedSong,
                playbackId: playbackId,
                playbackTime: Date.now() // Timestamp unik untuk setiap play
            });
        } else {
            setCurrent(null);
        }
    }, [currentIndex, isQueueActive, playbackId]); // Hapus 'queue' dan 'allSongs' dari dependency

    // Helper function untuk trigger playback baru
    const triggerNewPlayback = () => {
        setPlaybackId(prev => prev + 1);
    };

    // Play lagu dari allSongs dan aktifkan mode list
    const play = (song) => {
        const indexInAll = allSongs.findIndex((s) => s._id === song._id);
        if (indexInAll !== -1) {
            setCurrentIndex(indexInAll);
            setIsQueueActive(false);
            setCanGoToPrev(false);
            triggerNewPlayback();
        }
    };

    // Tambahkan ke queue (boleh duplikat) - TIDAK auto switch ke queue mode
    const addToQueue = (song) => {
        setQueue((prev) => [...prev, song]);
    };

    // Play lagu langsung dari queue dan aktifkan queue mode
    const playFromQueue = (index) => {
        if (index >= 0 && index < queue.length) {
            setCurrentIndex(index);
            setIsQueueActive(true);
            setCanGoToPrev(false);
            triggerNewPlayback();
        }
    };

    // Next: tergantung mode aktif
    const next = () => {
        const source = isQueueActive ? queue : allSongs;
        if (source.length === 0) return;

        const newIndex = currentIndex + 1 < source.length ? currentIndex + 1 : 0;
        setCurrentIndex(newIndex);
        setCanGoToPrev(true);
        // Selalu trigger playback baru untuk memastikan lagu restart
        triggerNewPlayback();
    };

    const prev = (currentTime = 0, onRestart) => {
        const source = isQueueActive ? queue : allSongs;
        if (source.length === 0) return;

        // Jika belum pernah next atau currentTime > 3 detik, restart lagu saat ini
        if (!canGoToPrev || currentTime > 3) {
            if (onRestart) {
                onRestart(); // Callback untuk restart audio ke 0
            }
            triggerNewPlayback();
            return;
        }

        // Jika sudah bisa prev, pindah ke lagu sebelumnya
        const newIndex = currentIndex > 0 ? currentIndex - 1 : source.length - 1;
        setCurrentIndex(newIndex);
        triggerNewPlayback();
    };

    const selectFromQueue = (index) => {
        if (index >= 0 && index < queue.length) {
            setCurrentIndex(index);
            setIsQueueActive(true);
            setCanGoToPrev(true);
            triggerNewPlayback();
        }
    };

    const removeFromQueue = (id, indexToRemove) => {
        const newQueue = queue.filter((_, i) => i !== indexToRemove);
        
        if (isQueueActive && indexToRemove === currentIndex) {
            // Jika menghapus lagu yang sedang dimainkan
            if (newQueue.length === 0) {
                // Jika queue kosong, reset ke allSongs
                setCurrentIndex(-1);
                setIsQueueActive(false);
                setCanGoToPrev(false);
            } else {
                // Mainkan lagu selanjutnya atau sebelumnya
                const newIndex = Math.min(currentIndex, newQueue.length - 1);
                setCurrentIndex(newIndex);
                triggerNewPlayback();
            }
        } else if (isQueueActive && indexToRemove < currentIndex) {
            setCurrentIndex(currentIndex - 1);
        }
        setQueue(newQueue);
    };

    // Switch between queue mode and all songs mode
    const switchToQueueMode = () => {
        if (queue.length > 0) {
            setIsQueueActive(true);
            // Cari lagu yang sama di queue jika ada, atau mulai dari awal
            const currentSongInQueue = current ? queue.findIndex(s => s._id === current._id) : -1;
            if (currentSongInQueue !== -1) {
                setCurrentIndex(currentSongInQueue);
                // TIDAK trigger playback baru agar lagu tidak restart
            } else {
                setCurrentIndex(0);
                triggerNewPlayback();
            }
            setCanGoToPrev(false);
        }
    };

    const switchToAllSongsMode = () => {
        setIsQueueActive(false);
        // Cari lagu yang sama di allSongs
        const currentSongInAll = current ? allSongs.findIndex(s => s._id === current._id) : 0;
        setCurrentIndex(currentSongInAll !== -1 ? currentSongInAll : 0);
        setCanGoToPrev(false);
        // TIDAK trigger playback baru agar lagu tidak restart
    };

    // Hapus seluruh queue
    const clearQueue = () => {
        setQueue([]);
        if (isQueueActive) {
            // Jika sedang dalam mode queue, kembali ke allSongs
            setIsQueueActive(false);
            // Cari lagu yang sama di allSongs
            const currentSongInAll = current ? allSongs.findIndex(s => s._id === current._id) : 0;
            setCurrentIndex(currentSongInAll !== -1 ? currentSongInAll : -1);
            setCanGoToPrev(false);
        }
    };

    // Hapus lagu yang sudah dimainkan dari queue
    const removePlayedFromQueue = () => {
        if (!isQueueActive || currentIndex < 0) return;
        
        const newQueue = queue.slice(currentIndex + 1); // Ambil lagu setelah current
        setQueue(newQueue);
        
        if (newQueue.length === 0) {
            // Jika tidak ada lagu tersisa, kembali ke allSongs
            setIsQueueActive(false);
            const currentSongInAll = current ? allSongs.findIndex(s => s._id === current._id) : 0;
            setCurrentIndex(currentSongInAll !== -1 ? currentSongInAll : -1);
            setCanGoToPrev(false);
        } else {
            // Reset index ke 0 untuk queue baru
            setCurrentIndex(0);
            triggerNewPlayback();
        }
    };

    // Fungsi untuk edit lagu
    const editSong = async (songId, updatedData) => {
        try {
            const response = await fetch(`lorelei-music-production.up.railway.app/api/songs/${songId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });

            if (response.ok) {
                const updatedSong = await response.json();
                
                // Update allSongs
                setAllSongs(prev => prev.map(song => 
                    song._id === songId ? updatedSong : song
                ));
                
                // Update queue jika lagu ada di queue
                setQueue(prev => prev.map(song => 
                    song._id === songId ? updatedSong : song
                ));
                
                // Update current jika lagu yang diedit sedang dimainkan
                if (current && current._id === songId) {
                    setCurrent(prev => ({ ...prev, ...updatedSong }));
                }
                
                return { success: true, song: updatedSong };
            } else {
                throw new Error('Failed to update song');
            }
        } catch (error) {
            console.error('Error editing song:', error);
            return { success: false, error: error.message };
        }
    };

    // Fungsi untuk hapus lagu
    const deleteSong = async (songId) => {
        try {
            const response = await fetch(`lorelei-music-production.up.railway.app/api/songs/${songId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                // Hapus dari allSongs
                const newAllSongs = allSongs.filter(song => song._id !== songId);
                setAllSongs(newAllSongs);
                
                // Hapus dari queue
                const newQueue = queue.filter(song => song._id !== songId);
                setQueue(newQueue);
                
                // Handle jika lagu yang dihapus sedang dimainkan
                if (current && current._id === songId) {
                    if (isQueueActive) {
                        if (newQueue.length === 0) {
                            // Queue kosong, kembali ke allSongs
                            setIsQueueActive(false);
                            setCurrentIndex(newAllSongs.length > 0 ? 0 : -1);
                            setCanGoToPrev(false);
                        } else {
                            // Mainkan lagu selanjutnya di queue
                            const newIndex = Math.min(currentIndex, newQueue.length - 1);
                            setCurrentIndex(newIndex);
                            triggerNewPlayback();
                        }
                    } else {
                        // Mode allSongs
                        if (newAllSongs.length === 0) {
                            setCurrentIndex(-1);
                        } else {
                            const newIndex = Math.min(currentIndex, newAllSongs.length - 1);
                            setCurrentIndex(newIndex);
                            triggerNewPlayback();
                        }
                    }
                } else {
                    // Adjust currentIndex jika perlu
                    if (!isQueueActive) {
                        const deletedIndex = allSongs.findIndex(song => song._id === songId);
                        if (deletedIndex !== -1 && deletedIndex < currentIndex) {
                            setCurrentIndex(prev => prev - 1);
                        }
                    } else {
                        const deletedQueueIndex = queue.findIndex(song => song._id === songId);
                        if (deletedQueueIndex !== -1 && deletedQueueIndex < currentIndex) {
                            setCurrentIndex(prev => prev - 1);
                        }
                    }
                }
                
                return { success: true };
            } else {
                throw new Error('Failed to delete song');
            }
        } catch (error) {
            console.error('Error deleting song:', error);
            return { success: false, error: error.message };
        }
    };

    return (
        <SongContext.Provider
            value={{
                queue,
                current,
                currentIndex,
                allSongs,
                isQueueActive,
                canGoToPrev,
                play,
                playFromQueue,
                addToQueue,
                next,
                prev,
                selectFromQueue,
                removeFromQueue,
                clearQueue,
                removePlayedFromQueue,
                switchToQueueMode,
                switchToAllSongsMode,
                editSong,
                deleteSong,
                fetchAllSongs,
            }}
        >
            {children}
        </SongContext.Provider>
    );
};

export const useSongs = () => useContext(SongContext);