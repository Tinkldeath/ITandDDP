function renderCategories() {
    document.querySelector('select').innerHTML = ""
    fetch('http://localhost:3000/api/categories/', {method: 'GET'})
        .then( res => {
            return res.json();
        })
        .then( categories => {
            document.querySelector('select').insertAdjacentHTML('beforeend', '<option value="">--Category--</option>')
            categories.categories.forEach(element => {
                const markup = `<option value="${element.title}">${element.title}</option>`
                document.querySelector('select').insertAdjacentHTML('beforeend', markup);
            });
        });
}

function createPost() {
    const title = document.getElementById('title').value;
    const category = document.getElementById('category-select').value;
    const style = document.getElementById('style').value;
    const technique = document.getElementById('technique').value;
    const genre = document.getElementById('genre').value;
    const file = document.getElementById('recfile').files[0];
    if(title !== '' && category !== '' && style !== '' && technique !== '' && genre !== '' && file !== undefined) {
        var myform = document.getElementById('newPostForm');
        var formData = new FormData(myform);

        fetch("http://localhost:3000/api/posts/add", {
        method: "POST",
        headers: {
            authorization: `Bearer ${document.cookie.split('=')[1]}`  
        },
        body: formData,
        })
        .then(response => {
            if(response.status === 201) {
                alert('Successfully added post');
                window.location.href = '/';
            }
            return response.json();
        })
        .then((resp) => {
            alert(resp.message);
        })
        .catch((error) => {
            console.log("error ", error);
        });
    } else {
        alert('Fill in the form correctly!');
    }
}