import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';

import Home from './pages/Home';
import People from './pages/People';
import Tree from './pages/Tree';
import Profile from './pages/MyProfile.jsx';


import './App.css';

function App() {
  return (
    <Router>
      <div className="app-layout">
        {/* Глобальний Header з навігацією */}
        <header className="main-header">
          <div className="logo">
            <NavLink to="/">Family Tree</NavLink>
          </div>
          <nav className="main-nav">
            <ul>
              <li>
                <NavLink to="/" className={({ isActive }) => isActive ? "active-link" : ""}>
                  Головна
                </NavLink>
              </li>
              <li>
                <NavLink to="/people" className={({ isActive }) => isActive ? "active-link" : ""}>
                  Родичі
                </NavLink>
              </li>
              <li>
                <NavLink to="/tree" className={({ isActive }) => isActive ? "active-link" : ""}>
                  Дерево
                </NavLink>
              </li>
              <li>
                <NavLink to="/profile" className={({ isActive }) => isActive ? "active-link" : ""}>
                  Моя сторінка
                </NavLink>
              </li>
            </ul>
          </nav>
        </header>

        {/* Основний контейнер для контенту сторінок */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/people" element={<People />} />
            <Route path="/tree" element={<Tree />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;