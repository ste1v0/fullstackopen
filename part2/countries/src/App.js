import { useState, useEffect } from 'react'
import axios from 'axios'
import './index.css'

const App = () => {

  const [value, setValue] = useState('')
  const [countries, setCountries] = useState([])
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)

  useEffect(() => {
    console.log('getting countries list')
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then(response => {
        const countriesArray = response.data.map(x => x.name.common)
        setCountries(countriesArray)
        console.log(countriesArray)
      })
      .catch(error => {
        console.log(`Error: ${error}`)
      })
  }, [])

  useEffect(() => {
    console.log(`effect is triggered, country value is ${value}`)
    if (value) {
      const filteredCountries = countries.filter(x => x.toLowerCase().includes(value.toLowerCase()))
      if (filteredCountries.length === 1) {
        setLoading(true)
        axios
          .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${filteredCountries[0]}`)
          .then(response => {
            const countryData = response.data
            setData(countryData)
            console.log(countryData)
            setLoading(false)
          })
          .catch(error => {
            setLoading(false)
            setData(null)
            console.log(`Country not found`)
          })
      } else {
        setData(null)
      }
      
    }
  }, [value, countries])

    const handleInputChange = (event) => {
      console.log(`value has changed`)
      setValue(event.target.value)
    }

    const filteredCountries = countries.filter(x => x.toLowerCase().includes(value.toLowerCase()))
    
    return (
      <div className="App">
        <h1>Find countries</h1>
        <form>
          <input value={value} onChange={handleInputChange}></input>
        </form>
        {loading && <p>Loading...</p>}
        {filteredCountries.length > 10
          ? `Too many matches, specify another filter`
          : filteredCountries.map(x => <div key={x}> <li>{x}</li></div>)
        }     
        {data !== null && (
          <div>
              <h2>{data.name.common}</h2>
              <p>capital {data.capital}<br></br>
              area {data.area}</p>
              <p><b>languages:</b></p>
              <ul>
                {Object.values(data.languages).map(x => <li key={x}>{x}</li>)}
              </ul>
              <img width="250" height="250" alt="country-flag" src={data.flags.svg}></img>
          </div>
          )}
      </div>
    )
  }

export default App
