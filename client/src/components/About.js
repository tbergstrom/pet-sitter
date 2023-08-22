import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import { Card } from 'react-bootstrap';

const img1 = "https://images.unsplash.com/photo-1569285105724-89e18c990b7c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"

const About = () => {
return ( 
    <div id="about" className="block about-block">
        <Container fluid>
            <div className='title-holder'>
                <h2 className="px-4 my-5">About Us</h2>
                <div className='subtitle'>A Team of Pet Lovers</div>
            </div>
            <Row className="px-4 my-5">
                <Card style={{ width: '18rem' }}>
                    <Card.Img variant="top" src="https://images.unsplash.com/photo-1624371066606-4863e333ad84?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1035&q=80"/>
                    <Card.Body>
                        <Card.Title>Tyler Bergrstrom</Card.Title>
                        <Card.Text>
                        Some quick example text to build on the card title and make up the
                        bulk of the card's content.
                        </Card.Text>
                    </Card.Body>
                </Card>
                <Card style={{ width: '18rem' }}>
                    <Card.Img variant="top" src="https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80"/>
                    <Card.Body>
                        <Card.Title>Chandler Carne</Card.Title>
                        <Card.Text>
                        Some quick example text to build on the card title and make up the
                        bulk of the card's content.
                        </Card.Text>
                    </Card.Body>
                </Card>
                <Card style={{ width: '18rem' }}>
                    <Card.Img variant="top" src="https://images.unsplash.com/photo-1503324164927-dfb122c2041c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80" />
                    <Card.Body>
                        <Card.Title>Shannon Wilson</Card.Title>
                        <Card.Text>
                        Some quick example text to build on the card title and make up the
                        bulk of the card's content.
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Row>
            <Row className="px-4 my-5">
                <Col sm={6} >
                    <Image id="team-img" src={img1} rounded />
                </Col>
                <Col sm={6}>
                    <p>
                        We love our pets, and when we're away we want them to be in good hands with people who love them as much as we do. <br/> <br/>

                        We designed CritterSitters as a space for pet owners and pet sitters to connect, communicate, and arrange the best care for our furry friends. <br/> <br/>

                        This web application features a frontend run on React Js, a backend server written in Java, and utilizes an underlying data layer contained in MySqlWorkbench.


                    </p>
                </Col>
            </Row>
        </Container>
    </div>
);
}

export default About;