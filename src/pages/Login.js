import React, { useState } from 'react';
import './Spinner.css';
import axios from 'axios';
import { setToken } from '../utils/auth'; // adjust path as needed
import { useNavigate } from 'react-router-dom';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });
      
      setToken(response.data.token);
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
      {loading && <div className="spinner"></div>}  
        <h2 style={styles.heading}>Login</h2>

        {error && <p style={styles.error}>{error}</p>}

        <input
          type="email"
          placeholder="Email"
          style={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          style={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? <div style={styles.spinner}></div> : 'Login'}
        </button>

        <p style={styles.linkText}>
          Don’t have an account? <a href="/signup" style={styles.link}>Signup</a>
        </p>
      </form>
    </div>
  );
};

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    width: '300px',
  },
  heading: {
    marginBottom: '1rem',
    textAlign: 'center',
    color: '#333',
  },
  input: {
    padding: '0.75rem',
    marginBottom: '1rem',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '1rem',
  },
  button: {
    backgroundColor: '#973f7dff',
    color: '#fff',
    border: 'none',
    padding: '0.75rem',
    borderRadius: '5px',
    fontSize: '1rem',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '42px',
  },
  spinner: {
  width: '20px',
  height: '20px',
  border: '3px solid #fff',
  borderTop: '3px solid transparent',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite', // CSS name defined in App.css
},
  error: {
    color: 'red',
    fontSize: '0.9rem',
    marginBottom: '1rem',
    textAlign: 'center',
  },
  linkText: {
    marginTop: '1rem',
    textAlign: 'center',
    fontSize: '0.9rem',
  },
  link: {
    color: '#973f7dff',
    textDecoration: 'none',
  },
};

export default Login;
