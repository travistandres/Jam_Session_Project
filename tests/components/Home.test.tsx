import { it, expect, describe, test, beforeEach } from 'vitest';
import {fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router';
import React from 'react';
import Home from '../../src/Home';
import { createProject, deleteProject, getProjects, updateProject } from "../../src/api/endpointMethods/Projects.cjs";
import '@testing-library/jest-dom/vitest';
import { mockComponent } from 'react-dom/test-utils';



describe('home', () => {
    test("Renders Home page with correct elements", () => {
        render(
          <MemoryRouter>
            <Home />
          </MemoryRouter>
        );

        const projectsh1 = screen.getByText("Projects", { selector: "h1" });
        const projectsp = screen.getByText("Projects", { selector: "p" });
    
        expect(screen.getByText("Home")).toBeInTheDocument();
        expect(projectsh1).toBeInTheDocument();
        expect(projectsp).toBeInTheDocument();
        expect(screen.getByText("Sign Out")).toBeInTheDocument();
        
        
      });

      
})

