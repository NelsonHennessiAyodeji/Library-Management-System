const baseURL = 'http://localhost:3000';

const homePageName = document.getElementById("name");
const logoutTab = document.getElementById("logout");

async function logout() {
    const res  = await fetch(`${baseURL}/auth/logout`, {
        method: 'GET', 
        credentials: 'include'
    });
    
    if (res.ok) {
        window.location = 'login.html';
        alert("Logout successful");
    } else {
        alert("OMom");
    }
}

async function authorize() {
    try {
        const res  = await fetch(`${baseURL}/users/showMe`, {
            method: 'GET', 
            credentials: 'include'
        });

        data = await res.json();
        
        if (res.ok) {
            if (homePageName != null) {
                homePageName.innerHTML = data.userName;
            }
            if (data.userRole === 'admin') {
                const nav = document.querySelector('.nav-right');
                nav.innerHTML += `<li id="adminTab"><a href="/adminPanel.html">Admin Panel</a></li>`;
                // console.log("Admin is true");
            }
            console.log(data);
            window.localStorage.setItem("userId", data.userId);
        } else {
            window.location.href = 'login.html';
            // console.log(data);
        }
    } catch (error) {
        // window.location.href = 'login.html';
        // alert("You have to log in to proceed");
        throw error
    }
}

authorize();