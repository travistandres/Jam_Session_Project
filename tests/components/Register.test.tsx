import { it, expect, describe, test } from 'vitest';
import {render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { MemoryRouter } from 'react-router';
import React from 'react';
import Register from '../../src/Register';


describe('register', () => {
    test("renders Register page with correct elements", () => {
        render(
          <MemoryRouter>
            <Register />
          </MemoryRouter>
        );
    
        expect(screen.getByText("Jam Session")).toBeInTheDocument();
        
        expect(screen.getByText("Create an account")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
        expect(screen.getByText("Password must have:")).toBeInTheDocument();
        expect(screen.getByText("At least 8 characters")).toBeInTheDocument();
        expect(screen.getByText("At least 1 number")).toBeInTheDocument();
        expect(screen.getByText("Register")).toBeInTheDocument();
        expect(screen.getByText("Already have an account?")).toBeInTheDocument();
      });
})