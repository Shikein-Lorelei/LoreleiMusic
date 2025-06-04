import { useState } from 'react';
import axios from 'axios';
import { useSongs } from '../context/SongContext';

// SVG Icons
const MusicIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 18V5L21 3V16M9 18C9 19.6569 7.65685 21 6 21C4.34315 21 3 19.6569 3 18C3 16.3431 4.34315 15 6 15C7.65685 15 9 16.3431 9 18ZM21 16C21 17.6569 19.6569 19 18 19C16.3431 19 15 17.6569 15 16C15 14.3431 16.3431 13 18 13C19.6569 13 21 14.3431 21 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const HeadphonesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 18V12C3 9.61305 3.94821 7.32387 5.63604 5.63604C7.32387 3.94821 9.61305 3 12 3C14.3869 3 16.6761 3.94821 18.364 5.63604C20.0518 7.32387 21 9.61305 21 12V18M5 21H8C8.55228 21 9 20.5523 9 20V16C9 15.4477 8.55228 15 8 15H5V21ZM19 21H16C15.4477 21 15 20.5523 15 20V16C15 15.4477 15.4477 15 16 15H19V21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const UploadIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 16V20H20V16M12 4V16M8 8L12 4L16 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

function Upload() {
    const { fetchAllSongs } = useSongs();
    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [audio, setAudio] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim() || !artist.trim() || !audio) {
            alert('Please fill in all fields and select an audio file');
            return;
        }

        setIsUploading(true);

        try {
            const form = new FormData();
            form.append('title', title.trim());
            form.append('artist', artist.trim());
            form.append('audio', audio);

            await axios.post('https://lorelei-music-production.up.railway.app/api/songs', form);
            await fetchAllSongs();

            setTitle('');
            setArtist('');
            setAudio(null);

            const fileInput = document.querySelector('input[type="file"]');
            if (fileInput) fileInput.value = '';

            alert('Song uploaded successfully!');

        } catch (error) {
            console.error('Upload error:', error);
            alert('Upload failed. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div style={{
            padding: '1rem',
            minHeight: '120vh',
            paddingBottom: '120px',
            backgroundColor: '#121212',
            color: '#e0e0e0'
        }}>
            <h1 style={{ 
                position: 'absolute',  
                fontSize: '25px',
                top: '120px',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
            }}>
                <MusicIcon /> Upload New Song
            </h1>

            <form onSubmit={handleSubmit} style={{
                background: '#1e1e1e',
                padding: '2rem',
                borderRadius: '12px',
                border: '1px solid #333',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                minWidth: '400px',
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                position: 'absolute',
                top: '75%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
            }}>
                <div>
                    <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.5rem',
                        fontWeight: '600',
                        color: '#bbbbbb'
                    }}>
                        <MusicIcon /> Song Title *
                    </label>
                    <input
                        type="text"
                        placeholder="Enter song title"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        disabled={isUploading}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            borderRadius: '8px',
                            border: '1px solid #333',
                            fontSize: '1rem',
                            boxSizing: 'border-box',
                            background: isUploading ? '#2a2a2a' : '#2a2a2a',
                            color: '#e0e0e0'
                        }}
                    />
                </div>

                <div>
                    <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.5rem',
                        fontWeight: '600',
                        color: '#bbbbbb'
                    }}>
                        <UserIcon /> Artist *
                    </label>
                    <input
                        type="text"
                        placeholder="Enter artist name"
                        value={artist}
                        onChange={e => setArtist(e.target.value)}
                        disabled={isUploading}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            borderRadius: '8px',
                            border: '1px solid #333',
                            fontSize: '1rem',
                            boxSizing: 'border-box',
                            background: isUploading ? '#2a2a2a' : '#2a2a2a',
                            color: '#e0e0e0'
                        }}
                    />
                </div>

                <div>
                    <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.5rem',
                        fontWeight: '600',
                        color: '#bbbbbb'
                    }}>
                        <HeadphonesIcon /> Audio File *
                    </label>
                    <input
                        type="file"
                        accept="audio/*"
                        onChange={e => setAudio(e.target.files[0])}
                        disabled={isUploading}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            borderRadius: '8px',
                            border: '1px solid #333',
                            fontSize: '1rem',
                            boxSizing: 'border-box',
                            background: isUploading ? '#2a2a2a' : '#2a2a2a',
                            color: '#e0e0e0'
                        }}
                    />
                    {audio && (
                        <p style={{
                            margin: '0.5rem 0 0 0',
                            fontSize: '0.9rem',
                            color: '#888'
                        }}>
                            Selected: {audio.name}
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isUploading || !title.trim() || !artist.trim() || !audio}
                    style={{
                        padding: '1rem 2rem',
                        borderRadius: '8px',
                        border: 'none',
                        background: isUploading || !title.trim() || !artist.trim() || !audio
                            ? '#444'
                            : '#1db954',
                        color: 'white',
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        cursor: isUploading || !title.trim() || !artist.trim() || !audio
                            ? 'not-allowed'
                            : 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                    }}
                >
                    {isUploading ? (
                        <>
                            <span style={{
                                width: '20px',
                                height: '20px',
                                border: '2px solid #ffffff',
                                borderTop: '2px solid transparent',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite'
                            }}></span>
                            Uploading...
                        </>
                    ) : (
                        <>
                            <UploadIcon /> Upload Song
                        </>
                    )}
                </button>

                <p style={{
                    margin: 0,
                    fontSize: '0.9rem',
                    color: '#888',
                    textAlign: 'center'
                }}>
                    * Required fields
                </p>
            </form>

            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                input::file-selector-button {
                    background: #333;
                    color: #e0e0e0;
                    border: 1px solid #444;
                    padding: 0.5rem 1rem;
                    border-radius: 4px;
                    margin-right: 1rem;
                    cursor: pointer;
                }
            `}</style>
        </div>
    );
}

export default Upload;