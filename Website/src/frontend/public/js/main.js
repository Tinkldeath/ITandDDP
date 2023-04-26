function renderTop() {
    console.log('top');
}

function renderCategories() {
    console.log('categories');
}

function renderToolbar() {
    const splitted = document.cookie.split('=');
    const index = splitted.indexOf(splitted.find(element => element === 'jwt'));
    const jwt = splitted[index + 1];
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
            <button class="logout-button" onclick="routeToLogin()"> Logout </button>`
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