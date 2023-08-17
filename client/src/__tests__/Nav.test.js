import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Nav from '../components/Nav';
import AuthContext from "../contexts/AuthContext"


function renderComponent() {

    const mockAuthValue = {
        auth: {
            user: {
                username: 'Johnnyboy',
                password: 'P@ssw0rd!',
                role: 'OWNER'
            }
        }
    };
    
    render(
        <AuthContext.Provider value={mockAuthValue}>
            <MemoryRouter>
                <Nav />
            </MemoryRouter>
        </AuthContext.Provider>
    );
}

describe('Nav', () => {
    it('should render six links', () => {
        renderComponent();

        const listItemElements = screen.getAllByRole('link');

        expect(listItemElements).toHaveLength(6);
    });

    it('should render home, find a sitter, become a sitter, about, login, and create account links', () => {
        renderComponent();

        // screen.debug();
        screen.logTestingPlaygroundURL();

        const homeLinkElement = screen.getByRole('link', {
            name: /home/i
        });

        const findSitterLinkElement = screen.getByRole('link', {
            name: /find a sitter/i
        });

        const becomeSitterLinkElement = screen.getByRole('link', {
            name: /become a sitter/i
        });

        const aboutLinkElement = screen.getByRole('link', {
            name: /about/i
        });

        const loginLinkElement = screen.getByRole('link', {
            name: /login/i
        });

        const createAccountLinkElement = screen.getByRole('link', {
            name: /create account/i
        });

        const assertLink = (element, path) => {
            expect(element).toBeInTheDocument();
            expect(element).toHaveAttribute('href', path);
        };

        assertLink(homeLinkElement, '/');
        assertLink(findSitterLinkElement, '/findsitter');
        assertLink(becomeSitterLinkElement, '/create_account');
        assertLink(aboutLinkElement, '/about');
        assertLink(loginLinkElement, '/login');
        assertLink(createAccountLinkElement, '/create_account');
    });
});