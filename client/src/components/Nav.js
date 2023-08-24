import { Link } from "react-router-dom"
import AuthContext from "../contexts/AuthContext"
import { useContext } from "react"
import { Navbar, Nav as BootstrapNav, Container, Dropdown } from 'react-bootstrap';

const Nav = ()=> {

    const auth = useContext(AuthContext)
    const user = auth.user


    return (

        <Navbar expand="lg" data-bs-theme="dark" className="bg-body-tertiary">
            <Container>
                {/* always show */}
                <Navbar.Brand className="brand" href="/">CritterSitters</Navbar.Brand>
                <BootstrapNav className="mr-auto">
                    <Link className="nav-btn" to='/'>Home</Link>
                    {" "}
                    <Link className="nav-btn" to='/findsitter'>Find a Sitter</Link>
                    {" "}
                    <Link className="nav-btn" to='/about'>About Us</Link>
                    {" "}

                    {/* only logged in as an owner */}
                    { user && (
                        <>
                            <Dropdown >
                                <Dropdown.Toggle variant="info" className="mr-2">
                                    Welcome, <strong>{user.username}</strong>
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item disabled>
                                        Role: {user.roles[0]}
                                    </Dropdown.Item>
                                    <Dropdown.Item as={Link} to="/manageaccount">
                                        Manage Account
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={auth.logout}>
                                        Logout
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                                
                            </Dropdown>

                            
                            {" "}
                            
                        </>
                    )}

                    {/* only logged out */}
                    { !user && (
                        <>
                            <Link className="nav-btn" to='/create_account'>Create Account</Link>
                            {" "}
                            <Link className="btn btn-info" to='/login'>Login</Link>
                        </>
                    )}
                </BootstrapNav>
            </Container>
        </Navbar>
    )
}

export default Nav;