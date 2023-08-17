// import { render, screen, fireEvent, waitFor } from "@testing-library/react";
// import { useNavigate } from "react-router-dom";
// import Login from '../components/Login.js';

// // Mocking the useNavigate hook
// jest.mock("react-router-dom", () => ({
//   ...jest.requireActual("react-router-dom"),
//   useNavigate: jest.fn(),
// }));

// describe("Login", () => {
//   it("navigates to '/' upon successful login", async () => {
//     const mockNavigate = jest.fn();
//     useNavigate.mockReturnValue(mockNavigate);

//     render(<Login />);

//     // Mocking a successful login response
//     jest.spyOn(window, "fetch").mockResolvedValueOnce({
//       status: 200,
//     });

//     // Fill out the form and submit
//     fireEvent.change(screen.getByLabelText(/username/i), {
//       target: { value: "testuser" },
//     });
//     fireEvent.change(screen.getByLabelText(/password/i), {
//       target: { value: "testpassword" },
//     });
//     fireEvent.click(screen.getByText(/login/i));

//     await waitFor(() => {
//       expect(mockNavigate).toHaveBeenCalledWith("/");
//     });
//   });

//   it("displays a login failed message upon 403 failure", async () => {
//     render(<Login />);

//     jest.spyOn(window, "fetch").mockResolvedValueOnce({
//       status: 403,
//     });

//     fireEvent.click(screen.getByText(/login/i));

//     await waitFor(() => {
//       expect(screen.getByText(/login failed/i)).toBeInTheDocument();
//     });
//   });

//   it("displays an unknown error message upon non-403 failure", async () => {
//     render(<Login />);

//     jest.spyOn(window, "fetch").mockResolvedValueOnce({
//       status: 404,
//     });

//     fireEvent.click(screen.getByText(/login/i));

//     await waitFor(() => {
//       expect(screen.getByText(/unknown error/i)).toBeInTheDocument();
//     });
//   });
// });


import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import userEvent from '@testing-library/user-event';
import AuthContext from '../contexts/AuthContext';
import Login from '../components/Login';

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

    // screen.debug();

    userEvent.type(screen.getByLabelText(/username/i), 'Johnnyboy');
    userEvent.type(screen.getByLabelText(/password/i), 'P@ssw0rd!');
    userEvent.click(screen.getByRole('button', { name: /login/i }));

    // await screen.debug();

    // await waitFor(() => {
    //   expect(server.requests[0].method).toBe('POST');
    //   expect(server.requests[0].url).toBe('http://localhost:8080/authenticate');
    //   expect(JSON.parse(server.requests[0].requestBody)).toEqual({
    //     username: 'Johnnyboy',
    //     password: 'P@ssw0rd!'
    //   });
    // });

    // screen.debug()
    // expect(screen.getByLabelText(/username/i).value).toBe('Johnnyboy');
    // expect(screen.getByLabelText(/password/i).value).toBe('P@ssw0rd!');

    // expect(loginMock).toHaveBeenCalledWith('Johnnyboy', 'P@ssw0rd!');

    // expect(loginMock).toBeCalledTimes(1);

  });
});
