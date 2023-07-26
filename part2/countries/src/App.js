import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {

  const [value, setValue] = useState('')
  const [countries, setCountries] = useState([])

  useEffect(() => {
    console.log('getting countries list')

    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then(response => {
        const countriesArray = response.data.map(x => x.name.common)
        setCountries(countriesArray)
        console.log(countriesArray)
      })
  }, [])

  useEffect(() => {
    console.log(`effect is triggered, country value is ${value}`)

    if (value) {
      axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${value}`)
      .then(response => {
        return response.data.name.common
      })
      .catch(error => {
        console.log(`Country not found`)
      })
    }
  }, [value])

    const handleInputChange = (event) => {
      console.log(`value has changed`)
      setValue(event.target.value)
    }

    const filteredCountries = countries.filter(x => x.includes(value))

    return (
      <div className="App">
        find countries
        <form>
          <input value={value} onChange={handleInputChange}></input>
        </form>
        <p>
          {filteredCountries.length > 10
            ? `Too many matches, specify another filter`
            : filteredCountries.map((x) => <div>{x}</div>)
          }
        </p>
      </div>
    )
  }

export default App
