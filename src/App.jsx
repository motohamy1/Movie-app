import React from 'react';
import { useState, useEffect } from 'react';

// Minimal test version

const API_BASE_URL = 'https://api.themoviedb.org/3'
const SEARCH_URL = `${API_BASE_URL}/search/movie`
const DISCOVER_URL = `${API_BASE_URL}/discover/movie`
const API_KEY = import.meta.env.VITE_TMDB_API_KEY

if (!API_KEY) {
  console.error('TMDB API key is missing. Please check your environment variables.');
}

const options = {
method: 'GET',
headers: {
  accept: 'application/json',
  Authorization: `Bearer ${API_KEY}`
  }
};
const App = () => {
  return (
    <div style={{
      backgroundColor: '#030014',
      color: 'white',
      minHeight: '100vh',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '20px' }}>
        Movie App Working!
      </h1>
      <p style={{ textAlign: 'center' }}>Environment: {import.meta.env.MODE}</p>
      <p style={{ textAlign: 'center' }}>API Key: {API_KEY ? 'Present' : 'Missing'}</p>
    </div>
  )
}

export default App