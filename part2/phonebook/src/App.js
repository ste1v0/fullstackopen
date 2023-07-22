import React from 'react';
import { useState, useEffect } from 'react';
import phoneService from './services/phones'

const App = () => {

  // States

  const [newContact, setNewContact] = useState('John Doe')
  const [newPhone, setNewPhone] = useState('+1')
  const [list, setList] = useState([])
  const [newFilter, setNewFilter] = useState('')
  const [filterStatus, setNewFilterStatus] = useState(false)

  useEffect(() => {
    phoneService
      .getAll()
      .then(initialPhones => {
        setList(initialPhones)
      })
  }, [])

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
    event.preventDefault();
    const checkEntry = list.findIndex(item => item.number === newPhone);
    const checkName = list.findIndex(item => item.name.toLowerCase() === newContact.toLowerCase());
  
    if (checkEntry === -1) {
      if (checkName !== -1) {
        if (window.confirm(`${newContact} is already added to the phonebook, replace the old one with a new one?`)) {
          const contactToUpdate = list[checkName]
          const changedContact = { ...contactToUpdate, number: newPhone }
  
          phoneService
            .update(contactToUpdate.id, changedContact)
            .then(returnedPhone => {
              setList(list.map(n => n.id !== contactToUpdate.id ? n : returnedPhone));
            });
        } else {
          alert (`No changes`);
        }
      } else {
        const newEntry = {
          name: newContact,
          number: newPhone
        };
        phoneService
          .create(newEntry)
          .then(createdPhone => {
            setList(list.concat(createdPhone));
          });
        setNewContact('');
        setNewPhone('');
      }
    } else {
      alert(`Sorry, ${newPhone} already exists`);
    }
  };
  

  const handleDeletion = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      phoneService
      .remove(id)
      setList(list.filter(x => x.id !== id))
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
        <Persons filterStatus={filterStatus} filteredArray={filteredArray} list={list} handleDeletion={handleDeletion}></Persons>
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

const Persons = ({ filterStatus, filteredArray, list, handleDeletion }) => {
  return (
    <>
    {filterStatus
      ? filteredArray.map((x, index) => <li key={index}>{x.name} {x.number} <button onClick={() => handleDeletion(x.id, x.name)}>delete</button></li>)
      : list.map((x, index) => <li key={index}>{x.name} {x.number}<button onClick={() => handleDeletion(x.id, x.name)}>delete</button></li>)
    }
  </>
)}

export default App;

