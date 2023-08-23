import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import { Card, Button } from 'react-bootstrap';
import { Link } from "react-router-dom"

const img1 = "https://images.unsplash.com/photo-1569285105724-89e18c990b7c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"

const About = () => {
return ( 
    <div id="about" className="block about-block">
        <Container fluid>
            <div className='title-holder'>
                <h1 className="px-4 my-5">About Us</h1>
                <h3 className='subtitle'>A Team of Pet Lovers</h3>
            </div>
            <Row className="px-4 my-5 card-row">
                <Card className="text-center about-card" style={{ width: '18rem' }}>
                    <Card.Img className="card-img" variant="top" src="https://images.unsplash.com/photo-1624371066606-4863e333ad84?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1035&q=80"/>
                    <Card.Body>
                        <Card.Title>Tyler Bergstrom</Card.Title>
                        <Card.Text>
                        Some quick example text to build on the card title and make up the
                        bulk of the card's content.
                        </Card.Text>
                    </Card.Body>
                </Card>
                <Card className="text-center about-card" style={{ width: '18rem' }}>
                    <Card.Img className="card-img" variant="top" src="https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80"/>
                    <Card.Body>
                        <Card.Title>Chandler Carne</Card.Title>
                        <Card.Text>
                        Some quick example text to build on the card title and make up the
                        bulk of the card's content.
                        </Card.Text>
                    </Card.Body>
                </Card>
                <Card className="text-center about-card" style={{ width: '18rem' }}>
                    <Card.Img className="card-img" variant="top" src="https://images.unsplash.com/photo-1503324164927-dfb122c2041c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80" />
                    <Card.Body>
                        <Card.Title>Shannon Wilson</Card.Title>
                        <Card.Text>
                        University of Wyoming <br/>
                        Has one cat and a very fluffy, very silly collie. Without a little help from pet sitters, there would be no sanity left
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Row>
            <Row className="px-4 my-5">
                <Col sm={6}  >
                    <Image id="team-img" src={img1} rounded />
                </Col>
                <Col sm={6}>
                    <p>
                        We love our pets, and when we're away we want them to be in good hands with people who love them as much as we do. <br/> <br/>

                        We designed CritterSitters as a space for pet owners and pet sitters to connect, communicate, and arrange the best care for our furry friends. 
                    </p>
                    <div className="about-cta my-5">
                        <h3>Login or create an account today!</h3>
                    </div>
                    <div className="about-cta-links my-5">
                        <Link className="btn btn-info btn-about-login" to='/login'>Login</Link>
                        {"  "}
                        <Link className="btn btn-info" to='/create_account'>Create Account</Link>
                    </div>
                    
                </Col>
            </Row>
        </Container>
    </div>
);
}

export default About;