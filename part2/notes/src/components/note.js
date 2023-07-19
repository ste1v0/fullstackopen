const Note = ({ note }) => {
    console.log('Successfully accessed note.js')
    return (
      <li>{note.content}</li>
    )
  }

export default Note