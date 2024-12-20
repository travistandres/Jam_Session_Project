const PORT = 3000

/**
 * Calls the login endpoint with a user's password and either their name or email. The method will check whether it is a name or email and return a promise of a jwt upon successful login
 * @param {String} nameOrEmail whichever the user entered
 * @param {String} enteredPassword user's password
 * @returns {Promise<String>} the JWT as a string
 */
export const login = (nameOrEmail, enteredPassword) => {
    return new Promise((res, rej) => {
        setTimeout(() => {
            try {
                let json
                if (nameOrEmail.includes('@')){
                    json = { 
                        email: nameOrEmail,
                        password: enteredPassword
                    }
                } else {
                    json = {
                        name: nameOrEmail,
                        password: enteredPassword
                    }
                }
                fetch(`http://localhost:${PORT}/login`, {
                    method: 'POST',
                    headers: {
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
 * Registers a new user with their name, email, and password
 * @param {String} name new user's name
 * @param {String} email new user's email
 * @param {String} password new user's password
 * @returns {Promise<JSON>} a message and the new user's id
 */
export const register = (name, email, password) => {
    return new Promise((res, rej) => {
        setTimeout(() => {
            try {
                const json = {
                    name: name,
                    email: email,
                    password: password
                }
                fetch(`http://localhost:${PORT}/users`, {
                    method: 'POST',
                    headers: {
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
 * Updates a user's name, email, and or password. Enter a null for any value not being updated
 * @param {String} token jwt
 * @param {String} name new name or null
 * @param {String} email new email or null
 * @param {String} password new password or null
 * @returns {Promise<JSON>}
 */
export const updateUser = (token, name, email, password) => {
    return new Promise((res, rej) => {
        setTimeout(() => {
            let json = {}
            try {
                if (name != null){
                    json.name = name
                }
                if (email != null){
                    json.email = email
                }
                if (password != null){
                    json.password = password
                }
                fetch(`http://localhost:${PORT}/api/users`, {
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
 * deletes a user's account given their JWT
 * @param {String} token the user's JWT token
 * @returns {Promise<JSON>} A message of the changes
 */
export const deleteAccount = (token) => {
    return new Promise((res, rej) => {
        setTimeout(() => {
            try {
                fetch(`http://localhost:${PORT}/api/users`, {
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