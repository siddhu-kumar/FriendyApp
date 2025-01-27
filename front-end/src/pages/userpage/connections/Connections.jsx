import React, { useState, useEffect } from 'react'
import style from './connections.module.css'
import { deleteFriend, getConnections } from '../../../services/friends-service'
import { useNavigate } from 'react-router-dom'
const Connections = () => {
  const navigate = useNavigate()
  const [connections, setConnections] = useState([])
  const [deleted, setDeleted] = useState(false)

  useEffect(() => {
    getConnections()
      .then((data) => {
        setConnections(data)
        console.log(data)
      }).catch((err) => {
        console.log(err)
    })
  }, [])

  const handleClick = (e, id) => {
    e.preventDefault();
    if (e.target.value === 'edit') {
      console.log('edit', id)
      navigate(`/friend/edit`,{state:{_id:id}})
    } else if (e.target.value === 'delete') {
      deleteFriend(id).then((data)=> {
        setDeleted(data)

      })
    }
  }


  return (
    <div className={style.connections}>
      <div className={style.entriesHead}>
        <div className={`${style.connectionInfo} ${style.nums}`}>n.</div>
        <div className={style.connectionHead}>
          <div className={style.connectionInfo}>Name</div>
          <div className={style.connectionInfo}>contact</div>
          <div className={style.connectionInfo}>Address</div>
        </div>
        <span>{
          deleted ?`User deleted  ${1234567890123456}`:
          <button onClick={()=>navigate('/register-friend')}>Create connections</button>
        }</span>
      </div>

      {
         connections.map((data, index) =>
          <div key={index} className={style.entriesData}>
            <div className={`${style.connectionInfo} ${style.nums}`}>{index + 1}</div>
            <div className={style.connectionData}>
              <div className={style.connectionInfo}>{data.name}</div>
              <div className={style.connectionInfo}>{data.contact}</div>
              <div className={`${style.connectionInfo} ${style.address}`}>
                { data.address ?<span> 
                  <div className={style.connectionInfo}>{data.address.street}</div>
                <div className={style.connectionInfo}>{data.address.area}</div>
                <div className={style.connectionInfo}>{data.address.city}</div></span>
                : ''
              }
              </div>
            </div>
            <span>
              <button className={`${style.connectionInfo} ${style.connectionBtn}`} onClick={(e) => handleClick(e, data._id)} value={'edit'}>Edit</button>
              <button className={`${style.connectionInfo} ${style.connectionBtn}`} onClick={(e) => handleClick(e, data._id)} value={'delete'}>Delete </button>
            </span>
          </div>
        )
      }
    </div>
  )
}

export default Connections