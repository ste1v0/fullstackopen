import { useState, useEffect } from 'react'
import Note from './components/note'
import axios from 'axios'

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)

  useEffect(() => {
    axios
      .get('http://localhost:3001/notes')
      .then(response => {
        console.log('promise fulfilled')
        setNotes(response.data)
      })
  }, [])

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important)

  const toggleImportanceOf = (id) => {
    const url = `http://localhost:3001/notes/${id}`
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    axios
      .put(url, changedNote)
      .then(response => {
        setNotes(notes.map(n => n.id !== id ? n : response.data))
      })
  }

  const addNote = (event) => {
    console.log('submit button has been triggered')
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5
    }
    axios
      .post('http://localhost:3001/notes', noteObject)
      .then(response => {
        console.log(response)
        setNotes(notes.concat(response.data))
        setNewNote('')
      })

  }

  const handleNoteChange = (event) => { 
    console.log('i can see the content has changed')
    setNewNote(event.target.value)
  }

  return (
    <div>
      <h1>Notes</h1>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
          </button>
      </div>
      <ul>
        {notesToShow.map(note => 
          <Note 
            key={note.id} 
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}>
          </Note>
        )}
      </ul>
      <form onSubmit={addNote}>
        <input 
          value={newNote}
          onChange={handleNoteChange}
        />
        <button type="submit">save</button>
      </form>  
    </div>
  )
}

export default App 