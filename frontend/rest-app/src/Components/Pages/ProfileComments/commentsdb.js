
const getUserComments = async (token) => {
    return await fetch('http://localhost:8000/api/comments/user', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    }).then(res => res.json())
}

const sendComment = async (token, data) => {

    return await fetch('http://localhost:8000/api/comments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(data)
    }).then(res => res.json())

}

const updateComment = async (token, id,  data) => {
    return await fetch('http://localhost:8000/api/comments/' + id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(data)
    }).then(res => res.json())
}

const deleteComment = async (token, id) => {

    return await fetch('http://localhost:8000/api/comments/' + id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    }).then(res => res.json())

}


export{
    getUserComments,
    sendComment,
    updateComment,
    deleteComment
}