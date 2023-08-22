import { Link, useParams } from "react-router-dom"
import AuthContext from "../contexts/AuthContext"
import { useContext } from "react"
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';

 import { Container } from "react-bootstrap";

const Nav = ()=> {
    const auth = useContext(AuthContext)
    const user = auth.user

    const params = useParams();
    const ownerId = params.id;

    return (

        <Navbar expand="lg" data-bs-theme="dark" className="bg-body-tertiary">
            <Container>
                {/* always show */}
                <Navbar.Brand className="brand" href="/">CritterSitters</Navbar.Brand>
                <Link className="nav-btn" to='/'>Home</Link>
                {" "}
                <Link className="nav-btn" to='/findsitter'>Find a Sitter</Link>
                {" "}
                <Link className="nav-btn" to='/about'>About Us</Link>
                {" "}



                {/* only logged in as an owner */}
                { user && (
                    <>
                        <Link className="nav-btn" to='/manageaccount'>Manage Your Account</Link>
                        {" "}
                        <Button variant="info" onClick={auth.logout}>Logout</Button>
                    </>
                )}

                {/* only logged out */}
                { !user && (
                    <>
                        <Link className="nav-btn" to='/login'>Login</Link>
                        {" "}
                        <Link className="nav-btn" to='/create_account'>Create Account</Link>
                    </>
                )}
            </Container>
        </Navbar>
    )
}

export default Nav;