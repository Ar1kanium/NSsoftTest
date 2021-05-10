import React from 'react';


export default function DataRow (props) {

  const [noteState, setNoteState] = React.useState(props.data['data'] ? props.data : {...props.data, 'data': ''})
  const initialBtnState = {editing: false, btnText: 'Редактировать'}
  const editBtnState = {editing: true, btnText: 'Сохранить'}
  const [rowState, setRowState] = React.useState(initialBtnState)
  const toggleRowState = () => rowState.editing ? setRowState(initialBtnState) : setRowState(editBtnState)
  const onChangeHandler = (e) => {
    if (rowState.editing) {
      if (props.headers) {
        const targName = e.target.name.split(' ')[0]
        const val = e.target.value
        setNoteState(() => {
        let copy = {...noteState}
        copy['data'][targName] = val
        return copy
        })
      }
      else {
        const val = e.target.value
        setNoteState(() => {
          let copy = {...noteState}
          copy['data'] = val
          return copy
        })
      }
    }
  }

  async function deleteData () {
    let response = await fetch(`http://178.128.196.163:3000/api/records/${noteState['_id']}`, {
      method: 'DELETE',
    });
    if (response.ok) setNoteState(() => false)
    else alert("Произошла ошибка")
  }

  const onClickHandlerPost = () => {
    async function postChanges() {
      let changedItem = props.headers ? {'data' : {...noteState.data}} : {'data' : noteState['data']}
      let response = await fetch(`http://178.128.196.163:3000/api/records/${noteState['_id']}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(changedItem)
      });
      if (response.ok) toggleRowState()
      else alert("Произошла ошибка")
    }

    if (rowState.editing) {
      postChanges()
    }
    else {
      toggleRowState()
    }
  }

  if (!noteState) return <></>



  return props.headers ? (
    <tr>
      <td>{props.number}</td>
      {props.headers.map((head, ind) => {
      return (<td key={ind}>
          <input onChange={onChangeHandler} name={head + ' ' + noteState['_id']} value={(noteState['data'] && noteState['data'][head]) ? noteState['data'][head] : ''}/>
          </td>)
      }
      )}
      <td>
        <button onClick={deleteData}>Удалить</button>
        <button onClick={onClickHandlerPost}>{rowState.btnText}</button>
      </td>
    </tr>
  )
  : (
  <tr>
    <td>{props.number}</td>
    <td>
      <input onChange={onChangeHandler} name={noteState['_id']} value={noteState['data']}/>
    </td>
    <td>
      <button onClick={deleteData}>Удалить</button>
      <button onClick={onClickHandlerPost}>{rowState.btnText}</button>
    </td>
  </tr>
  )
}