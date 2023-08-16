
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Nav from './components/Nav';
import Login from './components/OwnerLogin';
import Home from './components/Home';
import VisitTable from './components/VisitTable';
import VisitForm from './components/VisitForm';
import SitterTable from './components/SitterTable';
import ManageOwnerVisits from './components/ManageOwnerVisits';
import ManagePets from './components/ManagePets';

import jwtDecode from 'jwt-decode';
import AuthContext from './contexts/AuthContext';
import CreateAccount from './components/CreateOwnerAccount';


function App() {
  
  const [sitters, setSitters] = useState([]);
  const [visits, setVisits] = useState([]);
  const [user, setUser] = useState(null);

  const login = (token) => {
    // Decode the token
    const { sub: username, authorities: authoritiesString } = jwtDecode(token);
  
    // Split the authorities string into an array of roles
    const roles = authoritiesString.split(',');
  
    // Create the "user" object
    const user = {
      username,
      roles,
      token,
      hasRole(role) {
        return this.roles.includes(role);
      }
    };
    localStorage.setItem("auth-token", token)
    setUser(user);
    return user;
  };  

  const logout = () => {
    setUser(null)
    localStorage.removeItem("auth-token")
  }

  const auth = {
    login,
    logout,
    user: user ? { ...user } : null
  }

  const loadVisits = () => {
    fetch("http://localhost:8080/api/visit")
    .then(response => response.json())
    .then(payload => setVisits(payload))
  }

  useEffect(loadVisits, [])

  const loadSitters = () => {
    fetch("http://localhost:8080/api/sitter")
    .then(response => response.json())
    .then(payload => setSitters(payload))
  }

  useEffect(loadSitters, [])

  useEffect(() => {
    const token = localStorage.getItem("auth-token")
    if (token) {
      login(token)
    }
  }, []);

  return (

    <AuthContext.Provider value={auth}>
      <BrowserRouter>
        <Nav />

        <Routes>
          {/* always visible */}
          <Route path='/' element={<Home />}/>
          <Route path="/findsitter" element={<SitterTable sitters={sitters} loadSitters={loadSitters}/>}/>
          <Route path='*' element={<p>Page Not Found</p>} />

          {/* logged in as owner and sitter */}
          <Route path="/visittable/:id" element={ user ? <VisitTable visits={visits} loadVisits={loadVisits} /> : <Navigate to="/" /> } />
          <Route path="/visittable/visitdetails/:id" element={ user ? <VisitTable visits={visits} loadVisits={loadVisits} /> : <Navigate to="/" /> } />
          <Route path="/managepets" element={ user ? <ManagePets /> : <Navigate to="/" />} />
          <Route path="/manageownervisits" element={ user ? <ManageOwnerVisits /> : <Navigate to="/" />} />

          {/* logged in as owner only */}
          <Route path='/requestvisit' element={ user ? <VisitForm loadVisits={loadVisits}/> : <Navigate to="/" /> }/>

          {/* logged out only */}
          <Route path='/login' element={ user ? <Navigate to="/" /> : <Login /> }/>
          <Route path='/create_account' element={ user ? <Navigate to="/" /> : <CreateAccount /> }/>
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;