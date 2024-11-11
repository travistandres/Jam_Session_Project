const PORT = 3000

/**
 * Creates an AudioFile for a project
 * @param {String} token the jwt
 * @param {String} name name of the audio file
 * @param {Int} projectID id of the project
 * @param {BLOB} audio the audio
 * @returns {Promise<JSON>} message
 */
export const createAudioFile = (token, name, projectID, audio) => {
    return new Promise((res, rej) => {
        setTimeout(() => {
            try {
                const json = {
                    name: name,
                    projectID: projectID,
                    audio: audio
                }
                fetch(`http://localhost:${PORT}/api/audioFiles`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(json)
                }).then(response => {
                    if (!response.ok) {
                        rej(`HTTP error! Status: ${response.status}`)
                    } else {
                        const data = response.json();
                        console.log('Response received:', data);
                        res(data)
                    }
                })
            } catch (error) {
                rej('Error making the POST request:', error.message);
            }
        }, 2000)
    })
}

/**
 * Update an audio file's name or audio, insert nulls for values that are not getting updating
 * @param {String} token the jwt
 * @param {Int} audioID id of the audio file
 * @param {Int} projectID id of the project
 * @param {String} name new name of the audio file or null
 * @param {BLOB} audio updated audio
 * @returns {Promise<JSON>} message
 */
export const updateAudioFile = (token, audioID, projectID, name, audio) => {
    return new Promise((res, rej) => {
        setTimeout(() => {
            let json = {}
            try {
                if (name != null){
                    json.name = name
                }
                if (audio != null){
                    json.audio = audio
                }
                fetch(`http://localhost:${PORT}/api/audioFiles/${audioID}:${projectID}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(json)
                }).then(response => {
                    if (!response.ok) {
                        rej(`HTTP error! Status: ${response.status}`)
                    } else {
                        const data = response.json();
                        console.log('Response received:', data);
                        res(data)
                    }
                })
            } catch (error) {
                rej('Error making the PUT request:', error.message);
            }
        }, 2000)
    })
}

/**
 * Deletes an audio file given it's project id and its own id
 * @param {String} token the jwt
 * @param {Int} audioID ID of the audio file
 * @param {Int} projectID ID of the project
 * @returns {Promise<JSON>} message
 */
export const deleteAudioFile = (token, audioID, projectID) => {
    return new Promise((res, rej) => {
        setTimeout(() => {
            try {
                const json = {
                    projectID: projectID
                }
                fetch(`http://localhost:${PORT}/api/audioFiles/${audioID}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(json)
                }).then(response => {
                    if (!response.ok) {
                        rej(`HTTP error! Status: ${response.status}`)
                    } else {
                        const data = response.json();
                        console.log('Response received:', data);
                        res(data)
                    }
                })
            } catch (error) {
                rej('Error making the DELETE request:', error.message);
            }
        }, 2000)
    })
}

/**
 * Retrieves the data of all audioFiles for a project given its ID as a JSON
 * @param {String} token the jwt
 * @param {Int} projectID id of the project
 * @returns {Promise<JSON>} JSON of all audio files for a given project
 */
export const getAudioFiles = (token, projectID) => {
    return new Promise((res, rej) => {
        setTimeout(() => {
            try {
                const json = {
                    projectID: projectID
                }
                fetch(`http://localhost:${PORT}/api/audioFiles`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(json)
                }).then(response => {
                    if (!response.ok) {
                        rej(`HTTP error! Status: ${response.status}`)
                    } else {
                        const data = response.json();
                        console.log('Response received:', data);
                        res(data)
                    }
                })
        
            } catch (error) {
                rej('Error making the GET request:', error.message);
            }
        }, 2000)
    })
}
