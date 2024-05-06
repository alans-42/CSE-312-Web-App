function refresh(){
  refreshPosts();
  updateQuote();
}

function openNav(){
    document.getElementById("navbar").style.width = "200px";
}

function closeNav(){
    document.getElementById("navbar").style.width = "0px";
}

function refreshPosts(){
  const request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            var forum = document.getElementById("forum");
            forum.innerHTML = "";
            const posts = JSON.parse(this.response);
            for (var post of posts) {
                makePost(post);
                // console.log(post);
                for (var comment of post['comments']){
                  // console.log(comment);
                  postComment(comment, post['postId']);
                }
            }
        }
    }
    request.open("GET", "/send-post");
    request.send();
}

function getTime(){
  var day = new Date();
  var hour = day.getHours();
  var min = day.getMinutes();
  var period = "am";
  if (hour >= 12){
    var hour = hour-12;
    var period = "pm";
  } else if (hour == 0){
    var hour = hour+12;
  } 
  if (min < 10){
    min = "0" + min.toString();
  }
  var time = hour + ':' + min + period;
  return time;
}

// Work in progress
function likeMsg(){
  console.log("Hitting likeMsg");
  var likes = document.getElementById("likes");
  likes.value = (parseInt(likes) + 1).toString();
}

function postComment(commentData, postId){
  var forum = document.getElementById("box_" + postId);
  var username = commentData['username'];
  var comment = commentData['comment'];
  forum.outerHTML += "<div class='comment-box'>" + username + ": " + comment + "</div>";
  forum.scrollTop = forum.scrollHeight - forum.clientHeight;
}

function sendComment(postId){
  var comment = document.getElementById('comment_' + postId);
  var boxer = document.getElementById('comment_box_' + postId);
  boxer.hidden = true;
  // var request = new XMLHttpRequest();
  // request.onreadystatechange = function () {
  //     if (this.readyState === 4 && this.status === 200) {
  //         console.log(this.response);
  //     }
  // }
  var commentJSON = {"comment": comment.value, "post_id": postId};
  // request.open("POST", "/send-comment");
  // request.send(JSON.stringify(commentJSON));
  // setTimeout(refreshPosts, 100);
  socket.emit('my comment',commentJSON);
  document.getElementById("button_" + postId).hidden = false;

}

function comment(postId){
  document.getElementById("button_" + postId).hidden = true;
  var forum = document.getElementById("box_" + postId);
  commentField = "<div class='comment-box' id='comment_box_" + postId +"'>" + 
                  "Comment: <input id='comment_" + postId + "' type='text'  maxlength='100' size='50'></input>" +
                  "<button onclick='sendComment(" + postId + ")'>Post</button></div>";

  forum.outerHTML += commentField
  forum.scrollTop = forum.scrollHeight - forum.clientHeight;
}

function makePost(post){
    var forum = document.getElementById("forum");
    var username = post['username']
    var forumData = post['post'];
    var time = post['time'];
    var pic = post['pic'];
    // var likes = post['likes'];
    var postId = post['postId'];
    forum.innerHTML += "<br><div class='forum-box' id='box_" + postId + "'>" + 
                        "<span id=message_" + postId + " style='font-size: 20px'>" + 
                            "<div style='float:left; padding-right: 8px'><img src='/uploads/" + pic + "' width='100%' height='69px' style='border:1px solid black'></div>" +
                            username +": " + forumData + "<br>" + 
                            "<a style='font-size: 12px'>Posted: " + time + "</a><br>" + 
                            // "<button id='like-button' onclick='likeMsg()'>Like</button> <a style='font-size: 12px'>Likes: " + likes + "</a></a>" +  
                            "<button id= 'button_" + postId + "' onclick='comment(" + postId + ")' style='font-size: 12px; color: Blue; background:none; border:none;'><u>Comment</u></button>" +
                        "</span></div>";
    // hsghcvevcghevcghvegrhgehjgjegejwhgrhjgewhjrgewhjgrhjewgrjhgewjhrgewhjgrhjewgrjhgewhjrgejwhgrhjwegrhjgewhjrgdshjgfhjgdshjfgdshjfghjdsgfhjdsgfhjsgfhjgsdhjfgjhdsgfhjdsghjfgdsjhfgjdshfjhfhhvjhhvjskahfjkgs
    forum.scrollIntoView(false);
    forum.scrollTop = forum.scrollHeight - forum.clientHeight;
}

function sendPost(){
  var forumInput = document.getElementById("forum-input");
  var forumData = forumInput.value;
  var time = getTime();
  forumInput.value = "";

  // var request = new XMLHttpRequest();
  // request.onreadystatechange = function () {
  //     if (this.readyState === 4 && this.status === 200) {
  //         console.log(this.response);
  //     }
  // }
  var postJSON = {"post": forumData, "time_posted": time};
  return postJSON;
  // request.open("POST", "/send-post");
  // request.send(JSON.stringify(postJSON));
  // setTimeout(refreshPosts, 100);
}
function delayPost(){
  var timeInput = document.getElementById("schedule-input");
  var textInput = document.getElementById("schedule-time");
  var textData = textInput.value;
  var timeData = timeInput.value;
  textInput.value = "";
  timeInput.value = "";
  var postJSON = {"post":textData, "time":timeData}
  return postJSON;
}

function makeDelayPost(post){
  var forum = document.getElementById("sched");
  var username = post['username']
  var forumData = post['post'];
  var time = post['time'];
  var pic = post['pic'];
  var postId = post['postId'];
  forum.innerHTML += "<br><div class='forum-box' id='box_" + postId + "'>" + 
                      "<span id=message_" + postId + " style='font-size: 20px'>" + 
                          "<div style='float:left; padding-right: 8px'><img src='/uploads/" + pic + "' width='100%' height='69px' style='border:1px solid black'></div>" +
                          username +": " + forumData + "<br>" + 
                          "<a style='font-size: 12px'>Posted: " + time + "</a><br>" + 
                          "<button id= 'button_" + postId + "' onclick='comment(" + postId + ")' style='font-size: 12px; color: Blue; background:none; border:none;'><u>Comment</u></button>" +
                      "</span></div>";
  forum.scrollIntoView(false);
  forum.scrollTop = forum.scrollHeight - forum.clientHeight;
}

function clearSchedule(){
  var forum = document.getElementById("sched");
  forum.innerHTML = "";
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
// This funtion is to clear search bar
function clear(){
  const chatTextBox = document.getElementById("food-text-box");
  chatTextBox.value = "";
}

// hi


// Quote Functionality
const quotes = [
  { text: "Big arm is my dream but not anymore. You feel me.", author: "Junpeng" },
  { text: "It's not a good day until you had a good run!", author: "Alan" },
  { text: "Subsribe to Clinq on YT", author: "Cayden" },
  { text: "No matter how hard things get, you can always count on your teammates.", author: "Luke" },
  { text: "To be or Not to be, that is the question!", author: "Darius" },
  { text: "The only limit to the height of your achievements is the reach of your dreams and your willingness to work for them", author: "Michelle Obama" }
];

function getRandomQuote() {
  const index = Math.floor(Math.random() * quotes.length);
  return quotes[index];
}

function updateQuote() {
  const dailyQuote = getRandomQuote();
  document.getElementById("quote-text").textContent = `"${dailyQuote.text}"`;
  document.getElementById("quote-author").textContent = `- ${dailyQuote.author}`;
}


// here is for the schedule post ----------------

function schedulePost() {
    var forumInput = document.getElementById("forum-input");
    var postData = forumInput.value.trim();
    var scheduleTime = document.getElementById("schedule-time").value;
    forumInput.value = '';

    if (postData && scheduleTime) {
        var scheduleDate = new Date(scheduleTime);
        var now = new Date();
        var delay = scheduleDate - now;

        if (delay > 0) {

            addScheduledPostToUI(postData, scheduleTime, delay);
            setTimeout(function() {
                socket.emit('my post', {
                    post: postData,
                    time_posted: getTime(),
                    schedule_time: scheduleTime
                });
            }, delay);
        } else {
            alert("pick a future time");
        }
    } else {
        alert("you forgot your message and time");
    }
}





document.addEventListener('DOMContentLoaded', function() {
    var scheduleButton = document.getElementById('schedule-button');
    if (scheduleButton) {
        scheduleButton.addEventListener('click', schedulePost);
    } else {
        console.error('nothing find ');
    }

});



function addScheduledPostToUI(post, time, delay) {
    var scheduledPostsArea = document.getElementById("scheduled-posts-area");
//  var scheduledPostsArea = document.getElementById("forum");
    var postElement = document.createElement("div");
    var countdownTimer = document.createElement("span");
    countdownTimer.id = "timer-" + Math.random().toString(36).substr(2, 9);
    postElement.innerHTML = `Scheduled post at ${time}: ${post} - `;
    postElement.appendChild(countdownTimer);
    scheduledPostsArea.appendChild(postElement);


    startCountdown(countdownTimer.id, delay);
}

function startCountdown(timerId, delay) {
    var timerElement = document.getElementById(timerId);
    var endTime = Date.now() + delay;
    var interval = setInterval(function() {
        var msLeft = endTime - Date.now();
        if (msLeft <= 0) {
            timerElement.innerHTML = 'Posting now...';
            clearInterval(interval);
        } else {
            var seconds = Math.floor(msLeft / 1000) % 60;
            var minutes = Math.floor(msLeft / 60000) % 60;
            var hours = Math.floor(msLeft / 3600000);
            timerElement.innerHTML = `${hours}h ${minutes}m ${seconds}s remaining`;
        }
    }, 1000);
}


