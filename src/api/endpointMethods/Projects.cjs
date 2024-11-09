const {PORT} =  require('../App.cjs')

/**
 * Updates a project's name or last time updated
 * @param {String} token the jwt
 * @param {String} id id of the project to be updated
 * @param {String} name new project name
 * @param {String} edited the current time at which the update is taking place
 * @returns {Promise<JSON>} message
 */
function updateProject(token, id, name, edited){
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
                const response = fetch(`http://localhost:${PORT}/api/projects/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(json)
                });
        
                if (!response.ok) {
                    rej(`HTTP error! Status: ${response.status}`)
                } else {
                    const data = response.json();
                    console.log('Response received:', data);
                    res(data)
                }
            } catch (error) {
                rej('Error making the PUT request:', error.message);
            }
        }, 5000)
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
                const response = fetch(`http://localhost:${PORT}/api/projects`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(json)
                });
        
                if (!response.ok) {
                    rej(`HTTP error! Status: ${response.status}`)
                } else {
                    const data = response.json();
                    console.log('Response received:', data);
                    res(data)
                }
            } catch (error) {
                rej('Error making the POST request:', error.message);
            }
        }, 5000)
    })
}

/**
 * creates a new project and creates a relation between the owner and the project
 * @param {String} token the jwt
 * @param {String} name project's name
 * @param {String} created date created
 */
function createProject(token, name, created){
    create(token, name, created).then(project => {
        return new Promise((res, rej) => {
            setTimeout(() => {
                try {
                    const json = {
                        projectID: project.projectID
                    }
                    const response = fetch(`http://localhost:${PORT}/api/userProjects`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(json)
                    });
            
                    if (!response.ok) {
                        rej(`HTTP error! Status: ${response.status}`)
                    } else {
                        const data = response.json();
                        console.log('Response received:', data);
                        res(data)
                    }
                } catch (error) {
                    rej('Error making the POST request:', error.message);
                }
            }, 5000)
        })
    })
}

/**
 * Deletes a project via it's ID
 * @param {String} token the jwt
 * @param {Int} projectID id of the project to be deleted
 * @returns {Promise<JSON>} message
 */
function deleteProject(token, projectID){
    return new Promise((res, rej) => {
        setTimeout(() => {
            try {
                const response = fetch(`http://localhost:${PORT}/api/projects/${projectID}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
        
                if (!response.ok) {
                    rej(`HTTP error! Status: ${response.status}`)
                } else {
                    const data = response.json();
                    console.log('Response received:', data);
                    res(data)
                }
            } catch (error) {
                rej('Error making the DELETE request:', error.message);
            }
        }, 5000)
    })
}

/**
 * Gets all projects of the user via their jwt
 * @param {String} token the jwt
 * @returns {Promise<JSON>} retrieved rows as a JSON
 */
function getProjects(token){
    return new Promise((res, rej) => {
        setTimeout(() => {
            try {
                const response = fetch(`http://localhost:${PORT}/api/projects`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
        
                if (!response.ok) {
                    rej(`HTTP error! Status: ${response.status}`)
                } else {
                    const data = response.json();
                    console.log('Response received:', data);
                    res(data)
                }
            } catch (error) {
                rej('Error making the GET request:', error.message);
            }
        }, 5000)
    })
}

module.exports = {
    updateProject,
    createProject,
    deleteProject,
    getProjects
}