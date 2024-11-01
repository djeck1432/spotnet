import React from 'react';
import { Link } from 'react-router-dom';

const SuccessPage = () => {
  return (
    <div style={styles.body}>
      <div style={styles.star} className="star" />
      <div style={{ ...styles.star, top: '10%', right: '20%' }} className="star" />
      <div style={{ ...styles.star, bottom: '20%', right: '15%' }} className="star" />
      <div style={{ ...styles.star, bottom: '30%', left: '20%' }} className="star" />
      
      <div style={styles.container}>
        <h1 style={styles.h1}>Congratulations</h1>
        <p style={styles.p}>Your submission was sent successfully!</p>
        <div style={styles.checkCircle}>
          <div style={styles.check}></div>
        </div>
        <Link to="/" style={styles.button}>Back to homepage</Link>
      </div>
    </div>
  );
};

const styles = {
  body: {
    margin: 0,
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'radial-gradient(circle at top left, #1a1a1a 0%, #000000 100%)',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
    color: 'white',
    position: 'relative',
    overflow: 'hidden'
  },
  container: {
    textAlign: 'center',
    padding: '2rem',
    maxWidth: '400px',
    position: 'relative',
    zIndex: 1
  },
  h1: {
    fontSize: '2.5rem',
    marginBottom: '0.5rem'
  },
  p: {
    color: '#ffffff99',
    marginBottom: '2rem'
  },
  checkCircle: {
    width: '80px',
    height: '80px',
    background: '#e040fb',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '2rem auto',
    position: 'relative',
    zIndex: 1
  },
  check: {
    width: '40%',
    height: '40%',
    border: '4px solid white',
    borderLeft: 0,
    borderTop: 0,
    transform: 'rotate(45deg) translate(-5%, -10%)'
  },
  button: {
    display: 'block',
    padding: '1rem 2rem',
    background: 'linear-gradient(to right, #7c4dff, #e040fb)',
    border: 'none',
    borderRadius: '8px',
    color: 'white',
    fontSize: '1rem',
    fontWeight: 600,
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
    textAlign: 'center'
  },
  star: {
    position: 'absolute',
    width: '20px',
    height: '20px',
    background: 'white',
    clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
    opacity: 0.3,
    top: '15%',
    left: '15%'
  }
};

export default SuccessPage;
