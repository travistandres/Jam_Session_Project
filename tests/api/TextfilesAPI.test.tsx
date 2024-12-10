import { it, expect, describe, test, vi } from 'vitest';
import {render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { MemoryRouter } from 'react-router';
import React from 'react';
import Notes from '../../src/Notes';
import { createTextFile, getTextFiles, updateTextFile } from '../../src/api/endpointMethods/TextFiles.cjs';
import { updateAudioFile } from '../../src/api/endpointMethods/AudioFiles.cjs';


describe('notes', () => {

      //Test for getTextFiles API call
      test("Testing if getTextFiles returns appropriate data", async () => {

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

      //Test for adding a test file
      test('Testing if createTextFile pushes correct data'), async () => {

        //Creating mock data
        const mockedData = {
          textFileID: '1',
        };

        //Mocking the response
        const mockedJson = vi.fn().mockResolvedValue(mockedData);
        const mockedFetch = vi.fn().mockResolvedValue({
          ok: true,
          json: mockedJson,
        });

        //Mocking fetch
        global.fetch = mockedFetch;

        //Data for text file
        const token = 'fakeToken';
        const name = 'textFile';
        const projectID = '1';
        const lyrics = 'lyrics';
        const notes = 'notes';
        const result = await createTextFile(token, name, projectID, lyrics, notes);

        //Asserting the function was called
        expect(mockedFetch).toHaveBeenCalledWith(`http://localhost:3000/api/textFiles/1`,
          expect.objectContaining({
            method: 'POST', 
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: expect.any(JSON.stringify(mockedJson)),
          })
        );

        expect(mockedJson).toHaveBeenCalled();
        expect(result).toEqual(mockedData);
      }

      test('testing if updateTextFile changes data correctly'), async () => {

        //Creating mock data
        const mockedData = {
          textFileID: '1',
        };

        //Mocking the response
        const mockedJson = vi.fn().mockResolvedValue(mockedData);
        const mockedFetch = vi.fn().mockResolvedValue({
          ok: true,
          json: mockedJson,
        });

        //Mocking fetch
        global.fetch = mockedFetch;

        //Data for text file
        const token = 'fakeToken';
        const textID = 1;
        const projectID = 1;
        const name = 'textFile';
        const lyrics = 'lyrics';
        const notes = 'notes';
        const result = await updateTextFile(token, textID, projectID, name, lyrics, notes);

        //Asserting the function was called
        expect(mockedFetch).toHaveBeenCalledWith(`http://localhost:3000/api/textFiles/1`,
          expect.objectContaining({
            Method: `PUT`,
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: expect.any(JSON.stringify(mockedJson)),
          })
        );

        expect(mockedJson).toHaveBeenCalled();
        expect(result).toEqual(mockedData);



      }
})