
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


const monthSaleStatsOrder = async (token) => {
    return await fetch('http://localhost:8000/api/statistics/sales', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token,
        }}).then(res => res.json())

}

const monthBookingStatsOrder = async (token) => {
    return await fetch('http://localhost:8000/api/statistics/booking', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token,
        }}).then(res => res.json())

}

const monthOrderStatsOrder = async (token) => {
    return await fetch('http://localhost:8000/api/statistics/order', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token,
        }}).then(res => res.json())
}



export {
    notConfirmTableOrder,
    notConfirmDishOrder,

    monthSaleStatsOrder,
    monthBookingStatsOrder,
    monthOrderStatsOrder,
}