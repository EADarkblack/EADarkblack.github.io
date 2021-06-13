// Variables

const startBtn = document.querySelector(".start");
const videoContainer = document.querySelector(".get-video");
const textContainer = document.querySelector(".text-container");
const firstStepIcon = document.querySelector(".first");
const secondStepIcon = document.querySelector(".second")
const thirdStepIcon = document.querySelector(".third");
const recordBtn = document.querySelector(".record");
const stopRecordingBtn = document.querySelector(".stop-record");
const timer = document.querySelector(".timer");
const repeatRecord = document.querySelector(".timer-text")
const uploadBtn = document.querySelector(".upload");
const gifResult = document.querySelector(".gifo-result");
const gifContainer = document.querySelector(".gifo-container");
const gifLayer = document.querySelector(".gifo-layer");
const DATA_RECORDER = {
    type: "gif",
    framerate: 1,
    quality: 10,
    width: 360,
    hidden: 240,
    onGifRecordingStarted: () => console.log("Started")
};
let recorder = null;
let blob = null;
let time = null;

// Functions

/**
 * Hides the start button and change the text of the camera area
 */

const firstStep = function() {
    textContainer.innerHTML = `
    <h1>¿Nos das acceso a tu cámara?</h1>
    <h2>El acceso a tu camara será válido sólo
    <br>por el tiempo en el que estés creando el GIFO.</h2>
    `
    firstStepIcon.classList.add("step-active");
    startBtn.style.opacity = "0";
}

/**
 * Gets the user's camera if the user allow it or if the user denies it shows a message
 */

const getUserCamera = function() {
    navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true
    })
    .then((stream) => {
        videoContainer.srcObject = stream;
        videoContainer.play();
        secondStep(stream);
    })
    .catch(() => {
        alert("Para crear un GIFO debes permitir el acceso a tu camara y refrescar la pagina para aplicar los cambios.");
    })
}

/**
 * Adds to the record button its functionality and make some changes on the DOM (starts the recording process)
 */

const secondStep = function(stream) {
    firstStepIcon.classList.remove("step-active");
    secondStepIcon.classList.add("step-active");
    startBtn.style.display = "none";
    recordBtn.style.display = "block";
    recordBtn.addEventListener("click", () => {
        recorder = RecordRTC(stream, DATA_RECORDER);
        recorder.startRecording();
        stopRecording();
        countTime();
    })
}

/**
 * Changes the "record button" to "stop button" and create a local URL to show the image using an img tag
 */

const stopRecording = function() {
    recordBtn.style.display = "none";
    stopRecordingBtn.style.display = "block";
    timer.style.display = "block";
    stopRecordingBtn.addEventListener("click", () => {
        recorder.stopRecording(() => {
            blob = recorder.getBlob();
            gifResult.src = URL.createObjectURL(blob);
            videoContainer.style.display = "none";
            gifContainer.style.display = "block";
            beforeThirdStep();
        });
    })
    
}

/**
 * Sets the time for the timer when the user start to record
 */

const countTime = function() {
    let count = 0;
    time = setInterval(() => {
        count++;
        timer.innerText = setTime(count);
    }, 1000);
}

/**
 * Changes the number for every second took from the count time
 */

const setTime = function(count) {
    const hour = Math.floor(count/3600);
    count %= 3600;
    const minute = Math.floor(count/60);
    count %= 60;
    const second = count;
    const stringHour = ("00" + hour).substr(-2, 2);
    const stringMinute = ("00" + minute).substr(-2, 2);
    const stringSecond = ("00" + second).substr(-2, 2);
    return `${stringHour}:${stringMinute}:${stringSecond}`;
}

/**
 * When the user ends the recording process changes some elements on the DOM and show the "repeat button"
 */

const beforeThirdStep = function() {
    timer.style.display = "none";
    repeatRecord.style.display = "block";
    stopRecordingBtn.style.display = "none";
    uploadBtn.style.display = "block";
    uploadBtn.addEventListener("click", thirdStep)
}

/**
 * Hides some elements and initiates the upload process (no ended)
 */

const thirdStep = function() {
    secondStepIcon.classList.remove("step-active");
    repeatRecord.style.display = "none";
    thirdStepIcon.classList.add("step-active");
    uploadBtn.style.opacity = "0";
    gifLayer.style.opacity = "1";
}

// Listerners

repeatRecord.addEventListener("click", () => {
    location.reload();
});
startBtn.addEventListener("click", () => {
    firstStep();
    getUserCamera();
});