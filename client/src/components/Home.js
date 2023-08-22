import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

import Carousel from 'react-bootstrap/Carousel';
import { Image, Container} from 'react-bootstrap';
import { useContext } from 'react';
import AuthContext from '../contexts/AuthContext';


const Home = () => {
  const auth = useContext(AuthContext)
  const user = auth.user
  const navigate = useNavigate();

    return (
      <div className="App">
        <Container>
          <Carousel>
            <Carousel.Item>
              {/* dog red flowers */}
              <Image className="carousel-img" src="https://images.unsplash.com/photo-1593874105671-d745ff7ce8ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80" fluid/>
            </Carousel.Item>
            <Carousel.Item>
              {/* grumpy cats */}
              <Image className="carousel-img" src="https://images.unsplash.com/photo-1642906376920-cf2dfbd287bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTF8fGNhdHMlMjBvdXRzaWRlfGVufDB8fDB8fHww&auto=format&fit=crop&w=900&q=60" fluid/>
            </Carousel.Item>
            <Carousel.Item>
              {/* chickens*/}
              <Image className="carousel-img" src="https://images.unsplash.com/photo-1620136717591-841a4da27e23?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y2hpY2tlbnN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=900&q=60" fluid/>
            </Carousel.Item>
            <Carousel.Item>
              {/* dogs running */}
              <Image className="carousel-img" src="https://images.unsplash.com/photo-1520580413066-ac45756bdc71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" fluid/>
            </Carousel.Item>
            <Carousel.Item>
              {/* horses */}
              <Image className="carousel-img" src="https://images.unsplash.com/photo-1516704135885-dc4c68a189e3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" fluid/>
            </Carousel.Item>
        </Carousel>
      </Container>
      {/* <div>
        <Button variant="info" className='find-sitter-btn button' onClick={()=> navigate("/findsitter")}>Find A Sitter</Button>
        <Button variant="info" className='become-sitter-btn button'onClick={()=> navigate("/create_account")}>Become a Sitter</Button>
      </div> */}
  </div>
);
}

export default Home;