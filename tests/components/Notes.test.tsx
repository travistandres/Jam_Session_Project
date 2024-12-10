import { it, expect, describe, test, vi } from 'vitest';
import {render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { MemoryRouter } from 'react-router';
import React from 'react';
import Notes from '../../src/Notes';
import { getTextFiles } from '../../src/api/endpointMethods/TextFiles.cjs';


describe('notes', () => {

    //Test for rendering UI elements
    test("renders Notes page with correct elements", () => {
        //Rendering Notes page 
        render(
          <MemoryRouter>
            <Notes selectedProject={undefined} projects={undefined} />
          </MemoryRouter>
        );
        //Verifying Lyrics/Notes is visible on page
        expect(screen.getByText("Lyrics/Notes")).toBeInTheDocument();
    
      });

      //Test for getTextFiles API call
      test("testing if getTextFiles returns appropriate data", async () => {

        //Creating test data
        const mockedData = [
            {id: 1, fileName: 'textFile1.txt', projectId: 1 },
            {id: 2, fileName: 'textFile2.txt', projectId: 2 },
        ]

        //Mocking the response
        const mockedJson = vi.fn().mockResolvedValue(mockedData);
        const mockedFetch = vi.fn().mockResolvedValue({
            ok: true, 
            json: mockedJson, 
        });

        //Mocking fetch
        global.fetch = mockedFetch;

        //Setting test token and project id
        const token = 'fakeToken';
        const projectID = 1;
        const result = await getTextFiles(token, projectID);

        //Assering the function was called
        expect(mockedFetch).toHaveBeenCalledWith('http://localhost:3000/api/textFiles/1', {
            method: 'GET', 
            headers: {
                Authorization: `Bearer ${token}`, 
            },
        });

        //Asserting the function was called
        expect(mockedJson).toHaveBeenCalled();
        expect(result).toEqual(mockedData);
      });
})