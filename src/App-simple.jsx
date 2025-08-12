import React from 'react';
import { useState, useEffect } from 'react';

const API_BASE_URL = 'https://api.themoviedb.org/3'
const DISCOVER_URL = `${API_BASE_URL}/discover/movie`
const API_KEY = import.meta.env.VITE_TMDB_API_KEY

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
};

const App = () => {
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        if (!API_KEY) {
          setError('API key missing');
          setIsLoading(false);
          return;
        }

        const response = await fetch(`${DISCOVER_URL}?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc`, options);
        
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }
        
        const data = await response.json();
        setMovieList(data.results || []);
      } catch (err) {
        setError('Error loading movies');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div style={{ padding: '20px', backgroundColor: '#030014', color: 'white', minHeight: '100vh' }}>
      <h1>Movie App Test</h1>
      
      {isLoading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' }}>
        {movieList.slice(0, 8).map((movie) => (
          <div key={movie.id} style={{ backgroundColor: '#0f0d23', padding: '10px', borderRadius: '8px' }}>
            <img 
              src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} 
              alt={movie.title}
              style={{ width: '100%', borderRadius: '4px' }}
            />
            <h3 style={{ fontSize: '14px', margin: '10px 0 5px 0' }}>{movie.title}</h3>
            <p style={{ fontSize: '12px', color: '#9ca4ab' }}>{movie.release_date?.split('-')[0]}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;