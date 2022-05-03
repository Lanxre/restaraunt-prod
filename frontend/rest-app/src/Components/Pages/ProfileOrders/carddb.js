
const getUserNotConfirmOrders = async (token) => {
    return await fetch('http://localhost:8000/api/order/menu-detail-not-confirm', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    }).then(res => res.json())
            
}


const getUserConfirmOrders = async (token) => {
    return await fetch('http://localhost:8000/api/order/menu-detail-confirm', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    }).then(res => res.json())
            
}


const getUserNotConfirmOrdersTable = async (token) => {
    return await fetch('http://localhost:8000/api/order/table-detail-not-confirm', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    }).then(res => res.json())
            
}


const getUserConfirmOrdersTable = async (token) => {
    return await fetch('http://localhost:8000/api/order/table-detail-confirm', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    }).then(res => res.json())
            
}



export {
    getUserNotConfirmOrders,
    getUserConfirmOrders,
    getUserNotConfirmOrdersTable,
    getUserConfirmOrdersTable
}