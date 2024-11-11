const {createAudioFile, deleteAudioFile, updateAudioFile, getAudioFiles} = require('../api/endpointMethods/AudioFiles.cjs')
const {createTextFile, deleteTextFile, updateTextFile, getTextFiles} = require('../api/endpointMethods/TextFiles.cjs')
const {createProject, updateProject, deleteProject, getProjects} = require('../api/endpointMethods/Projects.cjs')
const {createRelation, deleteRelation, getRelations} = require('../api/endpointMethods/UserProjects.cjs')
const {login, register, updateUser, deleteAccount} = require('../api/endpointMethods/Users.cjs')

module.exports = {
    createAudioFile,
    deleteAudioFile,
    updateAudioFile,
    getAudioFiles,
    createTextFile,
    deleteTextFile,
    updateTextFile,
    getTextFiles,
    createProject,
    updateProject,
    deleteProject,
    getProjects,
    createRelation,
    deleteRelation,
    getRelations,
    login,
    register,
    updateUser,
    deleteAccount
}