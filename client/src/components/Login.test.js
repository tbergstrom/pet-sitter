import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import AuthContext from '../contexts/AuthContext';
import Login from './Login';
import userEvent from '@testing-library/user-event';

const server = setupServer(
  rest.post('http://localhost:8080/authenticate', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ jwt_token: 'mockToken' })
    );
  })
);

// Before all tests make sure server is listening for tests
beforeAll(() => server.listen());

// Sets server back to its original state
afterEach(() => server.restoreHandlers());

// Stop the server after all tests have run
afterAll(() => server.close());

describe('Login', () => {
  it('should submit login form successfully', async () => {
    const loginMock = jest.fn();
    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ login: loginMock }}>
          <Login />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    userEvent.type(screen.getByLabelText(/username/i), 'Johnnyboy');
    userEvent.type(screen.getByLabelText(/password/i), 'P@ssw0rd!');
    userEvent.click(screen.getByRole('button', { name: /login/i }));
  });
});
