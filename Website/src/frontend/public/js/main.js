function delete_cookie( name ) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

function clearHeader() {
    document.querySelector('div.content-container').innerHTML = ''
    document.querySelector('div.content-container').insertAdjacentHTML('beforeend','<ul></ul>')
}

function renderTop() {
    clearHeader();
    clearOptions();
    fetch('http://localhost:3000/api/posts/top', {method: 'GET'})
        .then( res => {
            return res.json();
        })
        .then(data => {
            showPosts(data.posts);
            showPostsOptions(data);
        });
}

function renderCategories() {
    clearHeader();
    clearOptions();
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
                                        <button class="category-content-button"><i class="fa-solid fa-inbox" style="color: #ffffff;"></i>${element.artworks} Artworks</button>
                                    </div>
                                </li>`
                document.querySelector('ul').insertAdjacentHTML('beforeend', markup);
            });
        });
}

function renderAuthors() {
    clearHeader();
    clearOptions();
    const url = 'http://localhost:3000/api/authors'
    fetch(url, {method: 'GET'})
        .then( res => {
            return res.json();
        })
        .then(data => {
            showAuthors(data.authors);
        });
}

function poolChat(id) {
    try {
        fetch(`http://localhost:3000/api/chats/${id}/pool`, {method: 'GET'}).then(res => {
            return res.json();
        }).then(data => {
            showChat(data);
            poolChat(id);
        }).catch(error => {
            poolChat(id);
        });
    } catch (error) {
        poolChat(id);
    }
}

function sendMessage(id) {
    const message = document.getElementById('message-text').value
    if(message === '') {
        alert('You can not send an empty message');
        return
    }
    fetch(`http://localhost:3000/api/chats/${id}`, {method: 'POST', headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }, body: JSON.stringify({
        'message': message,
    })}).then(res => {
        return res.json();
    }).then(data => {
        console.log(data);
    }).catch(error => {
        console.log(error);
    });
}  

function showChat(data) {
    document.querySelector('div.chat-container').innerHTML = ''
    const companionId = data.companion._id;
    const markup = `
                    <div class="chat-header">
                        <img class="profile-image" src="${data.companion.imageUrl}"> 
                        <h2 class="chat-header-companion">${data.companion.name}</h2>
                    </div>
                    <div class="chat-content">
                        <ul class="chat-messages" id="chat">
                        </ul>
                    </div>
                    <div class="chat-footer">
                        <input type="text" value="" placeholder="Enter your message" id="message-text">
                        <button onclick="sendMessage('${data._id}')"> <i class="fa-solid fa-paper-plane fa-xl" style="color: #ffffff;"></i> </button>
                    </div>
                `
    document.querySelector('div.chat-container').insertAdjacentHTML('beforeend', markup);
    data.messages.forEach(message => {
        if(message.sender === companionId) {
            const markup = ` <li class="chat-companion-message" id="${message._id}">
                                <img class="profile-image" src="${data.companion.imageUrl}"> 
                                <div class="chat-message-content">
                                    <h3> ${data.companion.name} </h3>
                                    <p> ${message.content} </p>
                                </div>
                            </li>`
            document.querySelector('ul.chat-messages').insertAdjacentHTML('beforeend', markup);
        }else {
            const markup = `<li class="chat-user-message" id="#${message._id}">
                                <img class="profile-image" src="${data.user.imageUrl}"> 
                                <button class="delete"> <i class="fa-solid fa-trash" style="color: #ffffff;"></i> </button>
                                <button class="edit"> <i class="fa-solid fa-ellipsis-vertical" style="color: #ffffff;"></i>  </button>
                                <div class="chat-message-content">
                                    <h3> ${data.user.name} </h3>
                                    <p> ${message.content} </p>
                                </div>
                            </li>`
            document.querySelector('ul.chat-messages').insertAdjacentHTML('beforeend', markup);
        }
    });
    const ul = document.querySelector('ul.chat-messages');
    ul.scrollTop = ul.scrollHeight;
}

function goToChat(id) {
    poolChat(id);
    document.querySelector('div.chat-container').innerHTML = ''
    fetch(`http://localhost:3000/api/chats/${id}`, {method:'GET'}).then(res => {
        return res.json()
    }).then(data => {
        showChat(data);
    }).catch(error => {
        console.log(error);
    });
}

function renderChats() {
    clearHeader();
    clearOptions();
    document.querySelector('div.content-container').innerHTML = ''
    document.querySelector('div.content-container').insertAdjacentHTML('beforeend','<div class="chat-container"></div>');
    document.querySelector('div.options').innerHTML = ''
    document.querySelector('div.options').insertAdjacentHTML('beforeend', '<h3>Chats:</h3>')
    const markup = `
        <div class="chats-menu">
            <ol></ol>
        </div>
    `
    document.querySelector('div.options').insertAdjacentHTML('beforeend', markup)
    fetch('http://localhost:3000/api/chats', {method: 'GET'}).then(res => {
        return res.json();
    }).then(data => {
        data.chats.forEach(chat => {
            const markup = `<li>
                                <button onclick="goToChat('${chat._id}')">
                                    <img class="chat-user-image" src="${chat.companionImageUrl}">
                                    <p>${chat.companion}</p>
                                </button>
                            </li>`
            document.querySelector('ol').insertAdjacentHTML('beforeend', markup);
        });
    }).catch(error => {
        console.log(error);
        document.location.href = '/login'
    });
}

function renderStatistics() {
    clearHeader();
    clearOptions();
    fetch('http://localhost:3000/api/statistics', {method: 'GET'}).then(res => {
        return res.json();
    }).then(data => {
        showStatistics(data.posts);
    }).catch(error => {
        console.log(error);
        document.location.href = '/login'
    });
}

function renderFriends() {
    clearHeader();
    clearOptions();
    fetch('http://localhost:3000/api/friends', {method: 'GET'}).then(res => {
        return res.json()
    }).then(data => {
        showFriendRequests(data.requests);
        showAuthors(data.authors);
    }).catch(error => {
        console.log(error);
        document.location.href = '/login'
    });
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
            <button class="toolbar-user" onclick="renderProfile('${user.id}')"> ${user.name} </button>
            <button class="toolbar-button" onclick="renderChats()"><i class="fa-solid fa-envelope" style="color: #ffffff;"></i> Chats </button>
            <button class="toolbar-button" onclick="renderArchive()"><i class="fa-solid fa-inbox" style="color: #ffffff;"></i> Archive </button>
            <button class="toolbar-button" onclick="renderStatistics()"><i class="fa-solid fa-chart-simple" style="color: #ffffff;"></i> Statistics </button>
            <button class="toolbar-button" onclick="renderFriends()"><i class="fa-solid fa-user-group" style="color: #ffffff;"></i> Friends </button>
            <div class="spacer"></div>
            <button class="logout-button" onclick="routeToLoginWithLogout()"> Logout </button>`
            document.querySelector('div.toolbar').insertAdjacentHTML('beforeend', markup);
        });
    } else {
        const markup = `<img class="toolbar-image" src="./../images/duck.png">
        <button class="toolbar-user" href="/login"> Unauthorized duck </button>
        <button class="toolbar-button" onclick="renderChats()"><i class="fa-solid fa-envelope" style="color: #ffffff;"></i> Chats </button>
        <button class="toolbar-button" onclick="renderArchive()"><i class="fa-solid fa-inbox" style="color: #ffffff;"></i> Archive </button>
        <button class="toolbar-button" onclick="renderStatistics()"><i class="fa-solid fa-chart-simple" style="color: #ffffff;"></i> Statistics </button>
        <button class="toolbar-button" onclick="renderFriends()"><i class="fa-solid fa-user-group" style="color: #ffffff;"></i> Friends </button>
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
        .then( data => {
            showPosts(data.posts);
            showPostsOptions(data);
        });
}

function artworkImage(link) {
    window.open(link)
}

function routeToLogin() {
    window.location.href = '/login'
};

function addFriend(id) {
    fetch(`http://localhost:3000/api/friend/${id}`, {method: 'GET'}).then(res => {
        return res.json();
    }).then(data => {
        alert(data.message);
    }).catch(error => {
        console.log(error);
        document.location.href = '/login'
    });
}

function unfriend(id) {
    fetch(`http://localhost:3000/api/unfriend/${id}`, {method: 'DELETE'}).then(res => {
        return res.json();
    }).then(data => {
        alert(data.message);
    }).catch(error => {
        console.log(error);
        document.location.href = '/login'
    });
}

function renderProfile(id) {
    clearHeader();
    clearOptions();
    fetch(`http://localhost:3000/api/authors/${id}`, {method: 'GET'}).then(res => {
        return res.json()
    }).then(data => {
        console.log(data.user.currentUser);
        let topRated = ''
        if(data.user.topRated === true) {
            topRated = '<a class="top-rated">Top rated artist</a>'
        }
        let friendButton = ''
        console.log(data.user);
        if(data.user.friendButton === 'Friend') {
            friendButton = `<button class="post-footer-button" style="height:50px; margin-top:5px; margin-left:0;" onclick="addFriend('${data.user._id}')"> <i class="fa-solid fa-user-plus" style="color: #ffffff;"></i> </button>`
        } else if(data.user.friendButton === 'Unfriend') {
            friendButton = `<button class="post-footer-button" style="height:50px; margin-top:5px; margin-left:0;"  onclick="unfriend('${data.user._id}')"> <i class="fa-solid fa-user-xmark" style="color: #ffffff;"></i> </button>`
        } else if(data.user.friendButton === 'Requested') {
            friendButton = `<button class="post-footer-button" style="height:50px; margin-top:5px; margin-left:0;"> <i class="fa-solid fa-user-tag" style="color: #ffffff;"></i> </button>`
        }
        const html = `<div class="profile-header-content">
                        <div class="profile-header">
                            <img class="profile-image" src="${data.user.imageUrl}"> 
                            <div class="profile-content">
                                <a class="profile-content-author">${data.user.name}</a>
                                ${topRated}
                            </div>
                        </div>
                        <div class="profile-footer">
                            <button class="category-content-button"><i class="fa-solid fa-inbox" style="color: #ffffff;"></i>${data.user.posts} Artworks</button>
                            <button class="category-content-button"><i class="fa-solid fa-user-group" style="color: #ffffff;"></i>${data.user.friends} Friends</button>
                            <div id="freind-request">
                                ${friendButton}
                            </div>
                        </div>
                    </div>
                    <ul></ul>
                    `
        let archive = '<button class="post-footer-archive"><img src="./../images/archive.png"></button>'
        if (data.user.currentUser) {
            archive = `<button class="post-footer-archive"> <i class="fa-solid fa-trash" style="color: #ffffff;"></i> </button>`
        }
        document.querySelector('div.content-container').insertAdjacentHTML('afterbegin', html);
        showPosts(data.posts);
        showPostsOptions(data);
    }).catch(error => {
        console.log(error);
        document.location.href = '/login'
    });
}

function showPosts(posts) {
    posts.forEach(element => {
        const date = new Date(element.date);
        const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        const markup = `<li class="post" id="${element._id}">
                            <div class="post-author"> 
                                <img target="_blank" src="${element.authorImageUrl}"> 
                                <div class="post-links">
                                    <a class="post-links-author" onclick="renderProfile('${element.authorId}')"> ${element.author} </a>
                                    <p> ${date.toLocaleDateString("en-US", dateOptions)} </p>
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
                                <img src="${element.imageUrl}" target="_blank">
                            </div>
                            <div class="post-footer">
                                <button class="post-footer-button" id="${`${element._id}-like`}" onclick="likePost('${element._id}')"><i class="fa-solid fa-fire" style="color: #ffffff;"></i><p>${element.likes}</p></button>
                                <button class="post-footer-button"><i class="fa-regular fa-comment" style="color: #ffffff;"></i><p>${element.comments.length}</p></button>
                                <button class="post-footer-archive" onclick="archivePost('${element._id}')"><i class="fa-solid fa-inbox" style="color: #ffffff;"></i></button>
                            </div>
                        </li>`
        document.querySelector('ul').insertAdjacentHTML('beforeend', markup);
    });
};

function showStatistics(posts) {
    posts.forEach(element => {
        const date = new Date(element.date);
        const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        const top = element.topIndex > 0 ? `<p class="statistics-post-top">Top#${element.topIndex}</p>` : ''
        const markup = `<li class="statistics-post">
                            <div class="statistics-post-content">
                                <h2> ${element.title} </h2>
                                <p>${element.category}, ${element.style}, ${element.genre}, ${element.technique}</p>
                                <div class="statistics-post-stats">
                                    <button class="statistics-footer-button"><i class="fa-solid fa-fire" style="color: #ffffff;"></i><p>${element.likes}</p></button>
                                    <button class="statistics-footer-button"><i class="fa-regular fa-comment" style="color: #ffffff;"></i><p>${element.comments}</p></button>
                                    ${top}
                                    <p> ${date.toLocaleDateString("en-US", dateOptions)} </p>
                                </div>
                            </div>
                            <img src="${element.imageUrl}">
                        </li>`
        document.querySelector('ul').insertAdjacentHTML('beforeend', markup);
    });
}

function showAuthors(authors) {
    authors.forEach(element => {
        let topRated = ''
        if(element.topRated === true) {
            topRated = '<a class="top-rated">Top rated artist</a>'
        }
        const markup = `<li class="profile">
                            <div class="profile-header">
                                <img class="profile-image" src="${element.imageUrl}"> 
                                <div class="profile-content">
                                    <a class="profile-content-author" onclick="renderProfile('${element._id}')">${element.name}</a>
                                    ${topRated}
                                </div>
                            </div>
                            <div class="profile-footer">
                                <div class="category-content-button"><i class="fa-solid fa-inbox" style="color: #ffffff;"></i>${element.posts} Artworks</div>
                                <div class="category-content-button"><i class="fa-solid fa-user-group" style="color: #ffffff;"></i>${element.friends} Friends</div>
                            </div>
                        </li>`
        document.querySelector('ul').insertAdjacentHTML('beforeend', markup);
    });
}

function clearOptions() {
    document.querySelector('div.options').innerHTML = ''
    document.querySelector('div.options').insertAdjacentHTML('beforeend', '<h3>Options:</h3><div class="options-section" id="options-bar"></div>')
}

function showPostsOptions(doc) {
    document.getElementById('options-bar').innerHTML = '';
    let optionsMarkup = `<button class="create-post-button" onclick="routeToNewPost()"> Create Post </button>
                                <h4> Filter: </h4>
                                <select name="category-filter" id="category-select">
                                <option value="">--Category--</option>
                                `
    doc.categoryOptions.forEach(option => {
        optionsMarkup += `<option value="${option}">${option}</option>`
    });
    optionsMarkup += '</select>'
    optionsMarkup += `<select name="style-filter" id="style-select" required>
                        <option value="">--Style--</option>
                    `
    doc.styleOptions.forEach(option => {
        optionsMarkup += `<option value="${option}">${option}</option>`
    });
    optionsMarkup += '</select>'
    optionsMarkup += `<select name="genre-filter" id="genre-select" required>
                        <option value="">--Genre--</option>
                    `
    doc.genreOptions.forEach(option => {
        optionsMarkup += `<option value="${option}">${option}</option>`
    });
    optionsMarkup += '</select>'
    optionsMarkup += `<select name="technique-filter" id="technique-select" required>
                        <option value="">--Technique--</option>
                    `
    doc.techniqueOptions.forEach(option => {
        optionsMarkup += `<option value="${option}">${option}</option>`
    });
    optionsMarkup += '</select>'
    optionsMarkup += `<button class="apply-button"> Apply </button>
                     <button class="clear-button"> Clear </button>`
    document.querySelector('div.options-section').insertAdjacentHTML('beforeend', optionsMarkup)
}

function likePost(id) {
    fetch(`http://localhost:3000/api/posts/${id}/like`, {method: 'GET'}).then(res => {
        return res.json()
    }).then(element => {
        const post = document.getElementById(element._id);
        post.innerHTML = ''
        const date = new Date(element.date);
        const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        const markup = `<div class="post-author"> 
                            <img target="_blank" src="${element.authorImageUrl}"> 
                            <div class="post-links">
                                <a class="post-links-author" href=""> ${element.author} </a>
                                <p> ${date.toLocaleDateString("en-US", dateOptions)} </p>
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
                            <img src="${element.imageUrl}" target="_blank">
                        </div>
                        <div class="post-footer">
                        <button class="post-footer-button" id="${`${element._id}-like`}" onclick="likePost('${element._id}')"><i class="fa-solid fa-fire" style="color: #ffffff;"></i><p>${element.likes}</p></button>
                        <button class="post-footer-button"><i class="fa-regular fa-comment" style="color: #ffffff;"></i><p>${element.comments.length}</p></button>
                        <button class="post-footer-archive"><i class="fa-solid fa-inbox" style="color: #ffffff;"></i></button>
                        </div>`
        document.getElementById(element._id).insertAdjacentHTML('beforeend', markup); 
    }, error => {
        document.location.href = '/login'
    });
}

function archivePost(id) {
    fetch(`http://localhost:3000/api/posts/archive/${id}`, {method: 'GET'}).then(res => {
        return res.json()
    }).then(data => {
        alert(data.message);
    }, error => {
        document.location.href = '/login'
    });
}

function unarchivePost(id) {
    fetch(`http://localhost:3000/api/posts/archive/${id}`, {method: 'DELETE'}).then(res => {
        return res.json()
    }).then(data => {
        alert(data.message);
    }, error => {
        document.location.href = '/login'
    });
}

function renderArchive() {
    clearHeader();
    clearOptions();
    fetch(`http://localhost:3000/api/archive/`, {method: 'GET'}).then(res => {
        return res.json()
    }).then(data => {
        showArchivePosts(data.posts);
        showPostsOptions(data);
    }, error => {
        document.location.href = '/login'
    });
}

function showArchivePosts(posts) {
    posts.forEach(element => {
        const date = new Date(element.date);
        const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        const markup = `<li class="post" id="${element._id}">
                            <div class="post-author"> 
                                <img target="_blank" src="${element.authorImageUrl}"> 
                                <div class="post-links">
                                    <a class="post-links-author" onclick="renderProfile('${element.authorId}')"> ${element.author} </a>
                                    <p> ${date.toLocaleDateString("en-US", dateOptions)} </p>
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
                                <img src="${element.imageUrl}" target="_blank">
                            </div>
                            <div class="post-footer">
                                <button class="post-footer-button" id="${`${element._id}-like`}" onclick="likePost('${element._id}')"><i class="fa-solid fa-fire" style="color: #ffffff;"></i><p>${element.likes}</p></button>
                                <button class="post-footer-button"><i class="fa-regular fa-comment" style="color: #ffffff;"></i><p>${element.comments.length}</p></button>
                                <button class="post-footer-archive" onclick="unarchivePost('${element._id}')"><i class="fa-solid fa-inbox" style="color: #ffffff;"></i></button>
                            </div>
                        </li>`
        document.querySelector('ul').insertAdjacentHTML('beforeend', markup);
    });
};

function acceptFriendRequest(id) {
    fetch(`http://localhost:3000/api/friend-requests/${id}/accept`, {method: 'GET'}).then(res => {
        return res.json();
    }).then(data => {
        alert(data.message);
    }).catch(error => {
        console.log(error);
        document.location.href = '/login'
    });
}

function denyFriendRequest(id) {
    fetch(`http://localhost:3000/api/friend-requests/${id}/deny`, {method: 'GET'}).then(res => {
        return res.json();
    }).then(data => {
        alert(data);
    }).catch(error => {
        console.log(error);
        document.location.href = '/login'
    });
}

function showFriendRequests(requests) {
    requests.forEach(element => {   
        const markup = `<li class="profile" id="${element._id}">
                            <div class="profile-header">
                                <img class="profile-image" src="${element.senderImageUrl}"> 
                                <div class="profile-content">
                                    <a class="profile-content-author" onclick="renderProfile('${element.senderId}')">${element.sender}</a>
                                    <p> Wants to be a friends </p>
                                </div>
                            </div>
                            <div class="profile-footer">
                                <button class="post-footer-button" style="height:50px; margin-top:5px; margin-left:0;" onclick="acceptFriendRequest('${element._id}')"> <i class="fa-solid fa-check" style="color: #ffffff;"></i> </button>
                                <button class="post-footer-button" style="height:50px; margin-top:5px; margin-left:10px;" onclick="denyFriendRequest('${element._id}')"> <i class="fa-solid fa-xmark" style="color: #ffffff;"></i> </button>
                            </div>
                        </li>`
        document.querySelector('ul').insertAdjacentHTML('beforeend', markup);
    });
}