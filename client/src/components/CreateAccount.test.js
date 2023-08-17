import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import CreateAccount from './CreateAccount';
import userEvent from '@testing-library/user-event';

const server = setupServer(
  rest.post('http://localhost:8080/create_account', (req, res, ctx) => {
    return res(
      ctx.status(201)
    );
  })
);

// Before all tests make sure server is listening for tests
beforeAll(() => server.listen());

// Sets server back to its original state
afterEach(() => server.restoreHandlers());

// Stop the server after all tests have run
afterAll(() => server.close());

describe('CreateAccount', () => {
  it('should submit create account form successfully', async () => {
    render(
      <MemoryRouter>
        <CreateAccount />
      </MemoryRouter>
    );

    userEvent.type(screen.getByLabelText(/username/i), 'Bobert');
    userEvent.type(screen.getByLabelText(/password/i), 'P@ssw0rd!');
    userEvent.selectOptions(screen.getByLabelText(/role/i), 'OWNER');
    userEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
        expect()
    });
  });
});
