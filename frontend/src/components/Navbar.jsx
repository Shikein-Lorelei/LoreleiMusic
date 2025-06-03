import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth >= 768) {
                setIsOpen(false); // tutup menu saat kembali ke desktop
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <nav style={navStyle}>
            <div style={containerStyle}>
                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', userSelect: 'none' }}>
                    <svg width="200" height="60" viewBox="0 0 300 80" xmlns="http://www.w3.org/2000/svg" fill="none">
                        <circle cx="40" cy="40" r="30" fill="#00fff2" />
                        <path d="M48 28V50.5C48 54.09 45.09 57 41.5 57C37.91 57 35 54.09 35 50.5C35 46.91 37.91 44 41.5 44C43.1 44 44.57 44.61 45.68 45.59V30L48 28Z" fill="black" />
                        <path d="M46 30L35 34.5" stroke="black" strokeWidth="2.5" />
                        <text x="80" y="50" fontFamily="'Orbitron', sans-serif" fontSize="28" fontWeight="600">
                            <tspan fill="white">Lorelei </tspan>
                            <tspan fill="#00fff2">Music</tspan>
                        </text>
                    </svg>
                </div>

                {/* Hamburger / Close Icon */}
                {isMobile && (
                    <div style={hamburgerStyle} onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? (
                            <div style={closeIconStyle}>
                                <div style={xBar1}></div>
                                <div style={xBar2}></div>
                            </div>
                        ) : (
                            <>
                                <div style={bar}></div>
                                <div style={bar}></div>
                                <div style={bar}></div>
                            </>
                        )}
                    </div>
                )}

                {/* Nav Links */}
                <div style={{
                    ...navLinksStyle,
                    flexDirection: isMobile ? 'column' : 'row',
                    display: isMobile ? (isOpen ? 'flex' : 'none') : 'flex',
                    alignItems: isMobile ? 'flex-start' : 'center',
                    position: isMobile ? 'absolute' : 'static',
                    top: isMobile ? '70px' : 'auto',
                    right: isMobile ? '1rem' : 'auto',
                    background: isMobile
                        ? 'linear-gradient(160deg, #0f0c29, #302b63, #24243e)'
                        : 'transparent',
                    borderRadius: isMobile ? '10px' : '0',
                    padding: isMobile ? '1rem' : '0',
                    gap: isMobile ? '0.75rem' : '0.5rem',
                    boxShadow: isMobile ? '0 6px 20px rgba(0,0,0,0.4)' : 'none',
                    zIndex: 1001,
                    transition: 'all 0.3s ease-in-out',
                    minWidth: isMobile ? '150px' : 'auto',
                    userSelect: 'none'
                }}>
                    <Link to="/" style={linkBaseStyle} onMouseEnter={hoverEnter} onMouseLeave={hoverLeave}>
                        Home
                    </Link>
                    <Link to="/upload" style={linkBaseStyle2} onMouseEnter={hoverEnter} onMouseLeave={hoverLeave}>
                        Upload
                    </Link>
                </div>
            </div>
        </nav>
    );
}

// Styles
const navStyle = {
    position: 'fixed',
    top: 0,
    width: '100%',
    background: 'linear-gradient(90deg, #0f0c29, #302b63, #24243e)',
    color: '#fff',
    padding: '12px 0',
    zIndex: 1000,
    boxShadow: '0 2px 20px rgba(0,0,0,0.7)',
    fontFamily: "'Orbitron', sans-serif"
};

const containerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '0 auto',
    width: '100%',
    maxWidth: '1200px',
    padding: '0 1.5rem',
    position: 'relative',
};

const navLinksStyle = {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
};

const linkBaseStyle = {
    color: 'white',
    textDecoration: 'none',
    padding: '0.5rem 1.5rem',
    transition: 'all 0.3s ease',
    fontSize: '1.1rem',
    fontWeight: '600',
    borderRadius: '8px',
    border: '2px solid transparent',
    marginRight: '5px'
};

const linkBaseStyle2 = {
    color: 'white',
    textDecoration: 'none',
    padding: '0.5rem 1.5rem',
    transition: 'all 0.3s ease',
    fontSize: '1.1rem',
    fontWeight: '600',
    borderRadius: '8px',
    border: '2px solid transparent',
    marginRight: '70px'
};

const hamburgerStyle = {
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
    gap: '5px',
    padding: '10px',
    marginRight: '50px'
};

const bar = {
    width: '25px',
    height: '3px',
    backgroundColor: '#00fff2',
    borderRadius: '3px',
};

const closeIconStyle = {
    position: 'relative',
    width: '25px',
    height: '25px',
};

const xBar1 = {
    position: 'absolute',
    width: '100%',
    height: '3px',
    backgroundColor: '#00fff2',
    transform: 'rotate(45deg)',
    top: '50%',
    left: 0,
    transformOrigin: 'center',
};

const xBar2 = {
    position: 'absolute',
    width: '100%',
    height: '3px',
    backgroundColor: '#00fff2',
    transform: 'rotate(-45deg)',
    top: '50%',
    left: 0,
    transformOrigin: 'center',
};

function hoverEnter(e) {
    e.target.style.transform = 'scale(1.05)';
    e.target.style.color = '#00fff2';
}

function hoverLeave(e) {
    e.target.style.transform = 'scale(1)';
    e.target.style.color = 'white';
}
