function mask() {
  var x = document.getElementById("switch");
  var y = document.getElementById("switch1");
  if (x.style.display == "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
  if (y.style.display == "none") {
    y.style.display = "block";
  } else {
    y.style.display = "none";
  }
  toggleAnimation()
}
function noButton() {
  var back = document.getElementById("back");
  var start = document.getElementById("start");
  var start2 = document.getElementById("start2");
  const timer = document.getElementById('timer');
  start2.classList.toggle('poof');
  setTimeout(() => {
    back.classList.toggle('fade-out');
    start.classList.toggle('fade-out');
  }, 1000);
  setTimeout(() => {
    back.classList.toggle('poof');
    start.classList.toggle('poof');
  }, 3000);
  setTimeout(() => {
    timer.classList.toggle('fade-in');
  }, 5000);
  
}

function backButton(){
  var back = document.getElementById("back");
  var start = document.getElementById("start");
  var start2 = document.getElementById("start2");
  const text = document.getElementById('animatedText');
  const forward = document.getElementById('forward');
  setTimeout(() => {
    back.classList.toggle('fade-out');
    start.classList.toggle('fade-out');
    start2.classList.toggle('fade-out');
  }, 1000);
  setTimeout(() => {
    back.classList.toggle('poof');
    start.classList.toggle('poof');
    start2.classList.toggle('poof');
  }, 3000);
  setTimeout(() => {
    text.classList.toggle('tadah');
    text.classList.remove('fade-out')
    text.classList.add('fade-in');
    forward.classList.remove('poof');
    forward.classList.add('tadah');
    forward.classList.remove('fade-out');
    forward.classList.add('fade-in');
  }, 4000);
  
}

function forwardButton(){
  var back = document.getElementById("back");
  var start = document.getElementById("start");
  var start2 = document.getElementById("start2");
  const text = document.getElementById('animatedText');
  const forward = document.getElementById('forward');
  setTimeout(() => {
    text.classList.toggle('fade-out');
    forward.classList.toggle('fade-out');
  }, 1000);
  setTimeout(() => {
    text.classList.remove('tadah');
    text.classList.add('poof');
    forward.classList.toggle('poof');
  }, 3000);
  setTimeout(() => {
    back.classList.toggle('tadah');
    start.classList.toggle('tadah');
    start2.classList.toggle('tadah');
    back.classList.remove('fade-out')
    start.classList.remove('fade-out')
    start2.classList.remove('fade-out')
    back.classList.add('fade-in');
    start.classList.add('fade-in');
    start2.classList.add('fade-in');
  }, 5000);
}
let timeLeft = 304; // 5 minutes in seconds extra 4 seconds for transition times
function startTimer() {
    noButton()
    const countdown = setInterval(function() {
    const minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    if (seconds < 10){
      seconds = '0' + seconds;
    }
    document.getElementById('timer').innerHTML = `${minutes}:${seconds}`;
    if (timeLeft <= 0) {
        clearInterval(countdown);
        document.getElementById('timer').innerHTML = 'Time is up!';
    } else {
          timeLeft--;
    }
  }, 1000);
}
      
function toggleAnimation() {
  const text = document.getElementById('animatedText');
  const text1 = document.getElementById('start');
  const text3 = document.getElementById('start2');
  const back = document.getElementById('back');
  text.classList.toggle('fade-in');
  setTimeout(() => {
      text.classList.toggle('fade-out');
  }, 45000);
  setTimeout(() => {
    text.classList.toggle('poof');
}, 47000);
  setTimeout(() => {
      text1.classList.toggle('fade-in');
      text3.classList.toggle('fade-in');
      back.classList.toggle('fade-in')
  }, 48000);

}
function hidden1() {
    var x = document.getElementById("hidden");
    var y = document.getElementById("hidden1");
    if (x.style.display == "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
    if (y.style.display == "none") {
      y.style.display = "block";
    } else {
      y.style.display = "none";
    }
  }
function hidden2() {
    var x = document.getElementById("hidden1");
    var y = document.getElementById("hidden2");
    if (x.style.display == "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
    if (y.style.display == "none") {
      y.style.display = "block";
    } else {
      y.style.display = "none";
    }
}
function hidden3() {
    var x = document.getElementById("hidden2");
    var y = document.getElementById("hidden3");
    if (x.style.display == "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
    if (y.style.display == "none") {
      y.style.display = "block";
    } else {
      y.style.display = "none";
    }
}
function hidden4() {
    var x = document.getElementById("hidden3");
    var y = document.getElementById("hidden4");
    if (x.style.display == "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
    if (y.style.display == "none") {
      y.style.display = "block";
    } else {
      y.style.display = "none";
    }
}
function hidden5() {
    var x = document.getElementById("hidden4");
    var y = document.getElementById("hidden5");
    if (x.style.display == "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
    if (y.style.display == "none") {
      y.style.display = "block";
    } else {
      y.style.display = "none";
    }
}
function hidden6() {
    var x = document.getElementById("hidden5");
    var y = document.getElementById("hidden6");
    if (x.style.display == "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
    if (y.style.display == "none") {
      y.style.display = "block";
    } else {
      y.style.display = "none";
    }
}
function hidden7() {
    var x = document.getElementById("hidden6");
    var y = document.getElementById("hidden7");
    if (x.style.display == "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
    if (y.style.display == "none") {
      y.style.display = "block";
    } else {
      y.style.display = "none";
    }
}
