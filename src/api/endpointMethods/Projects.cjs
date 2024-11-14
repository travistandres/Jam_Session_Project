const PORT = 3000

/**
 * Updates a project's name or last time updated
 * @param {String} token the jwt
 * @param {String} id id of the project to be updated
 * @param {String} name new project name
 * @param {String} edited the current time at which the update is taking place
 * @returns {Promise<JSON>} message
 */
export const updateProject = (token, projectID, name, edited) => {
    return new Promise((res, rej) => {
        setTimeout(() => {
            let json = {}
            try {
                if (name != null){
                    json.name = name
                }
                if (edited != null){
                    json.edited = edited
                }
                fetch(`http://localhost:${PORT}/api/projects/${projectID}`, {
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
 * Creates a new project Helper method for createProject
 * @param {String} token the jwt
 * @param {String} name project's name
 * @param {String} created date created
 * @returns {Promise<JSON>} message
 */
function create(token, name, created){
    return new Promise((res, rej) => {
        setTimeout(() => {
            try {
                const json = {
                    name: name,
                    created: created,
                    edited: created
                }
                fetch(`http://localhost:${PORT}/api/projects`, {
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
 * creates a new project and creates a relation between the owner and the project
 * @param {String} token the jwt
 * @param {String} name project's name
 * @param {String} created date created
 */
export const createProject = (token, name, created) => {
    if (created == null){
        created = Date.now()
    }
    create(token, name, created).then(project => {
        return new Promise((res, rej) => {
            setTimeout(() => {
                try {
                    const json = {
                        projectID: project.projectID
                    }
                    fetch(`http://localhost:${PORT}/api/userProjects`, {
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
                            createAudioFile(token, "New Audio", project.projectID, "").then(data => createTextFile(token, "New Text", project.projectID, {"block":[{"type":"paragraph", "data":{"text":""}}]}, {"block":[{"type":"paragraph", "data":{"text":""}}]}))                          
                            res(project)
                        }
                    })
            
                } catch (error) {
                    rej('Error making the POST request:', error.message);
                }
            }, 20)
        })
    })
}

/**
 * Deletes a project via it's ID
 * @param {String} token the jwt
 * @param {Int} projectID id of the project to be deleted
 * @returns {Promise<JSON>} message
 */
export const deleteProject = (token, projectID) => {
    return new Promise((res, rej) => {
        setTimeout(() => {
            try {
                fetch(`http://localhost:${PORT}/api/projects/${projectID}`, {
                    method: 'DELETE',
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
                rej('Error making the DELETE request:', error.message);
            }
        }, 20)
    })
}

/**
 * Gets all projects of the user via their jwt
 * @param {String} token the jwt
 * @returns {Promise<Array<JSON>>} retrieved rows as a JSON
 */
export const getProjects = (token) => {
    return new Promise((res, rej) => {
        setTimeout(() => {
            try {
                fetch(`http://localhost:${PORT}/api/projects`, {
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

/**
 * Creates a TextFile for a project
 * @param {String} token the jwt
 * @param {String} name name of the text file
 * @param {Int} projectID id of the project
 * @param {String} lyrics the lyrics
 * @param {String} notes any notes about these lyrics
 * @returns {Promise<JSON>} message
 */
const createTextFile = (token, name, projectID, lyrics, notes) => {
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
 * Creates an AudioFile for a project
 * @param {String} token the jwt
 * @param {String} name name of the audio file
 * @param {Int} projectID id of the project
 * @param {BLOB} audio the audio
 * @returns {Promise<JSON>} message
 */
const createAudioFile = (token, name, projectID, audio) => {
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
        }, 20)
    })
}