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

      //Test for getProjects API call
      test("Testing if getProjects returns appropriate data", async () => {
        
        //Creating test data
        const mockedData = [
            {id: 1, projectName: 'project1', projectId: 1 },
            {id: 2, projectName: 'project2',  projectId: 2 },
        ]

        //Mocking the response
        const mockedJson = vi.fn().mockResolvedValue(mockedData);
        const mockedFetch = vi.fn().mockResolvedValue({
            ok: true,
            json: mockedJson,
        });

        //Mocking fetch
        global.fetch = mockedFetch;

        //Setting test token and project ID
        const token = 'fakeToken';
        const projectID = 1; //maybe delete this 
        const result = await getProjects(token);

        //Asserting the function was called
        expect(mockedFetch).toHaveBeenCalledWith(`http://localhost:3000/api/projects`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
      })

      //Test for adding a project
      test('Testing if createProject create a new project'), async () => {

        //Creating mockedData
        const mockedData = [
          {id: 1, projectName: 'project1', projectID: 1},
        ]

        //Mocking the response
        const mockedJson = vi.fn().mockResolvedValue(mockedData);
        const mockedFetch = vi.fn().mockResolvedValue({
          ok: true,
          json: mockedJson,
        });

        //Mocking fetch
        global.fetch = mockedFetch;

        //Data for project
        const token = 'fakeToken';
        const name = 'project';
        const created = 'date';
        const result = await createProject(token, name, created);

        //Asserting the fucnction was called
        expect(mockedFetch).toHaveBeenCalledWith(`http://localhost:3000/api/project/1`),
        expect.objectContaining({
          method: `POST`, 
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: expect.any(JSON.stringify(mockedJson)),
        }) 
        
        expect(mockedJson).toHaveBeenCalled();
        expect(result).toEqual(mockedData);
      };

      //Test fo deleting a project
      test('Testing if deleteProject removes correct data'), async () => {

        //Creating mock data
        const mockedData = [
          {id: 1, projectName: 'projectName', projectID: 1}
        ]

        //Mocking the response
        const mockedJson = vi.fn().mockResolvedValue(mockedData);
        const mockedFetch = vi.fn().mockResolvedValue({
          ok: true,
          json: mockedJson,
        });

        //Mocking fetch
        global.fetch = mockedFetch;

        //Data for project
        const token = 'fakeToken';
        const projectID = 1;
        const result = await deleteProject(token, projectID);

        //Asserting the functino was called
        expect(mockedFetch).toHaveBeenCalledWith(`http://localhost:3000/api/projects/1`,
          expect.objectContaining({
            method: `DELETE`,
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: expect.any(mockedJson),
          })
        );

        expect(mockedJson).toHaveBeenCalled();
        expect(result).toEqual(mockedData);
      }

      //Test for updating a project
      test('Testing if updateProject correct updates data'), async () => {

        //Creating mock data
        const mockedData = [
          {id: 1, projectName: 'project1', projectID: 1},
        ]

        //Mocking the response
        const mockedJson = vi.fn().mockResolvedValue(mockedData);
        const mockedFetch = vi.fn().mockResolvedValue({
          ok: true,
          json: mockedJson,
        });

        //Mocking fetch
        global.fetch = mockedFetch;

        //Data for project
        const token = 'fakeToken';
        const projectID = 1;
        const name = 'project';
        const edited = 'date';
        const result = await updateProject(token, projectID, name, edited);

        //Asserting the function was called
        expect(mockedFetch).toHaveBeenCalledWith(`http://localhost:3000/api/project/1`,
          expect.objectContaining({
            method: `PUT`,
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: expect.any(mockedJson),
          })
        );

        expect(mockedJson).toHaveBeenCalled();
        expect(result).toEqual(mockedData);
      }
})

