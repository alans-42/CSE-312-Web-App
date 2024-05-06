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
  var start5 = document.getElementById("start5");
  var start2 = document.getElementById("start2");
  var start3 = document.getElementById("start3");
  var start4 = document.getElementById("start4");
  back.style.display = "none";
  start2.style.display = "none";
  start3.style.display = "none";
  start4.style.display = "none";
  
  setTimeout(() => {
    back.classList.add('fade-out1');
    start2.classList.add('fade-out1');
    start3.classList.add('fade-out1');
    start4.classList.add('fade-out1');
  }, 10);
  setTimeout(() => {
    back.classList.toggle('fade-out');
    start.classList.toggle('fade-out');
    start5.classList.toggle('fade-out');
  }, 1000);
  setTimeout(() => {
    back.classList.toggle('poof');
    start.classList.toggle('poof');
  }, 3000);
  
}

function backButton(){
  var back = document.getElementById("back");
  var start = document.getElementById("start");
  var start2 = document.getElementById("start2");
  var start3 = document.getElementById("start3");
  var start4 = document.getElementById("start4");
  var start5 = document.getElementById("start5");
  const text = document.getElementById('animatedText');
  const forward = document.getElementById('forward');
  forward.style.display = "block";
  back.style.display = "none";
  back.classList.toggle('poof');
  start2.classList.toggle('fade-out1')
  start3.classList.toggle('fade-out1')
  start4.classList.toggle('fade-out1')
  forward.classList.remove('fade-out1')  
  start.classList.toggle('fade-out');
  start2.classList.toggle('fade-out');
  start3.classList.toggle('fade-out');
  start4.classList.toggle('fade-out');
  start5.classList.toggle('fade-out');
  setTimeout(() => {
    start.classList.toggle('poof');
    start2.classList.toggle('poof');
    start3.classList.toggle('poof');
    start4.classList.toggle('poof');
    start5.classList.toggle('poof');
  }, 2000);
  setTimeout(() => {
    text.classList.toggle('tadah');
    text.classList.remove('fade-out')
    text.classList.add('fade-in');
    forward.classList.remove('poof');
    forward.classList.add('tadah');
    forward.classList.remove('fade-out');
    forward.classList.add('fade-in');
  }, 2500);
  
}

function forwardButton(){
  var back = document.getElementById("back");
  var start = document.getElementById("start");
  var start2 = document.getElementById("start2");
  var start3 = document.getElementById("start3");
  var start4 = document.getElementById("start4");
  var start5 = document.getElementById("start5");
  const text = document.getElementById('animatedText');
  const forward = document.getElementById('forward');
  forward.style.display = "none";

  forward.classList.add('poof');
  start2.classList.remove('fade-out1')
  start3.classList.remove('fade-out1')
  start4.classList.remove('fade-out1')
  setTimeout(() => {
    text.classList.toggle('fade-out');
  }, 1000);
  setTimeout(() => {
    back.style.display = "block";
    back.classList.toggle('fade-in');
    text.classList.remove('tadah');
    text.classList.add('poof');
  }, 3000);
  setTimeout(() => {
    back.classList.toggle('tadah');
    start.classList.toggle('tadah');
    start2.classList.toggle('tadah');
    start3.classList.toggle('tadah');
    start4.classList.toggle('tadah');
    start5.classList.toggle('tadah');
    start.classList.remove('fade-out')
    start2.classList.remove('fade-out')
    start3.classList.remove('fade-out')
    start4.classList.remove('fade-out')
    start5.classList.remove('fade-out')
    back.classList.add('fade-in');
    start.classList.add('fade-in');
    start2.classList.add('fade-in');
    start3.classList.add('fade-in');
    start4.classList.add('fade-in');
    start5.classList.add('fade-in');
  }, 5000);
}
function startTimer() {
    let timeLeft = 183; // 3 minutes in seconds extra 4 seconds for transition times
    noButton()
    const timer3 = document.getElementById('timer2');
    const timer2 = document.getElementById('timer1');
    const timer = document.getElementById('timer');
    timer2.classList.toggle('poof');
    timer3.classList.toggle('poof');
    setTimeout(() => {
      timer.classList.toggle('fade-in');
      // MUSIC
    }, 4000);
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
function startTimer1() {
  let timeLeft = 303; // 5 minutes in seconds extra 4 seconds for transition times
  noButton()
  const timer2 = document.getElementById('timer2');
  const timer = document.getElementById('timer1');
  const timer3 = document.getElementById('timer');
  timer2.classList.toggle('poof');
  timer3.classList.toggle('poof');
  setTimeout(() => {
    timer.classList.toggle('fade-in');
  }, 4000);
  const countdown = setInterval(function() {
  const minutes = Math.floor(timeLeft / 60);
  let seconds = timeLeft % 60;
  if (seconds < 10){
    seconds = '0' + seconds;
  }
  document.getElementById('timer1').innerHTML = `${minutes}:${seconds}`;
  if (timeLeft <= 0) {
      clearInterval(countdown);
      document.getElementById('timer1').innerHTML = 'Time is up!';
  } else {
        timeLeft--;
  }
}, 1000);
}
function startTimer2() {
  let timeLeft = 483; // 8 minutes in seconds extra 4 seconds for transition times
  noButton()
  const timer2 = document.getElementById('timer1');
  const timer3 = document.getElementById('timer');
  const timer = document.getElementById('timer2');
  timer2.classList.toggle('poof');
  timer3.classList.toggle('poof');
    setTimeout(() => {
      timer.classList.toggle('fade-in');
    }, 4000);
  const countdown = setInterval(function() {
  const minutes = Math.floor(timeLeft / 60);
  let seconds = timeLeft % 60;
  if (seconds < 10){
    seconds = '0' + seconds;
  }
  document.getElementById('timer2').innerHTML = `${minutes}:${seconds}`;
  if (timeLeft <= 0) {
      clearInterval(countdown);
      document.getElementById('timer2').innerHTML = 'Time is up!';
  } else {
        timeLeft--;
  }
}, 1000);
}
      
function toggleAnimation() {
  const text = document.getElementById('animatedText');
  const text1 = document.getElementById('start');
  const text3 = document.getElementById('start2');
  const text4 = document.getElementById('start3');
  const text5 = document.getElementById('start4');
  const text6 = document.getElementById('start5');
  const back = document.getElementById('back');
  text.classList.toggle('fade-in');
  setTimeout(() => {
      text.classList.toggle('fade-out');
  }, 5000);
  setTimeout(() => {
    text.classList.toggle('poof');
}, 7000);
  setTimeout(() => {
      text1.classList.toggle('fade-in');
      text3.classList.toggle('fade-in');
      text4.classList.toggle('fade-in');
      text5.classList.toggle('fade-in');
      text6.classList.toggle('fade-in');
      back.classList.toggle('fade-in')
  }, 8000);

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
