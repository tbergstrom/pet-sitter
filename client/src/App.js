import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google'
import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';
import Nav from './components/Nav';
import Login from './components/Login';
import Home from './components/Home';
import VisitTable from './components/VisitTable';
import VisitForm from './components/VisitForm';
import ManageVisits from './components/ManageVisits';
import ManagePets from './components/ManagePets';
import About from './components/About';

import jwtDecode from 'jwt-decode';
import AuthContext from './contexts/AuthContext';
import CreateAccount from './components/CreateAccount';
import PetDetails from './components/PetDetails';
import ConfirmPetDelete from './components/ConfirmPetDelete';
import ContactInfoDetails from './components/ContactInfoDetails';
import ContactInfoForm from './components/ContactInfoForm';
import ManageAccount from './components/ManageAccount';
import ManageContactInfo from './components/ManageContactInfo';
import SitterDetails from './components/SitterDetails';
import FindSitter from './components/FindSitter';
import VisitDetails from './components/VisitDetails';


import Nav from './components/Nav';
import Login from './components/Login';
import Home from './components/Home';
import VisitTable from './components/VisitTable';
import VisitForm from './components/VisitForm';
import ManageVisits from './components/ManageVisits';
import ManagePets from './components/ManagePets';
import About from './components/About';
import NotAuthenticated from './components/NotAuthenticated';
import LoadingSpinner from './components/LoadingSpinner';

import jwtDecode from 'jwt-decode';
import AuthContext from './contexts/AuthContext';
import CreateAccount from './components/CreateAccount';
import PetDetails from './components/PetDetails';
import ConfirmPetDelete from './components/ConfirmPetDelete';
import ContactInfoDetails from './components/ContactInfoDetails';
import ContactInfoForm from './components/ContactInfoForm';
import ManageAccount from './components/ManageAccount';
import ManageContactInfo from './components/ManageContactInfo';
import SitterDetails from './components/SitterDetails';
import FindSitter from './components/FindSitter';
import VisitDetails from './components/VisitDetails';


function App() {
  
  const [visits, setVisits] = useState([]);
  const [contactInfo, setContactInfo] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);


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

  useEffect(() => {

    const token = localStorage.getItem("auth-token");

    if (token) {
      login(token);
    } else {
      setUser(null);
    }

    setTimeout(()=> {
      setIsLoading(false);
    }, 2000);

  }, []);

  return (
    <GoogleOAuthProvider clientId='321605181263-7tsniamk1f3712hs4p6uc26dvshbv46k.apps.googleusercontent.com'>
      <AuthContext.Provider value={auth}>
        
        <BrowserRouter>
          <Nav />
          
          <Routes>
            {/* always visible */}
            <Route path='/' element={<Home />}/>
            <Route path="/findsitter" element={<FindSitter />}/>
            <Route path="/about" element={<About/>}/>

            {/* logged in as owner and sitter */}

            <Route path="/visittable/:id" element={ isLoading ? <LoadingSpinner /> : user ? <VisitTable visits={visits} /> : <NotAuthenticated /> } />
            <Route path="/visittable/visitdetails/:id" element={ isLoading ? <LoadingSpinner /> : user ? <VisitTable visits={visits} /> : <NotAuthenticated /> } />
            <Route path="/manageaccount" element={isLoading ? <LoadingSpinner /> : user ? <ManageAccount /> : <NotAuthenticated />} />

            <Route path="/managecontactinfo" element={ isLoading ? <LoadingSpinner /> : user ? <ManageContactInfo /> : <NotAuthenticated /> } />
            <Route path="/managepets" element={ isLoading ? <LoadingSpinner /> : user ? <ManagePets /> : <NotAuthenticated /> } />
            <Route path="/managevisits" element={ isLoading ? <LoadingSpinner /> : user ? <ManageVisits /> : <NotAuthenticated /> } />
            <Route path="/users/sitter/:username" element={ isLoading ? <LoadingSpinner /> : user ? <SitterDetails /> : <NotAuthenticated /> } />
            <Route path="/user/my-info" element={ isLoading ? <LoadingSpinner /> : user ? <ContactInfoDetails /> : <NotAuthenticated /> } />
            <Route path='/requestvisit' element={ isLoading ? <LoadingSpinner /> : user ? <ContactInfoForm contactInfo={contactInfo} /> : <NotAuthenticated /> }/>
            <Route path='/visitdetails/:id' element={ isLoading ? <LoadingSpinner /> : user ? <VisitDetails visits={visits} /> : <NotAuthenticated /> } />

            {/* logged in as owner only */}
            <Route path='/requestvisit' element={ isLoading ? <LoadingSpinner /> : user ? <VisitForm /> : <NotAuthenticated /> }/>
            <Route path="/petdetails/:id" element={ isLoading ? <LoadingSpinner /> : user ? <PetDetails /> : <NotAuthenticated /> } />
            <Route path="/confirmpetdelete/:id" element={ isLoading ? <LoadingSpinner /> : user ? <ConfirmPetDelete /> : <NotAuthenticated /> } />


            {/* logged out only */}
            <Route path='/login' element={ user ? <Navigate to="/" /> : <Login /> }/>
            <Route path='/create_account' element={ user ? <Navigate to="/" /> : <CreateAccount /> }/>

            {/* Helps to be last in list */}
            <Route path='*' element={<p>Page Not Found</p>} />
          </Routes>
        </BrowserRouter>
        
      </AuthContext.Provider>
    </GoogleOAuthProvider>
  );
}

export default App;