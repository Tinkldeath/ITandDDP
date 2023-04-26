function submitForm() {
    const login = document.getElementById('login').value
    const password = document.getElementById('password').value
    const username = document.getElementById('username').value
    if(login !== '' && password !== '' && username !== ''){
        var myform = document.getElementById('registerForm');
        var formData = new FormData(myform);

        fetch("http://localhost:3000/register", {
        method: "POST",
        body: formData,
        })
        .then(response => {
            if(response.status === 201) {
                alert('Successfully registered, now you can sign in!');
                window.location.href = '/login';
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