import { useState, useEffect } from 'react'
import axios from 'axios'
import './index.css'

const weatherAPI = process.env.REACT_APP_WEATHER_API
const picURL = `https://openweathermap.org/img/wn`

const App = () => {

  const [value, setValue] = useState('')
  const [countries, setCountries] = useState([])
  const [data, setData] = useState(null)
  const [weatherData, setWeatherData] = useState(null)
  const [picture, setPicture] = useState(null)

  // Fetching countries list

  useEffect(() => {
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then(response => {
        const countriesArray = response.data.map(x => x.name.common)
        setCountries(countriesArray)
      })
      .catch(error => {
        console.log(`Error: ${error}`)
      })
  }, [])

  const filteredCountries = countries.filter(x => x.toLowerCase().includes(value.toLowerCase()))

  useEffect(() => {
    // if 'value' has changed, find similar countries
    if (value) {
        // if there is only one match, fetch additional details
      if (filteredCountries.length === 1) {
        axios
          .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${filteredCountries[0]}`)
          .then(response => {
            const countryData = response.data
            setData(countryData)
          })
          .catch(error => {
            setData(null)
          })
          axios
            .get(`https://api.openweathermap.org/data/2.5/weather?q=${filteredCountries[0]}&appid=${weatherAPI}`)
            .then(response => {
              const weather = response.data
              setWeatherData(weather)
              setPicture(weather.weather[0].icon)
              console.log(picture)
            })
            .catch(error => {
              setWeatherData(null)
            })
      } else {
        // More than 1 match? Leave blank
        setData(null)
      }
    }
  }, [value, countries])

    const handleInputChange = (event) => {
      setValue(event.target.value)
    }

    const handleButtonClick = (country) => {
      setValue(country)
    }
    
    return (
      <div className="App">
        <h1>Find countries</h1>
        <form>
          <input value={value} onChange={handleInputChange}></input>
        </form>
        {filteredCountries.length > 10
          ? `Too many matches, specify another filter`
          : data !== null && weatherData !== null && picture !== null
            ? <div>
            <h2>{data.name.common}</h2>
            <p>capital {data.capital}<br></br>
            area {data.area}</p>
            <p><b>languages:</b></p>
            <ul>
              {Object.values(data.languages).map(x => <li key={x}>{x}</li>)}
            </ul>
            <h2>Weather in {data.name.common}</h2>
            <p>temperature {Math.round(weatherData.main.temp - 273.15)} celsius</p>
            <img alt='weather' src={`${picURL}/${picture}@2x.png`}></img>
            <p>wind {weatherData.wind.speed} m/s</p>
            <img width="250" height="250" alt="country-flag" src={data.flags.svg}></img>
        </div> 
            : filteredCountries.map(x => <div key={x}> <li>{x} <button onClick={() => handleButtonClick(x)}>show</button></li> </div>)
        }     
      </div>
    )
  }

export default App
