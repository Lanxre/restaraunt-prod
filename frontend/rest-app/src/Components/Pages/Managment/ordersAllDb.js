
const notConfirmTableOrder = async () => {
    return await fetch('http://localhost:8000/api/order/table-detail-not-confirm-all', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }}).then(res => res.json())
}

const notConfirmDishOrder = async () => {
    return await fetch('http://localhost:8000/api/order/menu-detail-not-confirm-all', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }}).then(res => res.json())
}



export {
    notConfirmTableOrder,
    notConfirmDishOrder
}