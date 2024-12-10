import { it, expect, describe, test, vi } from 'vitest';
import {render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { MemoryRouter } from 'react-router';
import React from 'react';
import Notes from '../../src/Notes';
import { createTextFile, getTextFiles, updateTextFile } from '../../src/api/endpointMethods/TextFiles.cjs';
import { updateAudioFile } from '../../src/api/endpointMethods/AudioFiles.cjs';


describe('notes', () => {

    //Test for rendering UI elements
    test("Renders Notes page with correct elements", () => {
        //Rendering Notes page 
        render(
          <MemoryRouter>
            <Notes selectedProject={undefined} projects={undefined} />
          </MemoryRouter>
        );
        //Verifying Lyrics/Notes is visible on page
        expect(screen.getByText("Lyrics/Notes")).toBeInTheDocument();
    
      });   
})