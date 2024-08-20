import React from 'react'
import Signup from './Signup'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const Home = () => {
  const navigate = useNavigate()
  const handleLogout = () =>{
    axios.get('http://localhost:8000/auth/logout')
    .then(res => {
      if(res.data.status){
        navigate('/login')
      }
      
    }).catch(err => {
      console.log(err)
    })
  }
  return (
    <div>
      <style>
        {`
          .header {
            color: darkblue;
            text-align: center;
            font-size: 30px;
            
            margin: 20px;
          }
        `}
      </style>
      <h1 className="header">~~Welcome~~</h1>

      <button><Link to='/dashboard'>Dashboard</Link></button>
      <br></br>  <br></br>  
      <button onClick={handleLogout}>Logout</button>

    </div>
  )
}

export default Home
