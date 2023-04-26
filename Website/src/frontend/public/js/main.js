function delete_cookie( name ) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }

function renderTop() {
    document.querySelector('ul').innerHTML = ""
    fetch('http://localhost:3000/api/posts/top', {method: 'GET'})
        .then( res => {
            return res.json();
        })
        .then( posts => {
            posts.artworks.forEach(element => {
                const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
                const markup = `<li class="post">
                                    <div class="post-author"> 
                                        <img target="_blank" src="${element.authorImgUrl}"> 
                                        <div class="post-links">
                                            <a class="post-links-author" href=""> ${element.author} </a>
                                            <p> ${element.date.toLocaleDateString("en-US", options)} </p>
                                            <div class="post-links-tags">
                                                <p>${element.category},</p>
                                                <p>${element.style},</p>
                                                <p>${element.genre},</p>
                                                <p>${element.technique}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="post-content">
                                        <h2>${element.title}</h2>
                                        <a href="${element.artworkUrl}">
                                            <img src="${element.artworkUrl}" target="_blank">
                                        </a>
                                    </div>
                                    <div class="post-footer">
                                        <button class="post-footer-button"><img src="./../images/fire.png">${element.likes.length}</button>
                                        <button class="post-footer-button"><img src="./../images/comment.png">${element.comments.lenght}</button>
                                        <button class="post-footer-archive"><img src="./../images/archive.png"></button>
                                    </div>
                                </li>`
                document.querySelector('ul').insertAdjacentHTML('beforeend', markup);
            });
        });
}

function renderCategories() {
    document.querySelector('ul').innerHTML = ""
    fetch('http://localhost:3000/api/categories/', {method: 'GET'})
        .then( res => {
            return res.json();
        })
        .then( categories => {
            categories.categories.forEach(element => {
                const markup = `<li class="category">
                                    <img class="category-image" src="${element.imageUrl}">
                                    <div class="category-content">
                                        <h2>${element.title}</h2>
                                        <p>${element.description}</p>
                                        <button class="category-content-button"> <img src="./../images/archive.png">${element.artworks} Artworks</button>
                                    </div>
                                </li>`
                document.querySelector('ul').insertAdjacentHTML('beforeend', markup);
            });
        });
}

function renderAuthors() {
    document.querySelector('ul').innerHTML = ""
    const url = 'http://localhost:3000/api/authors'
    fetch(url, {method: 'GET'})
        .then( res => {
            return res.json();
        })
        .then( authors => {
            authors.authors.forEach(element => {
                let topRated = ''
                if(element.topRated === true) {
                    topRated = '<a class="top-rated" href="">Top rated artist</a>'
                }
                const markup = `<li class="profile">
                                    <div class="profile-header">
                                        <img class="profile-image" src="${element.imageUrl}"> 
                                        <div class="profile-content">
                                            <a class="profile-content-author" href="">${element.name}</a>
                                            ${topRated}
                                        </div>
                                    </div>
                                    <div class="profile-footer">
                                        <button class="profile-footer-button"><img src="./../images/archive.png">${element.posts} Artworks</button>
                                        <button class="profile-footer-button"><img src="./../images/friends.png">${element.friends} Friends</button>
                                    </div>
                                </li>`
                document.querySelector('ul').insertAdjacentHTML('beforeend', markup);
            });
        });
}

function renderChats() {
    document.querySelector('ul').innerHTML = ""
    console.log('chats');
}

function renderArchive() {
    document.querySelector('ul').innerHTML = ""
    console.log('archive');
}

function renderStatistics() {
    document.querySelector('ul').innerHTML = ""
    console.log('statistics');
}

function renderFrineds() {
    document.querySelector('ul').innerHTML = ""
    console.log('friends');
}

function routeToLoginWithLogout() {
    delete_cookie('jwt');
    document.location.reload();
}

function routeToNewPost() {
    document.location.href = '/new-post'
}

function renderToolbar() {
    const jwt = document.cookie.split('=')[1];
    console.log(jwt);
    if(jwt) {
        fetch('http://localhost:3000/api/user', {method: 'GET', headers: {authorization: `bearer ${jwt}`}})
        .then( res => {
            return res.json();
        })
        .then( user => {
            let image;
            if(user.imageLink) {
                image = user.imageLink;
            } else {
                image = 'images/duck.png'
            }
            const markup = `<img class="toolbar-image" src="${image}">
            <button class="toolbar-user"> ${user.name} </button>
            <button class="toolbar-button"> <img class="button-image" src="./../images/message.png"> Chats </button>
            <button class="toolbar-button"> <img class="button-image" src="./../images/archive.png" style="width: 40px; height: 40px; top: 0px; left: 3px;">  Archive </button>
            <button class="toolbar-button"> <img class="button-image" src="./../images/statistics.png">  Statistics </button>
            <button class="toolbar-button"> <img class="button-image" src="./../images/friends.png">  Friends </button>
            <div class="spacer"></div>
            <button class="logout-button" onclick="routeToLoginWithLogout()"> Logout </button>`
            document.querySelector('div.toolbar').insertAdjacentHTML('beforeend', markup);
        });
    } else {
        const markup = `<img class="toolbar-image" src="./../images/duck.png">
        <button class="toolbar-user" href="/login"> Unauthorized duck </button>
        <button class="toolbar-button"> <img class="button-image" src="./../images/message.png"> Chats </button>
        <button class="toolbar-button"> <img class="button-image" src="./../images/archive.png" style="width: 40px; height: 40px; top: 0px; left: 3px;">  Archive </button>
        <button class="toolbar-button"> <img class="button-image" src="./../images/statistics.png">  Statistics </button>
        <button class="toolbar-button"> <img class="button-image" src="./../images/friends.png">  Friends </button>
        <div class="spacer"></div>
        <button class="logout-button" onclick="routeToLogin()"> Login </button>`
        document.querySelector('div.toolbar').insertAdjacentHTML('beforeend', markup);
    }
}

function renderPosts() {
    fetch('http://localhost:3000/api/posts', {method: 'GET'})
        .then( res => {
            return res.json()
        })
        .then( posts => {
            posts.artworks.forEach(element => {
                const markup = `<li class="post">
                                    <div class="post-author"> 
                                        <img target="_blank" src="${element.authorImgUrl}"> 
                                        <div class="post-links">
                                            <a class="post-links-author" href=""> ${element.author} </a>
                                            <p> April 19, 2023 </p>
                                            <div class="post-links-tags">
                                                <p>Easel,</p>
                                                <p>Avant-Grade,</p>
                                                <p>Landscape,</p>
                                                <p>Watercolor</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="post-content">
                                        <h2>${element.title}</h2>
                                        <a href="${element.artworkUrl}">
                                            <img src="${element.artworkUrl}" target="_blank">
                                        </a>
                                    </div>
                                    <div class="post-footer">
                                        <button class="post-footer-button"><img src="./../images/fire.png"> 42</button>
                                        <button class="post-footer-button"><img src="./../images/comment.png">4</button>
                                        <button class="post-footer-archive"><img src="./../images/archive.png"></button>
                                    </div>
                                </li>`
                document.querySelector('ul').insertAdjacentHTML('beforeend', markup);
            });
        });
}

function artworkImage(link) {
    window.open(link)
}

function routeToLogin() {
    window.location.href = 'login'
};