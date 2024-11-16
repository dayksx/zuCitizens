import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Header from "./Layers/Header";
import Community from "./Layers/Sections/Community";
import Registration from "./Layers/Sections/Registration";
import Citizen from "./Layers/Sections/Citizen";
import Census from "./Layers/Sections/Census";

function App() {
  return (
    <Router>
        <Header />
            <Routes>
              <Route path="/" element={<Community />} />
              <Route path="/community" element={<Community />} />
              <Route path="/registration" element={<Registration />} />
              <Route path="/citizens" element={<Census />} />
              <Route path="/citizen/:id" element={<Citizen />} />
            </Routes>
    </Router>
  );
}

export default App;
