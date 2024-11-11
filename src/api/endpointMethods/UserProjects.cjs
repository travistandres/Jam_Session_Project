const PORT = 3000

/**
 * Creates a relation for a user (not the owner) to be added to a project
 * @param {String} token the JWT
 * @param {int} userID ID for the user to be added
 * @param {int} projectID ID for the project
 * @returns 
 */
const createRelation = (token, userID, projectID) => {
    return new Promise((res, rej) => {
        setTimeout(() => {
            try {
                const json = {
                    projectID: projectID
                }
                const response = fetch(`http://localhost:${PORT}/api/userProjects/${userID}`, {
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
 * Deletes the relation between the current user and a projects
 * @param {String} token the jwt
 * @param {int} projectID id of project
 * @returns {Promise<JSON>} message
 */
const deleteRelation = (token, projectID) => {
    return new Promise((res, rej) => {
        setTimeout(() => {
            try {
                const response = fetch(`http://localhost:${PORT}/api/userProjects/${projectID}`, {
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
                rej('Error making the POST request:', error.message);
            }
        }, 5000)
    })
}

/**
 * Retrieves the rows of relations for a given project
 * @param {String} token the jwt
 * @param {int} projectID id of the project
 * @returns {Promise<JSON>} the rows of what relations the given project has
 */
const getRelations = (token, projectID)=> {
    return new Promise((res, rej) => {
        setTimeout(() => {
            try {
                const response = fetch(`http://localhost:${PORT}/api/userProjects/${projectID}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
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
module.exports = {
    createRelation,
    deleteRelation,
    getRelations
}