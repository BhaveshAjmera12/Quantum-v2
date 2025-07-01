import React from 'react'
import { BrowserRouter } from "react-router-dom";
import RouteFolder from './routes/RouteFolder';
import Navbar from './components/maincomponents/Navbar';
import SecondaryNavbar from './components/maincomponents/SecondaryNavbar';

const App = () => {
  return (
    <BrowserRouter>
    <Navbar />
    <SecondaryNavbar />
    <RouteFolder />
  </BrowserRouter>
  )
}

export default App