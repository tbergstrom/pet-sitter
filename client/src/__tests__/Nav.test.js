import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Nav from '../components/Nav';
import AuthContext from "../contexts/AuthContext";
import { GoogleOAuthProvider } from '@react-oauth/google';

function renderComponent() {
    const mockAuthValue = {
        user: {
            username: 'Johnnyboy',
            password: 'P@ssw0rd!',
            role: 'OWNER'
        }
    };
    
    render(
        <GoogleOAuthProvider clientId = '321605181263-7tsniamk1f3712hs4p6uc26dvshbv46k.apps.googleusercontent.com'>
            <AuthContext.Provider value={{ auth: mockAuthValue }}>
                <MemoryRouter>
                    <Nav />
                </MemoryRouter>
            </AuthContext.Provider>
        </GoogleOAuthProvider>
    );
}

describe('Nav', () => {
    it('should render the correct links', () => {
        renderComponent();

        const expectedLinks = [
            { name: /CritterSitters/i, path: '/' },
            { name: /Home/i, path: '/' },
            { name: /Find a Sitter/i, path: '/findsitter' },
            { name: /About Us/i, path: '/about' },
            { name: /Manage Your Account/i, path: '/manageaccount' },
        ];

        expectedLinks.forEach(link => {
            const linkElement = screen.getByRole('link', { name: link.name });
            expect(linkElement).toBeInTheDocument();
            expect(linkElement).toHaveAttribute('href', link.path);
        });

        const logoutButton = screen.getByRole('button', { name: /logout/i });
        expect(logoutButton).toBeInTheDocument();

        expect(screen.queryByRole('link', { name: /login/i })).not.toBeInTheDocument();
        expect(screen.queryByRole('link', { name: /create Account/i })).not.toBeInTheDocument();
    });
});
