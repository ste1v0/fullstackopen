const Note = ({ note, toggleImportance }) => {
    console.log('Successfully accessed note.js')
    const label = note.important
      ? 'make not important'
      : 'make important'

    const text = note.important
      ? 'important'
      : 'not important'

    return (
      <li>{note.content} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;status: {text}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <button onClick={toggleImportance}>{label}</button>
      
      </li>
    )
  }

export default Note