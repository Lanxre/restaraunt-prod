const fetchUser = async (token) => {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        },
    };
    const response = await fetch("http://127.0.0.1:8000/api/users/me", requestOptions);
    const data = await response.json();
    if (response.ok) {
        return data
    }

};

const fetchUserById = async (token, id) => {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        },
    };
    const response = await fetch(`http://127.0.0.1:8000/api/user/${id}`, requestOptions);
    const data = await response.json();
    if (response.ok) {
        return data
    }

};

const fetchUserUpdate = async (token, obj) => {
    const requestOptions = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        }, body: JSON.stringify(obj)
    };
    const response = await fetch("http://localhost:8000/api/users/", requestOptions);
    const data = await response.json();
    if (response.ok) {
        return data
    }

};

const fetchUsers = async (token) => {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        },
    };
    const response = await fetch("http://127.0.0.1:8000/api/users", requestOptions);
    const data = await response.json();
    if (response.ok) {
        return data
    }

};


const fetchAdministrator = async (token) => {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        },
    };
    const response = await fetch('http://127.0.0.1:8000/api/administrators', requestOptions);
    const data = await response.json();
    if (response.ok) {
        return data
    }
};

const fetchAdministratorById = async (token, id) => {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        },
    };
    const response = await fetch(`http://127.0.0.1:8000/api/administrators/${id}`, requestOptions);
    const data = await response.json();
    if (response.ok) {
        return data
    }
};



const fetchCustomer = async (token) => {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        },
    };
    const response = await fetch('http://localhost:8000/api/customers', requestOptions);
    const data = await response.json();
    if (response.ok) {
        return data
    }
};

const fetchCustomerById = async (token, id) => {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        },
    };
    const response = await fetch(`http://localhost:8000/api/customers/${id}`, requestOptions);
    const data = await response.json();
    if (response.ok) {
        return data
    }
};


const fetchManager = async (token) => {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        },
    };
    const response = await fetch('http://localhost:8000/api/managers', requestOptions);
    const data = await response.json();
    if (response.ok) {
        return data
    }
};

const fetchManagerById = async (token, id) => {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        },
    };
    const response = await fetch(`http://localhost:8000/api/managers/${id}`, requestOptions);
    const data = await response.json();
    if (response.ok) {
        return data
    }
};

const fetchUpdateObject = async (token, link, obj, id) => {
    const requestOptions = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        },
        body: JSON.stringify(obj)
    };
    const response = await fetch(`${link}/${id}`, requestOptions);
    const data = await response.json();
    if (response.ok) {
        return data
    }
};

const fetchDeleteObject = async (token, link, obj) => {
    const requestOptions = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        },
        body: JSON.stringify(obj)
    };

    const id = obj[['user_id', 'customer_id', 'id', 'administrator_id'].find(
        key => {
            if(key in obj) {
                return obj[key];
            }
        }
    )]

    const response = await fetch(`${link}/${id}`, requestOptions);
    const data = await response.json();
    if (response.ok) {
        return data
    }
};


const fetchCreateObject = async (token, type, obj) => {
    const requestOptions = {
        method: "Post",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        }, body: JSON.stringify(obj)
    };

    switch (type) {
        case "administrators":
            const response = await fetch("http://localhost:8000/api/administrators", requestOptions);
            const data = await response.json();
            if (response.ok) {
                return data
            }
            break;
        
        case "customers":
            const response1 = await fetch("http://localhost:8000/api/customers", requestOptions);
            const data1 = await response1.json();
            if (response1.ok) {
                return data1
            }
            break;
        
        case "managers":
            const response2 = await fetch("http://localhost:8000/api/managers", requestOptions);
            const data2 = await response2.json();
            if (response2.ok) {
                return data2
            }
            break;
        
        case "users":
            const response3 = await fetch("http://127.0.0.1:8000/api/users", requestOptions);
            const data3 = await response3.json();
            if (response3.ok) {
                return data3
            }
            break;
        
        default:
            break;

    }

};




export {
    fetchUser, 
    fetchUsers,
    fetchUserById,
    fetchUserUpdate,

    fetchAdministrator, 
    fetchAdministratorById,

    fetchCustomer, 
    fetchCustomerById,

    fetchManager,
    fetchManagerById,

    fetchUpdateObject,
    fetchDeleteObject,
    fetchCreateObject

};