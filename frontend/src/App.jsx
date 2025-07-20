import React from 'react'
import { BrowserRouter } from "react-router-dom";
import RouteFolder from './routes/RouteFolder';
import Navbar from './components/maincomponents/Navbar';
import SecondaryNavbar from './components/maincomponents/SecondaryNavbar';
import { ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const App = () => {
  return (
    <BrowserRouter>
    <Navbar />
    <SecondaryNavbar />
    <RouteFolder />
     <ToastContainer position="top-right" autoClose={4000}
      transition={Bounce}/>
  </BrowserRouter>
  
  )
}

export default App