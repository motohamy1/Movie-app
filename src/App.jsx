import React from 'react'
import { useState, useEffect } from 'react'
import Search from './components/Search'
import Spinner from './components/Spinner'

const API_BASE_URL = 'https://api.themoviedb.org/3/discover/movie'
const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const options = {
method: 'GET',
headers: {
  accept: 'application/json',
  Authorization: `Bearer ${API_KEY}`
  }
};
const App = () => {
  const[searchTerm,setSearchTerm] = useState('')
  const[errorMessage, setErrorMessage] = useState('')
  const[isLoading, setIsLoading] = useState(false)
  const[movieList, setMovieList] = useState([])

  const fetchMovies = async()=>{
    setIsLoading(true)
    setErrorMessage('')

      try{
        const endpoint = `${API_BASE_URL}?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc`
        const response = await fetch(endpoint, options)

        if (!response.ok) {
          throw new Error("Something went wrong")
        }
        const data = await response.json()
        console.log(data)

        if(data.Response === "False"){
          setErrorMessage(data.Error)
        }
        setMovieList(data.results)

      } catch(error){
        console.error("Error fetching movies:", error)
        setErrorMessage("Error fetching movies. Please try again later.")

      } finally{
        setIsLoading(false)
      }
  }

  useEffect( ()=>{
    fetchMovies();
  },[])


  return (
    <main>
      <div className='pattern'/>
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="hero" />
          <h1>Find <span className='text-gradient'>Movies</span>  you'll enjoy </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
        </header>
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
                {movieList.map((movie)=>(
                  <p key={movie.id} className='text-white'>{movie.title}</p>
                ))}
              </ul>   
              )
          }
        </section>
      </div>
    </main>
  )
}

export default App