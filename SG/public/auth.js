// Check login status
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // Login success
      document.body.style.backgroundColor = "transparent";
      document.getElementById("logged-in-elements").style.display = "block";
      document.getElementById("login-form-container").style.display = "none";
    } else {
      // Login Fail
      document.body.style.backgroundColor = "";
      document.getElementById("logged-in-elements").style.display = "none";
      document.getElementById("login-form-container").style.display = "block";
    }
  });
  
  // Event submit of login form
  document.getElementById("login-form").addEventListener("submit", function(event) {
    event.preventDefault();
  
    // get data
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
  
    // call Firebase Authentication
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(function(userCredential) {
        // success login
        var user = userCredential.user;
        console.log("Login sucess: ", user);
      })
      .catch(function(error) {
        // error
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log("Login error:", errorMessage);
      });
  });
  
  // event logout
  document.getElementById("logout-button").addEventListener("click", function() {
    firebase.auth().signOut().then(function() {
      // Logout success
      console.log("Logout success");
    }).catch(function(error) {
      // Logout error
      console.log("Logout error:", error);
    });
  });