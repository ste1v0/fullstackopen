import { useState, useEffect } from 'react'
import axios from 'axios'
import './index.css'

const App = () => {

  const [value, setValue] = useState('')
  const [countries, setCountries] = useState([])
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)

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
        setLoading(true)
        axios
          .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${filteredCountries[0]}`)
          .then(response => {
            const countryData = response.data
            setData(countryData)
            setLoading(false)
          })
          .catch(error => {
            setData(null)
            setLoading(false)
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
    
    return (
      <div className="App">
        <h1>Find countries</h1>
        <form>
          <input value={value} onChange={handleInputChange}></input>
        </form>
        {loading && <p>Loading...</p>}
        {filteredCountries.length > 10
          ? `Too many matches, specify another filter`
          : data === null
            ? filteredCountries.map(x => <div key={x}> <li>{x}</li></div>)
            : <div>
                <h2>{data.name.common}</h2>
                <p>capital {data.capital}<br></br>
                area {data.area}</p>
                <p><b>languages:</b></p>
                <ul>
                  {Object.values(data.languages).map(x => <li key={x}>{x}</li>)}
                </ul>
                <img width="250" height="250" alt="country-flag" src={data.flags.svg}></img>
            </div>
        }     
      </div>
    )
  }

export default App
