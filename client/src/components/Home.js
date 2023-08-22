import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { useContext } from 'react';
import AuthContext from '../contexts/AuthContext';

const Home = () => {
  const auth = useContext(AuthContext)
  const user = auth.user
  const navigate = useNavigate();

// Landing page

return (
  <div className="App">
    <div>
      <Button variant="info" className='find-sitter-btn button' onClick={() => navigate("/findsitter")}>Find A Sitter</Button>
      {user ? (
        <Button variant="info" className='become-sitter-btn button' onClick={auth.logout}>Logout</Button>
      ) : (
        <Button variant="info" className='become-sitter-btn button' onClick={() => navigate("/create_account")}>Sign Up</Button>
      )}
    </div>
  </div>
);
}

export default Home;