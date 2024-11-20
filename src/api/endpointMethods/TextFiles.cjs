const PORT = 3000

/**
 * Creates a TextFile for a project
 * @param {String} token the jwt
 * @param {String} name name of the text file
 * @param {Int} projectID id of the project
 * @param {String} lyrics the lyrics
 * @param {String} notes any notes about these lyrics
 * @returns {Promise<JSON>} message
 */
export const createTextFile = (token, name, projectID, lyrics, notes) => {
    return new Promise((res, rej) => {
        setTimeout(() => {
            try {
                const json = {
                    name: name,
                    projectID: projectID,
                    lyrics: lyrics,
                    notes: notes
                }
                fetch(`http://localhost:${PORT}/api/textFiles`, {
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
        }, 20)
    })
}

/**
 * Update a text file's name lyrics and or notes, insert nulls for values that are not getting updating
 * @param {String} token the jwt
 * @param {Int} textID id of the text file
 * @param {Int} projectID id of the project
 * @param {String} name new name of the text file or null
 * @param {String} lyrics new/updated lyrics or null
 * @param {String} notes new/updated notes or null
 * @returns {Promise<JSON>} message
 */
export const updateTextFile = (token, textID, projectID, name, lyrics, notes) => {
    return new Promise((res, rej) => {
        setTimeout(() => {
            let json = {}
            try {
                json.projectID = projectID
                if (name != null){
                    json.name = name
                }
                if (lyrics != null){
                    json.lyrics = JSON.stringify(lyrics)
                }
                if (notes != null){
                    json.notes = JSON.stringify(notes)
                }
                fetch(`http://localhost:${PORT}/api/textFiles/${textID}`, {
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
        }, 20)
    })
}

/**
 * Deletes a text file given it's project id and its own id
 * @param {String} token the jwt
 * @param {Int} textID ID of the text file
 * @param {Int} projectID ID of the project
 * @returns {Promise<JSON>} message
 */
export const deleteTextFile = (token, textID, projectID) => {
    return new Promise((res, rej) => {
        setTimeout(() => {
            try {
                const json = {
                    projectID: projectID
                }
                fetch(`http://localhost:${PORT}/api/textFiles/${textID}`, {
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
        }, 20)
    })
}

/**
 * Retrieves the data of all textFiles for a project given its ID as a JSON
 * @param {String} token the jwt
 * @param {Int} projectID id of the project
 * @returns {Promise<Array<JSON>>} JSON of all text files for a given project
 */
export const getTextFiles = (token, projectID) => {
    return new Promise((res, rej) => {
        setTimeout(() => {
            try {
                fetch(`http://localhost:${PORT}/api/textFiles/${projectID}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
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
        }, 20)
    })
}