import Header from "./components/header/Header";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from 'react';
import RequestAnItem from "./pages/RequestAnItem/RequestAnItem";
import RestockARequest from "./pages/RestockARequest/RestockARequest";
import Login from "./pages/Login/Login";
import Barcodes from "./pages/Barcodes/Barcodes";
import PalletTracker from "./pages/PalletTracker/PalletTracker";
import Home from "./pages/Home/Home";
import Update from "./components/Update";
import ManageInventory from "./pages/ManageInventory/ManageInventory";
import { AnimatePresence } from "framer-motion";

function App() {
  const [ loggedIn, setLoggedIn ] = useState(false);
  const [ showUpdates, setShowUpdates ] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const userInfo = localStorage.getItem('_vishi:@user_info') && JSON.parse(localStorage.getItem('_vishi:@user_info'));
    if(userInfo){
      setLoggedIn(true);
      if(location.pathname === '/login' || location.pathname === '/register'){
        window.location.href = '/';
      }else{
        const version = userInfo.version;
        if(!version || version !== process.env.REACT_APP_VERSION){
          setShowUpdates(true);
        }
      }
    }else{
      setLoggedIn(false);
      if(location.pathname !== '/login' && location.pathname !== '/register'){
        window.location.href='/login';
      }
    }
  }, [])

  return (
    <div>
      <div style={{
        backgroundColor: '#1a202c',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1
      }}></div>
      {location.pathname !== '/login' && location.pathname !== '/register' && <Header />}
      {showUpdates && location.pathname !== '/login' && location.pathname !== '/register' && <Update />}
      <AnimatePresence exitBeforeEnter>
        <Routes key={location.pathname} >
          <Route path="/login" element={<Login /> } />
          <Route path='/' element={<Home />} />
          <Route path='/inventory/restocks/create' element={<RequestAnItem /> } />
          <Route path='/inventory/restocks/view' element={<RestockARequest /> } />
          <Route path='/inventory/barcodes' element={<Barcodes /> } />
          <Route path='/inventory/pallets' element={<PalletTracker /> } />
          <Route path='/inventory/manage' element={<ManageInventory /> } />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
