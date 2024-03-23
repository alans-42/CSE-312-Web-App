function openNav(){
    document.getElementById("navbar").style.width = "200px";
}

function closeNav(){
    document.getElementById("navbar").style.width = "0px";
}

function submit_username(){
    document.getElementById("username_form").style.width = "0px"
}

function show_window(){
    document.getElementById("alerts").style.display = "block";
}

function no_window(){
    document.getElementById("alerts").style.display = "none";
}


//live password validaiton
function validate_pass(){
  var valid = 0;
    // Validate lowercase letters
  var lowerCaseLetters = /[a-z]/g;
  if(password.value.match(lowerCaseLetters)) {
    letter.classList.remove("invalid");
    letter.classList.add("valid");
    valid += 1;
  } else {
    letter.classList.remove("valid");
    letter.classList.add("invalid");
  }

  // Validate capital letters
  var upperCaseLetters = /[A-Z]/g;
  if(password.value.match(upperCaseLetters)) {
    capital.classList.remove("invalid");
    capital.classList.add("valid");
    valid += 1;
  } else {
    capital.classList.remove("valid");
    capital.classList.add("invalid");
  }

  // Validate numbers
  var numbers = /[0-9]/g;
  if(password.value.match(numbers)) {
    number.classList.remove("invalid");
    number.classList.add("valid");
    valid += 1;
  } else {
    number.classList.remove("valid");
    number.classList.add("invalid");
  }
  // validate special chars
  var spec = /[$&+,:;=?@#|'<>^*()%!-]/g;
  if(password.value.match(spec)) {
    special.classList.remove("invalid");
    special.classList.add("valid");
    valid += 1;
  } else {
    special.classList.remove("valid");
    special.classList.add("invalid");
  }
  var length = document.getElementById("length");
  // Validate length
  if(password.value.length >= 8) {
    length.classList.remove("invalid");
    length.classList.add("valid");
    valid += 1;
  } else {
    length.classList.remove("valid");
    length.classList.add("invalid");
  }
  var pass_button = document.getElementById("pass_button");
  if(valid===5 && password2.value === password.value){
    pass_button.removeAttribute("hidden");
  }else{
    pass_button.setAttribute("hidden","");
  }
}
// this is the function for the show pass check box
function show_pass(){
    var type_txt = document.getElementById("password");
    var type_txt2 = document.getElementById("password2");
    if (type_txt.type === "password" && type_txt2.type === "password"){
        type_txt.type = "text";
        type_txt2.type= "text";
    }else{
        type_txt.type = "password";
        type_txt2.type = "password";
    }
}
