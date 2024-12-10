import { it, expect, describe, test } from 'vitest';
import {render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { MemoryRouter } from 'react-router';
import React from 'react';
import Verify from '../../src/Verify';


describe('verify', () => {
    test("renders Verify page with correct elements", () => {
        render(
          <MemoryRouter>
            <Verify />
          </MemoryRouter>
        );
    
        expect(screen.getByText("Jam Session")).toBeInTheDocument();
        expect(screen.getByText("Verify your email")).toBeInTheDocument();
        expect(screen.getByText("Your email is not verified. Check your inbox to verify your email.")).toBeInTheDocument();
        expect(screen.getByText("We don't really send you an email lol. We just have this page to be formal.")).toBeInTheDocument();
        expect(screen.getByText("Login")).toBeInTheDocument();

        
      });
})