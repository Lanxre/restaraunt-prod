export const submitLogin = async (email, password) => {

    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: JSON.stringify(
            `grant_type=&username=${email}&password=${password}&scope=&client_id=&client_secret=`
        ),
    };

    const response = await fetch("/api/token", requestOptions);
    const data = await response.json();

    if (response.ok) {
        return data.access_token;
    }
    else {
        return null;
    }
};

export default  submitLogin;