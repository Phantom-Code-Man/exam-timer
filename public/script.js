const backendUrl = "http://localhost:3000";
let timers = [];
let audio = new Audio("https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3"); // Change to any alarm sound

async function fetchTimers() {
    const response = await fetch(`${backendUrl}/timers`);
    const savedTimers = await response.json();
    const timerList = document.getElementById('savedTimers');
    timerList.innerHTML = '';
    savedTimers.forEach(timer => {
        const li = document.createElement('li');
        li.textContent = `${timer.title}: ${timer.readingTime} min reading, ${timer.examTime} min exam`;
        
        const startButton = document.createElement('button');
        startButton.textContent = "Start";
        startButton.onclick = () => startTimer(timer);
        
        li.appendChild(startButton);
        timerList.appendChild(li);
    });
}

function startTimer(timer) {
    let readingTime = timer.readingTime * 60; // Convert minutes to seconds
    let examTime = timer.examTime * 60; // Convert minutes to seconds

    // Start the reading phase
    startPhase("Reading", readingTime, () => {
        // Reading phase completed, play audio
        audio.play();
        
        // Start the exam phase after a short delay (e.g., 2 seconds)
        setTimeout(() => {
            startPhase("Exam", examTime, () => {
                // Exam phase completed, play audio
                audio.play();
                document.title = "Time's up!";
            });
        }, 2000); // 2 seconds delay before starting the exam phase
    });
}

function startPhase(phaseName, duration, onComplete) {
    let timeLeft = duration;
    
    const interval = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(interval);
            onComplete();
            return;
        }
        timeLeft--;
        updateTabTitle(phaseName, timeLeft);
    }, 1000);
    
    timers.push(interval);
}

function updateTabTitle(phaseName, timeLeft) {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    document.title = `${phaseName}: ${minutes}:${seconds < 10 ? '0' : ''}${seconds} left`;
}

async function saveTimer() {
    const title = document.getElementById('timerTitle').value;
    const readingTime = document.getElementById('readingTime').value;
    const examTime = document.getElementById('examTime').value;

    if (!title || !readingTime || !examTime) {
        alert('Please fill all fields.');
        return;
    }

    await fetch(`${backendUrl}/timers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, readingTime: parseInt(readingTime), examTime: parseInt(examTime) })
    });

    fetchTimers();
}

fetchTimers();
