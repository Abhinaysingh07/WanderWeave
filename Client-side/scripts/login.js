// login and signup rendering script
const closeBtns = document.querySelectorAll(".signupContainer .close,.loginConatiner .close");
const signupLink = document.getElementsByClassName("signup-link")[1];
const loginLink = document.getElementsByClassName("signup-link")[3];
const loginBtns = document.querySelectorAll(".login-button");
const loginSubmitBtn = document.getElementsByClassName("login-submit-button")[0];
closeBtns.forEach((button) => {
    button.addEventListener("click", () => {
        signupContainer.style.display = "none";//dont know why but signupContainer and loginContainer running without declaring
        loginConatiner.style.display = "none";
    });
});
loginBtns.forEach((button) => {
    button.addEventListener("click", () => {
        loginConatiner.style.display = "block";
    });
});
signupLink.addEventListener("click", () => {
    loginConatiner.style.display = "none";
    signupContainer.style.display = "block";
});
loginLink.addEventListener("click", () => {
    signupContainer.style.display = "none";
    loginConatiner.style.display = "block";
});


// Get references to the user icon and the user sidebar
const userIcon = document.getElementById("user-icon");
const userSidebar = document.getElementById("user-sidebar");

// Add a click event listener to the user icon
userIcon.addEventListener("click", () => {
    // Toggle the sidebar's visibility by changing its left position
    if (userSidebar.style.top === "12rem") {
        userSidebar.style.top = "-30rem";
    } else {
        userSidebar.style.top = "12rem";
    }
});




// Check if the user is already logged in when the page loads
window.addEventListener("load", () => {
    // Retrieve the userData from localStorage
    const userDataJSON = localStorage.getItem("userData");
    let userData;
    if (userDataJSON) {
        userData = JSON.parse(userDataJSON);
    }

    if (userData && userData.isLoggedIn === true) {
        document.querySelector('.fa-user').style.display = "inline";
        // Update the username and phone when the DOM is fully loaded
        console.log(userData.username)
        console.log(userData.phone)
        document.getElementById('username').innerText = userData.username;
        document.getElementById('userphone').innerText = userData.phone;

        signupContainer.style.display = "none";
        loginConatiner.style.display = "none";
    }
});

//network req on login button submit
loginSubmitBtn.addEventListener("click", () => {
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('pass').value;
    const requestData = { phone, password };

    fetch('http://localhost:5500/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
    })
        .then(res => {
            // If the response is successful, parse the JSON response to get the JWT token
            return res.json();
        })
        .then(data => {
            console.log(data);
            // Automatically hide the message after 3 seconds (3000 
            if (data.message == "Login successful") {

                loginConatiner.style.display = "none";

                // Store other user data in a single object
                const userData = {
                    isLoggedIn: true,
                    username: data.username,
                    phone: data.phone
                };

                const userDataJSON = JSON.stringify(userData); // Convert the object to a JSON string

                // Save the JSON string in localStorage
                localStorage.setItem('userData', userDataJSON);

                location.reload(); //refresh the page 

            }
        })
        .catch(error => {
            console.error('Request failed:', error);
        });
});

const logoutButton = document.getElementById("logout-button");
logoutButton.addEventListener("click", () => {
    // Remove user data from local storage
    localStorage.removeItem("userData");
    // Reload the page after a short delay to ensure data removal
    setTimeout(() => {
        location.reload();
    }, 200);
});

