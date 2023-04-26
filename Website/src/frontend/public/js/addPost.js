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