import request from 'superagent'

export function getUsers (account_id) {
    return dispatch => {
        dispatch(requestUsers())
        return request
            .post('/api/v1/users/')
            .send({account_id})
            .set('Accept', 'application/json')
            .then(res => {
                const users = res.body.users
                dispatch(receiveUsers(users))
                return
            })
            .catch(err => {
                dispatch(usersError(err.response.body.message))
            })
    }
}

function requestUsers () {
    return {
        type: 'USERS_REQUEST'
    }
}

function receiveUsers (users) {
    return {
        type: 'USERS_SUCCESS',
        users
    }
}

function usersError (message) {
    return {
        type: 'USERS_FAILURE',
        message
    }
}

export function addUser (user) {
    return dispatch => {
        dispatch(requestUsers())
        return request
            .post('/api/v1/users/add')
            .send(user)
            .set('Accept', 'application/json')
            .then(res => {
                dispatch(receiveUser(res.body))
                return
            })
            .catch(err => {
                dispatch(usersError(err.response.body.message))
            })
    }
}

function receiveUser (user) {
    return {
        type: 'RECEIVE_USER_SUCCESS',
        user
    }
}

export function editUser (user) {
    return dispatch => {
        dispatch(requestUsers())
        return request
            .post('/api/v1/users/edit')
            .send(user)
            .set('Accept', 'application/json')
            .then(res => {
                dispatch(receiveEditedUser(user))
                return
            })
            .catch(err => {
                dispatch(usersError(err.response.body.message))
            })
    }
}

function receiveEditedUser (user) {
    return {
        type: 'RECEIVE_EDITEDUSER_SUCCESS',
        user
    }
}