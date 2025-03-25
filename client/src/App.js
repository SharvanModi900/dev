import React, { useContext, useEffect } from 'react';
import globalContext from './context/global/globalContext';
import AppRoutes from './components/routing/Routes';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';
import Navbar from './components/navigation/Navbar.js'; 

const App = () => {

  return (
    <>
    <Navbar 
        loggedIn={false} // or true based on your app's state
        chipsAmount={1000} // pass dynamic chips later if needed
        location={window.location}
        openModal={(modalFn, title, closeText) => {
          // your modal logic here, or leave it empty for now
          console.log('Open Modal:', title);
        }}
        openNavMenu={() => console.log('Open Hamburger Menu')}
      />
      <AppRoutes />
    </>
  );
};

export default App;
