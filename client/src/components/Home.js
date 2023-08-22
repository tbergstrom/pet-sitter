import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

const Home = () => {

  const navigate = useNavigate();

// Landing page

    return (
      <div className="App">
      <div>
        <Button variant="info" className='find-sitter-btn button' onClick={()=> navigate("/findsitter")}>Find A Sitter</Button>
        <Button variant="info" className='become-sitter-btn button'onClick={()=> navigate("/create_account")}>Become a Sitter</Button>
      </div>
    </div>
      );
}

export default Home;