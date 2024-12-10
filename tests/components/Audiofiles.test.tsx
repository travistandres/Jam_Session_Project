import { it, expect, describe, test, vi } from 'vitest';
import {render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { MemoryRouter } from 'react-router';
import React from 'react';
import AudioFiles from '../../src/AudioFiles';
import { getAudioFiles } from '../../src/api/endpointMethods/AudioFiles.cjs'; 

describe('audiofiles', () => {

//Test for determing if API returns data
test('getAudioFiles fetches and returns data correctly', async () => {
  //Creating test data 
  const mockData = [
    { id: 1, fileName: 'audio1.mp3', projectId: 1 },
    { id: 2, fileName: 'audio2.mp3', projectId: 1 },
  ];

  //Mocking the response
  const mockJson = vi.fn().mockResolvedValue(mockData); 
  const mockFetch = vi.fn().mockResolvedValue({
    ok: true,  
    json: mockJson,
  });

  //Mocking fetch
  global.fetch = mockFetch;

  // setting test token and project ID
  const token = 'fake-token';
  const projectID = 1;
  const result = await getAudioFiles(token, projectID);

  //Asserting the function was called
  expect(mockFetch).toHaveBeenCalledWith(`http://localhost:3000/api/audioFiles/1`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  //Asserting mock data was returned
  expect(mockJson).toHaveBeenCalled();
  expect(result).toEqual(mockData);
});

//Test for error handling
test('getAudioFiles handles errors correctly', async () => {

  //Creating data to simulate an error
  const mockFetch = vi.fn().mockResolvedValue({
    ok: false, 
    status: 400,
    statusText: 'Bad Request',
  });

  //Mocking fetch
  global.fetch = mockFetch;

  //Asserting the function returns an error
  const token = 'fake-token';
  const projectID = 1;
  await expect(getAudioFiles(token, projectID)).rejects.toThrow(
    'HTTP error! Status: 400'
  );

});

})
