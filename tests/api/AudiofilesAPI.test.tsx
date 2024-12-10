import { it, expect, describe, test, vi } from 'vitest';
import {render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { MemoryRouter } from 'react-router';
import React from 'react';
import AudioFiles from '../../src/AudioFiles';
import { getAudioFiles, createAudioFile, deleteAudioFile, updateAudioFile } from '../../src/api/endpointMethods/AudioFiles.cjs'; 

describe('audiofiles', () => {

//Test for determing if API returns data
test('Testing if getAudioFiles returns appropriate data', async () => {
  //Creating test data 
  const mockData = [
    { id: 1, fileName: 'audio1.mp3', projectId: 1 },
    { id: 2, fileName: 'audio2.mp3', projectId: 1 },
  ];

  //Mocking the response
  const mockedJson = vi.fn().mockResolvedValue(mockData); 
  const mockedFetch = vi.fn().mockResolvedValue({
    ok: true,  
    json: mockedJson,
  });

  //Mocking fetch
  global.fetch = mockedFetch;

  // setting test token and project ID
  const token = 'fake-token';
  const projectID = 1;
  const result = await getAudioFiles(token, projectID);

  //Asserting the function was called
  expect(mockedFetch).toHaveBeenCalledWith(`http://localhost:3000/api/audioFiles/1`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  //Asserting mock data was returned
  expect(mockedJson).toHaveBeenCalled();
  expect(result).toEqual(mockData);


});

//Test for adding an audio file
test('Testing if createAudioFile pushes correct data '), async () => {
  
  //Creating Mock Data
  const mockedData = {
    audioFileID: '1',
  };

    //Mocking the response
    const mockedJson = vi.fn().mockResolvedValue(mockedData); 
    const mockedFetch = vi.fn().mockResolvedValue({
      ok: true,  
      json: mockedJson,
    });
  
    //Mocking fetch
    global.fetch = mockedFetch;

    //Data for audio file
    const token = 'fakeToken';
    const name = 'audio';
    const projectID = 'projectID';
    const audio = new Blob(['audio data'], {type: 'audio' });
    const result = await createAudioFile(token, name, projectID, audio);

    //Asserting the function was called
    expect(mockedFetch).toHaveBeenCalledWith(`http://localhost:3000/api/audioFiles/1`, 
      expect.objectContaining({
        method: `POST`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: expect.any(FormData),
      })
    );

    expect(mockedJson).toHaveBeenCalled();
    expect(result).toEqual(mockedData); 
}

//Test for deleting an audio file
test('Testing if deleteAudioFile functions correctly '), async () => {

  //Creating mock data
  const mockedData = {
    audioFileID: '1',
  };

  //Mocking the response
  const mockedJson =vi.fn().mockResolvedValue(mockedData);
  const mockedFetch = vi.fn().mockResolvedValue({
    ok: true,
    json: mockedJson,
  });

  //Mocking fetch
  global.fetch = mockedFetch;
  
  //Data for audio file
  const token = 'fakeToken';
  const audio = 'audio';
  const projectID = 'projectID';
  const result = await deleteAudioFile(token, audio, projectID);

  //Asserting the function was called
  expect(mockedFetch).toHaveBeenCalledWith(`http://localhost:3000/api/audioFiles/1`, 
    expect.objectContaining({
      method: `POST`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: expect.any(JSON.stringify(mockedJson)),
    })
  );

  expect(mockedJson).toHaveBeenCalled();
  expect(result).toEqual(mockedData);
}

//Test for updating an audio file
test('Testing if updateAudioFile changes correct data'), async () => {

  //Creating mock data
  const mockedData = {
    audioFileID: '1',
  };

  //Mocking the response
  const mockedJson = vi.fn().mockResolvedValue(mockedData);
  const mockedFetch = vi.fn().mockResolvedValue({
    ok: true,
    json: mockedJson,
  });

  //Mocking fetch
  global.fetch = mockedFetch;

  //Data for audio file
  const token = 'fakeToken';
  const audioID = 1;
  const projectID = 1;
  const name = 'audioFile';
  const audio = new Blob(['audio data'], {type: 'audio'});
  const result = await updateAudioFile(token, audioID, projectID, name, audio);

  //Asserting the function was called
  expect(mockedFetch).toHaveBeenCalledWith(`http://localhost:3000/api/audioFiles/1`,
    expect.objectContaining({
      method: `PUT`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: expect.any(JSON.stringify(mockedJson)),
    })
  );

  expect(mockedJson).toHaveBeenCalled();
  expect(result).toEqual(mockedData);

}

});
