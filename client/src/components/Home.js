import { Navigate } from 'react-router-dom';

const Home = () => {
    return (
      <div className="App">
      <div>
        <button className='find-sitter-btn button' onClick={<Navigate to="/findsitter" />}>Find A Sitter</button>
        <button className='become-sitter-btn button'onClick={<Navigate to="/create_account" />}>Become a Sitter</button>
      </div>
    </div>
      );
}

export default Home;