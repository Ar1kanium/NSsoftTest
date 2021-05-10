import React from 'react';
import DataRow from './DataRow'


export default function DataTable () {

const [data, setData] = React.useState([])
const [headers, setHeaders] = React.useState([])
const [loaded, setLoad] = React.useState(0)
const [newItem, setNewItem] = React.useState(0)
const [newValue, setNewValue] = React.useState('')

async function getItems() {
  let response = await fetch('http://178.128.196.163:3000/api/records')
  if (response.ok) {
    let cameData = await response.json()
    setData(cameData)
    setLoad(1)
  }
  else alert('Ошибка')
}

React.useEffect(() => {
  getItems()
}, [])

React.useEffect(() => {
  setHeaders(() => {
    let arr = []
    for (let i = 0; i<data.length; i++) {
      if (typeof data[i]['data'] === 'object' && data[i]['data'] !== null) {
        let keys = Object.keys(data[i]['data'])
        for (let key of keys) {
          if (arr.indexOf(key) === -1) arr.push(key)
        }
      }
    }
    return arr
  })
  setNewItem(() => {
    let newItem = {}
    headers.forEach(element => {
      newItem.element = ''
    });
    return newItem
  })
}, [loaded])

async function sendNewItem (props) {
  let item = {data: props}
  let response = await fetch(`http://178.128.196.163:3000/api/records`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body : JSON.stringify(item),
  })
  if (response.ok) {
    setLoad(0)
    getItems()
  }
}

const onChangeHandler = (e) => {
  if (e.target.name === 'val') {
    const val = e.target.value
    setNewValue(() => val)
    return
  }
    const targName = e.target.name.split(' ')[0]
    const val = e.target.value
    setNewItem(() => {
     let copy = {...newItem}
     copy[targName] = val
     return copy
    })
  }
  
  return loaded ?(
  <>
    <div>
      <h2>Объекты</h2>
      <table border='1'>
        <thead>
          <tr>
            <th>№</th>
            {headers.map((el, ind) => <th key={ind}>{el}</th>)}
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {data.filter((el) => typeof el['data'] === 'object' && el['data'] !== null).map((el, ind) => {
            return (<DataRow key = {el['_id']} data={el} headers={headers} number={ind+1} />)
          })}
        <tr>
          <td></td>
            {headers.map((el, ind) => <td key={ind}><input name={`${el} new`} onChange={onChangeHandler}></input></td>)}
          <td><button onClick={() => sendNewItem(newItem)}>Добавить новую запись</button></td>
        </tr>
        </tbody>
      </table>
    </div>
    <div>
      <h2>Значения</h2>
      <table border='1'>
        <thead>
          <tr>
            <th>№</th>
            <th>Значения</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {data.filter((el) => typeof el['data'] !== 'object').map((el, ind) =>{
            return (<DataRow key = {el['_id']} data={el} headers={false} number={ind+1} />)
          })}
          <tr>
            <td></td>
            <td><input name='val' onChange={onChangeHandler}></input></td>
            <td><button onClick={() => sendNewItem(newValue)}>Добавить новую запись</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </>
  )
  :(<>Загружаем данные</>)
}