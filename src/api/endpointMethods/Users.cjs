const {PORT} =  require('../App.cjs')

/**
 * Calls the login endpoint with a user's password and either their name or email. The method will check whether it is a name or email and return a promise of a jwt upon successful login
 * @param {String} nameOrEmail whichever the user entered
 * @param {String} enteredPassword user's password
 * @returns {Promise<String>} the JWT as a string
 */
function login(nameOrEmail, enteredPassword) {
    return new Promise((res, rej) => {
        setTimeout(() => {
            try {
                let json
                if (nameOrEmail.contains('@')){
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
                const response = fetch(`http://localhost:${PORT}/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(json)
                });
        
                if (!response.ok) {
                    rej(`HTTP error! Status: ${response.status}`)
                } else {
                    const data = response.json();
                    console.log('Response received:', data);
                    res(data.token)
                }
            } catch (error) {
                rej('Error making the POST request:', error.message);
            }
        }, 5000)
    })
}

/**
 * Registers a new user with their name, email, and password
 * @param {String} name new user's name
 * @param {String} email new user's email
 * @param {String} password new user's password
 * @returns {Promise<JSON>} a message and the new user's id
 */
function register(name, email, password){
    return new Promise((res, rej) => {
        setTimeout(() => {
            try {
                const json = {
                    name: name,
                    email: email,
                    password: password
                }
                const response = fetch(`http://localhost:${PORT}/users`, {
                    method: 'POST',
                    headers: {
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
 * Updates a user's name, email, and or password. Enter a null for any value not being updated
 * @param {String} token jwt
 * @param {String} name new name or null
 * @param {String} email new email or null
 * @param {String} password new password or null
 * @returns {Promise<JSON>}
 */
function updateUser(token, name, email, password){
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
                const response = fetch(`http://localhost:${PORT}/api/users`, {
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
 * deletes a user's account given their JWT
 * @param {String} token the user's JWT token
 * @returns {Promise<JSON>} A message of the changes
 */
function deleteAccount(token){
    return new Promise((res, rej) => {
        setTimeout(() => {
            try {
                const response = fetch(`http://localhost:${PORT}/api/users`, {
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

module.exports = {
    login,
    register,
    updateUser,
    deleteAccount
}