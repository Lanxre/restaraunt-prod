const fetchTables = (token) => {
    return new Promise((resolve, reject) => {
        fetch(`http://localhost:8000/api/tables`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        })
        .then(res => res.json())
        .then(data => {
            resolve(data);
        })
        .catch(err => reject(err));
    });

}
export {
    fetchTables
}