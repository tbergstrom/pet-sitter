import { useNavigate } from 'react-router-dom';

const Home = () => {

  const navigate = useNavigate();

// Landing page

    return (
      <div className="App">
      <div>
        <button className='find-sitter-btn button' onClick={()=> navigate("/findsitter")}>Find A Sitter</button>
        <button className='become-sitter-btn button'onClick={()=> navigate("/create_account")}>Become a Sitter</button>
      </div>
    </div>
      );
}

export default Home;