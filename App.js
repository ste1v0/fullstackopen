import React from 'react';
import { useState } from 'react';

const App = () => {

  // States

  const [newContact, setNewContact] = useState('John Doe')
  const [newPhone, setNewPhone] = useState('+1')
  const [list, setList] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newFilter, setNewFilter] = useState('')
  const [filterStatus, setNewFilterStatus] = useState(false)

  // Handlers

  const handleInputChange = (event) => {
    setNewContact(event.target.value)
    console.log('input value has changed')
  }
  const handlePhoneInputChange = (event) => {
    setNewPhone(event.target.value)
    console.log('input value for phone has changed')
  }
  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
    setNewFilterStatus(true)
    console.log('input value for filter has changed')
  }

  const filteredArray = list.filter(x => x.name.toLowerCase().includes(newFilter.toLowerCase()))

  const handleSubmit = (event) => {
    event.preventDefault()
    const checkIndex = list.findIndex(item => item.name.toLowerCase() === newContact.toLowerCase() || item.number === newPhone)

    if (checkIndex === -1) {
      const newObject = {
        name: newContact,
        number: newPhone
      }
      setList(list.concat(newObject))
      setNewContact('')
      setNewPhone('')
    } else {
      alert(`Sorry, ${newContact} ${newPhone} already exists`)
    }
  }

  return (
    <div>
      <h1>
        Phonebook
      </h1>
      filter shown with
      <Filter newFilter={newFilter} handleFilterChange={handleFilterChange}></Filter>
      <h1>
        add a new
      </h1>
      <PersonForm handleSubmit={handleSubmit} newContact={newContact} handleInputChange={handleInputChange} newPhone={newPhone} handlePhoneInputChange={handlePhoneInputChange}></PersonForm>
      <h1>
        Numbers
      </h1>
      <ul>
        <Persons filterStatus={filterStatus} filteredArray={filteredArray} list={list}></Persons>
      </ul>
    </div>
  );
}

// Components

const Filter = ({ newFilter, handleFilterChange }) => {
  return (
    <input value={newFilter} onChange={handleFilterChange}></input>
  )
}

const PersonForm = ({ handleSubmit, newContact, handleInputChange, newPhone, handlePhoneInputChange }) => {
  return (
    <form onSubmit={handleSubmit}>
        name: <input
        value={newContact}
        onChange={handleInputChange}
        ></input>
        <div>phone: <input
        value={newPhone}
        onChange={handlePhoneInputChange}
        ></input>
        </div>
        <div>
          <button type="submit">
            add
          </button>
        </div>
      </form>
  )
}

const Persons = ({ filterStatus, filteredArray, list }) => {
  return (
    <>
    {filterStatus
      ? filteredArray.map((x, index) => <li key={index}>{x.name} {x.number}</li>)
      : list.map((x, index) => <li key={index}>{x.name} {x.number}</li>)
    }
  </>
)}

export default App;
