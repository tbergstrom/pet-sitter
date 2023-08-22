import { Link } from "react-router-dom"
import AuthContext from "../contexts/AuthContext"
import { useContext } from "react"

const Nav = ()=> {

    const auth = useContext(AuthContext)
    const user = auth.user


    return (
        <nav>
            {/* always show */}
            <Link className="nav-btn" to='/'>Home</Link>
            {" "}
            <Link className="nav-btn" to='/findsitter'>Find a Sitter</Link>
            {" "}
            <Link className="nav-btn" to='/create_account'>Become a Sitter</Link>
            {" "}
            <Link className="nav-btn" to='/about'>About Us</Link>
            {" "}

            {/* only logged in as an owner */}
            { user && (
                <>
                    <Link className="nav-btn" to='/manageaccount'>Manage Your Account</Link>
                    {" "}
                    <button onClick={auth.logout}>Logout</button>
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
        </nav>
    )
}

export default Nav;