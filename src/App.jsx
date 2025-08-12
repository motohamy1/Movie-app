import React from 'react';
import { useState, useEffect } from 'react';

import Search from './components/Search';
import Spinner from './components/Spinner';
import MovieCard from './components/MovieCard'
import { getTrendigMovies, updateSearchCount } from './appwrite';

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
  console.log('App component rendering...');
  
  const[searchTerm,setSearchTerm] = useState('');
  const[errorMessage, setErrorMessage] = useState('');
  const[isLoading, setIsLoading] = useState(false);
  const[movieList, setMovieList] = useState([]);
  const[trendingMovies, setTrendingMovies] = useState([]);
  const[debouncedSearchTerm, setDebouncedSearchTerm] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 600);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchMovies = async(query='')=>{
    setIsLoading(true)
    setErrorMessage('')

    if (!API_KEY) {
      setErrorMessage('API configuration error. Please check environment variables.')
      setIsLoading(false)
      return
    }

      try{
        const endpoint = query 
              ? `${SEARCH_URL}?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`
              : `${DISCOVER_URL}?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc`
        const response = await fetch(endpoint, options)

        if (!response.ok) {
          throw new Error("Something went wrong")
        }
        const data = await response.json()
        console.log(data)

        setMovieList(data.results || [])
        if(query && data.results && data.results.length > 0){
          try {
            await updateSearchCount(query, data.results[0])
          } catch (err) {
            console.error('Error updating search count:', err)
          }
        }
      } catch(error){
        console.error("Error fetching movies:", error)
        setErrorMessage("Error fetching movies. Please try again later.")

      } finally{
        setIsLoading(false)
      }
  }

  const loadTrendingMovies = async () =>{
    try{
      console.log('Loading trending movies...');
      const movies = await getTrendigMovies();
      console.log('Trending movies loaded:', movies);
      setTrendingMovies(movies || []);
    } catch (error){
      console.error("Error loading trending movies:", error)
      setTrendingMovies([]);
    }
  }

  useEffect( ()=>{
    console.log('Fetching movies for term:', debouncedSearchTerm)
    fetchMovies(debouncedSearchTerm);
  },[debouncedSearchTerm])

  useEffect(()=>{
    loadTrendingMovies();
  },[])

  console.log('About to render, movieList:', movieList.length, 'isLoading:', isLoading);
  
  return (
    <main>
      <div className='pattern'/>
      <div className="wrapper">
        <header>
          <img src="/hero.png" alt="hero" />
          <h1>Find <span className='text-gradient'>Movies</span>  you'll enjoy </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
        </header>
        { trendingMovies && trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>
            <ul>
              { trendingMovies.map((movie, index) => (
                <li key={movie.$id || index}>
                  <p>{index + 1}</p>
                  <img 
                    src={movie.poster_url} 
                    alt={movie.title || 'Movie'}
                    onError={(e) => e.target.style.display = 'none'}
                  />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="all-movies">
          <h2>all movies</h2>
          { isLoading ? (
              <Spinner />
            ) 
            : errorMessage ? (
              <p className='text-red-500'>{errorMessage}</p>
            ) 
            : (
              <ul>
                {movieList && movieList.length > 0 ? (
                  movieList.map((movie)=>(
                    <MovieCard key={movie.id} movie={movie} />
                  ))
                ) : (
                  !isLoading && !errorMessage && <p>No movies found.</p>
                )}
              </ul>   
              )
          }
        </section>
      </div>
    </main>
  )
}

export default App