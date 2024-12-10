import { it, expect, describe, test, vi } from 'vitest';
import {render, screen } from '@testing-library/react';
import Login from '../../src/Login';
import '@testing-library/jest-dom/vitest';
import { MemoryRouter } from 'react-router';
import React from 'react';
import { login } from '../../src/api/endpointMethods/Users.cjs';


describe('login', () => {
    test("renders Login page with correct elements", () => {
        render(
          <MemoryRouter>
            <Login />
          </MemoryRouter>
        );
    
        expect(screen.getByText("Jam Session")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Email or Username")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
        expect(screen.getByText("Login")).toBeInTheDocument();
        expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
      });

})