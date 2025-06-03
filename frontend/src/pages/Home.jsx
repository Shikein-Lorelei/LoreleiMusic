import React, { useState, useEffect } from 'react';
import { useSongs } from '../context/SongContext';

export default function Home() {
    const { allSongs, play, addToQueue, editSong, deleteSong } = useSongs();
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ title: '', artist: '', album: '' });
    const [isDeleting, setIsDeleting] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [visibleCards, setVisibleCards] = useState(3); // Default number of visible cards

    const filteredSongs = allSongs.filter(song =>
        song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle window resize to adjust number of visible cards
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setVisibleCards(1);
            } else if (window.innerWidth < 1024) {
                setVisibleCards(2);
            } else if (window.innerWidth < 1440) {
                setVisibleCards(3);
            } else {
                setVisibleCards(4);
            }
        };

        handleResize(); // Set initial value
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleEditClick = (song) => {
        setEditingId(song._id);
        setEditForm({
            title: song.title || '',
            artist: song.artist || '',
            album: song.album || ''
        });
    };

    const handleEditSave = async (songId) => {
        const result = await editSong(songId, editForm);
        if (result.success) {
            setEditingId(null);
            setEditForm({ title: '', artist: '', album: '' });
        } else {
            alert('Failed to update song: ' + result.error);
        }
    };

    const handleEditCancel = () => {
        setEditingId(null);
        setEditForm({ title: '', artist: '', album: '' });
    };

    const handleDeleteClick = async (songId) => {
        if (window.confirm('Are you sure you want to delete this song?')) {
            setIsDeleting(songId);
            const result = await deleteSong(songId);
            setIsDeleting(null);

            if (!result.success) {
                alert('Failed to delete song: ' + result.error);
            }
        }
    };

    // Carousel navigation
    const nextSlide = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex + visibleCards >= filteredSongs.length ? 0 : prevIndex + 1
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === 0 ? Math.max(0, filteredSongs.length - visibleCards) : prevIndex - 1
        );
    };

    // Get currently visible songs
    const getVisibleSongs = () => {
        const endIndex = Math.min(currentIndex + visibleCards, filteredSongs.length);
        return filteredSongs.slice(currentIndex, endIndex);
    };

    const styles = {
        title: {
            fontSize: 'clamp(1.2rem, 4vw, 1.5rem)', 
            color: '#ffffff', 
            textAlign: 'center', 
            paddingBottom: '5px', 
            marginTop: '-50px', 
            userSelect: 'none'
        },
        inputBoxContainer: {
            display: 'flex', 
            alignItems: 'center', 
            minWidth: 'min(26em, 90vw)', 
            width: '70%',
            maxWidth: '500px',
            backgroundColor: '#5c6370', 
            borderRadius: '0.8em', 
            overflow: 'hidden'
        },
        searchIcon: {
            height: '1.2em', 
            padding: '0 0.5em 0 0.8em', 
            fill: '#abb2bf',
            flexShrink: 0
        },
        inputBox: {
            backgroundColor: 'transparent', 
            color: '#ffffff', 
            outline: 'none',
            width: '100%', 
            border: '0', 
            padding: '0.5em 1.5em 0.5em 0', 
            fontSize: 'clamp(0.9rem, 2.5vw, 1rem)'
        },
        songInfo: { color: '#fff' },
        songTitle: { 
            fontSize: 'clamp(0.9rem, 2.5vw, 1.2rem)', 
            marginBottom: '0.2em', 
            display: 'flex', 
            alignItems: 'center', 
            textAlign: 'center', 
            paddingLeft: '10px', 
            paddingTop: '10px',
            wordBreak: 'break-word',
            hyphens: 'auto'
        },
        songArtist: { 
            fontSize: 'clamp(0.8rem, 2vw, 0.9rem)', 
            color: '#ccc', 
            display: 'flex', 
            alignItems: 'center', 
            textAlign: 'center', 
            paddingLeft: '10px', 
            paddingTop: '10px',
            wordBreak: 'break-word',
            hyphens: 'auto'
        }
    };

    const cardStyle = {
        position: 'relative',
        backgroundColor: '#2c2f33',
        padding: '0.5em',
        borderRadius: '1em',
        color: '#fff',
        width: '100%',
        maxWidth: '300px',
        minWidth: '200px',
        height: 'clamp(180px, 25vw, 200px)',
        overflow: 'hidden',
        boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
        transition: 'transform 0.2s ease-in-out',
        flex: '0 0 auto',
        margin: '0 clamp(5px, 1vw, 10px)',
    };

    const actionButtonStyle = {
        position: 'absolute',
        top: 'clamp(8em, 70%, 10em)',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: '0.3em',
        borderRadius: '0.2em',
        transition: 'background-color 0.2s ease'
    };

    const editFormStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5em',
        padding: '0.5em',
        backgroundColor: '#1e2124',
        borderRadius: '0.5em',
        height: '100%',
        overflow: 'auto'
    };

    const inputStyle = {
        padding: '0.3em',
        borderRadius: '0.3em',
        border: '1px solid #888',
        backgroundColor: '#2c2f33',
        color: '#fff',
        fontSize: 'clamp(0.8rem, 2vw, 0.9rem)'
    };

    const editButtonGroup = {
        display: 'flex',
        justifyContent: 'space-between',
        gap: '0.5em',
        flexWrap: 'wrap'
    };

    const carouselContainer = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '95%',
        maxWidth: '1400px',
        margin: '0 auto',
        position: 'relative',
        padding: '0 clamp(20px, 5vw, 40px)'
    };

    const carouselTrack = {
        display: 'flex',
        transition: 'transform 0.3s ease-in-out',
        width: '100%',
        justifyContent: 'center',
        gap: 'clamp(5px, 1vw, 10px)'
    };

    const navButton = {
        background: 'white',
        border: 'none',
        borderRadius: '50%',
        width: 'clamp(35px, 6vw, 40px)',
        height: 'clamp(35px, 6vw, 40px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 10,
        color: '#333',
        fontSize: 'clamp(0.8rem, 2vw, 1rem)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        transition: 'all 0.2s ease'
    };

    const prevButton = {
        ...navButton,
        left: '0',
    };

    const nextButton = {
        ...navButton,
        right: '0'
    };

    const Icon = {
        play: (<svg style={{ height: 'clamp(0.8em, 2.5vw, 1em)' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#00ffff"><path d="M8 5v14l11-7z" /></svg>),
        queue: (<svg style={{ height: 'clamp(0.8em, 2.5vw, 1em)' }} xmlns="http://www.w3.org/2000/svg" fill="#ffaa00" viewBox="0 0 24 24"><path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h12v2H3v-2zm16 0v2h2v2h-2v2h-2v-2h-2v-2h2v-2h2z" /></svg>),
        edit: (<svg style={{ height: 'clamp(0.8em, 2.5vw, 1em)' }} xmlns="http://www.w3.org/2000/svg" fill="#00ff88" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41L18.37 3.3a1 1 0 0 0-1.41 0L15.13 5.13l3.75 3.75 1.83-1.84z" /></svg>),
        delete: (<svg style={{ height: 'clamp(0.8em, 2.5vw, 1em)' }} xmlns="http://www.w3.org/2000/svg" fill="#ff5555" viewBox="0 0 24 24"><path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-4.5l-1-1z" /></svg>),
        save: (<svg style={{ height: 'clamp(0.8em, 2.5vw, 1em)' }} xmlns="http://www.w3.org/2000/svg" fill="#00ff88" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>),
        cancel: (<svg style={{ height: 'clamp(0.8em, 2.5vw, 1em)' }} xmlns="http://www.w3.org/2000/svg" fill="#ff5555" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /></svg>),
        spinner: (<svg style={{ height: 'clamp(0.8em, 2.5vw, 1em)', animation: 'spin 1s linear infinite' }} xmlns="http://www.w3.org/2000/svg" fill="#aaa" viewBox="0 0 24 24"><path d="M12 4V1L8 5l4 4V6a6 6 0 1 1-6 6H4a8 8 0 1 0 8-8z" /></svg>),
        note: (<svg style={{ height: 'clamp(0.8em, 2.5vw, 1em)', marginRight: '0.3em' }} xmlns="http://www.w3.org/2000/svg" fill="#00ffff" viewBox="0 0 24 24"><path d="M9 3v12.26A4 4 0 1 0 11 19V7h8V3H9z" /></svg>),
        user: (<svg style={{ height: 'clamp(0.8em, 2.5vw, 1em)', marginRight: '0.3em' }} xmlns="http://www.w3.org/2000/svg" fill="#bbbbbb" viewBox="0 0 24 24"><path d="M12 12c2.67 0 8 1.34 8 4v3H4v-3c0-2.66 5.33-4 8-4zm0-2a4 4 0 1 0-0.001-8.001A4 4 0 0 0 12 10z"/></svg>),
        leftArrow: (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>),
        rightArrow: (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>)
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            padding: 'clamp(0.5em, 2vw, 1em)',
            paddingBottom: '3em',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            maxWidth: '100vw',
            overflow: 'hidden'
        }}>
            <div style={{ 
                position: 'absolute', 
                top: 'clamp(200px, 25vh, 280px)',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minHeight: '120px'
            }}>
                <h1 style={styles.title}>♩ All Songs ♪</h1>
                <div style={styles.inputBoxContainer}>
                    <svg style={styles.searchIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path d="M46.599 46.599a4.498 4.498 0 0 1-6.363 0l-7.941-7.941C29.028 40.749 25.167 42 21 42 9.402 42 0 32.598 0 21S9.402 0 21 0s21 9.402 21 21c0 4.167-1.251 8.028-3.342 11.295l7.941 7.941a4.498 4.498 0 0 1 0 6.363zM21 6C12.717 6 6 12.714 6 21s6.717 15 15 15c8.286 0 15-6.714 15-15S29.286 6 21 6z" /></svg>
                    <input style={styles.inputBox} type="text" placeholder="Search by title or artist" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
            </div>

            <div style={{ 
                paddingTop: 'clamp(150px, 30vh, 200px)', 
                width: '100%',
                display: 'flex',
                justifyContent: 'center'
            }}>
                {filteredSongs.length === 0 ? (
                    <p style={{ color: '#fff', textAlign: 'center', fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)' }}>No songs found.</p>
                ) : (
                    <div style={carouselContainer}>
                        <button 
                            style={{
                                ...prevButton,
                                opacity: currentIndex === 0 ? 0.5 : 1,
                                cursor: currentIndex === 0 ? 'not-allowed' : 'pointer'
                            }} 
                            onClick={prevSlide} 
                            disabled={currentIndex === 0}
                        >
                            {Icon.leftArrow}
                        </button>
                        
                        <div style={carouselTrack}>
                            {getVisibleSongs().map((song) => (
                                <div key={song._id} style={cardStyle}>
                                    {editingId === song._id ? (
                                        <div style={editFormStyle}>
                                            <h3 style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)', margin: '0 0 0.5em 0' }}>{Icon.edit} Editing Song</h3>
                                            <input style={inputStyle} type="text" placeholder="Song title" value={editForm.title} onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))} />
                                            <input style={inputStyle} type="text" placeholder="Artist" value={editForm.artist} onChange={(e) => setEditForm(prev => ({ ...prev, artist: e.target.value }))} />
                                            <div style={editButtonGroup}>
                                                <button 
                                                    onClick={() => handleEditSave(song._id)} 
                                                    disabled={!editForm.title.trim() || !editForm.artist.trim()}
                                                    style={{ 
                                                        padding: '0.4em 0.8em', 
                                                        fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
                                                        borderRadius: '0.3em',
                                                        border: 'none',
                                                        backgroundColor: '#00ff88',
                                                        color: '#000',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.3em'
                                                    }}
                                                >
                                                    {Icon.save} Save
                                                </button>
                                                <button 
                                                    onClick={handleEditCancel}
                                                    style={{ 
                                                        padding: '0.4em 0.8em', 
                                                        fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
                                                        borderRadius: '0.3em',
                                                        border: 'none',
                                                        backgroundColor: '#ff5555',
                                                        color: '#fff',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.3em'
                                                    }}
                                                >
                                                    {Icon.cancel} Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div style={styles.songInfo}>
                                                <h3 style={styles.songTitle}>{Icon.note} {song.title}</h3>
                                                <p style={styles.songArtist}>{Icon.user} {song.artist}</p>
                                            </div>
                                            <button onClick={() => play(song)} style={{ ...actionButtonStyle, left: 'clamp(0.5em, 2vw, 1em)' }}>{Icon.play}</button>
                                            <button onClick={() => addToQueue(song)} style={{ ...actionButtonStyle, left: 'clamp(2.5em, 8vw, 3.5em)' }}>{Icon.queue}</button>
                                            <button onClick={() => handleEditClick(song)} style={{ ...actionButtonStyle, right: 'clamp(2.5em, 8vw, 3.5em)' }}>{Icon.edit}</button>
                                            <button onClick={() => handleDeleteClick(song._id)} style={{ ...actionButtonStyle, right: 'clamp(0.5em, 2vw, 1em)' }} disabled={isDeleting === song._id}>
                                                {isDeleting === song._id ? Icon.spinner : Icon.delete}
                                            </button>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                        
                        <button 
                            style={{
                                ...nextButton,
                                opacity: currentIndex + visibleCards >= filteredSongs.length ? 0.5 : 1,
                                cursor: currentIndex + visibleCards >= filteredSongs.length ? 'not-allowed' : 'pointer'
                            }} 
                            onClick={nextSlide} 
                            disabled={currentIndex + visibleCards >= filteredSongs.length}
                        >
                            {Icon.rightArrow}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}