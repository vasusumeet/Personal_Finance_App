import React from 'react'
import {Routes,Route} from 'react-router-dom'
import LandingPage from './Pages/LandingPage'
import Dashboard from './Pages/Dashboard'
import LoginPage from './Pages/Login'
import Savings from './Pages/Savings'
import Expenses from './Pages/Expenses'
import Salary from './Pages/Salary'
import SignUp from './Pages/SignUp'
import { UserProvider } from './UserContext'


const App = () => {
  return (
    <UserProvider>
    <Routes>
      <Route path='/' element={<LandingPage/>}/>
      <Route path='/LoginPage' element={<LoginPage/>}/>
      <Route path='/SignUp' element={<SignUp/>}/>
      <Route path='/Dashboard' element={<Dashboard/>}/>
      <Route path='/Expenses' element={<Expenses/>}/>
      <Route path='/Salary' element={<Salary/>}/>
      <Route path='/Savings' element={<Savings/>}/>
      
    </Routes>
    </UserProvider>
  )
}

export default App