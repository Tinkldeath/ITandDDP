function loginRequest() {
    const login = document.getElementById('login').value
    const password = document.getElementById('password').value
    if(login !== '' && password !== ''){
        fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "login": login,
            "password": password
        }),
        })
        .then(response => {
            if(response.status === 200) {
                response.json().then((data) => {
                    alert('Successfully logged in!')
                    document.cookie = `jwt=${data.jwt}`
                    window.location.href = '/'
                })
            }
            return response.json();
        })
        .then((resp) => {
            alert(resp.message);
        })
        .catch((error) => {
            console.log("error ", error);
        });
    }
    else {
        alert('Fill in the inputs correctly!');
    }
}