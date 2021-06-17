import api from '../Services/services.js'
import {addDownloadBtn} from './search.js'

// Global Variables

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
const iconsGif = document.querySelector(".icons-gif");
const smallReel = document.querySelector(".reel-small");
const mediumReel = document.querySelector(".reel-medium");
const light = document.querySelector(".camera-light");
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
let count = 0;

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
 * Makes some changes on the DOM (starts the recording process)
 */

const secondStep = function(stream) {
    firstStepIcon.classList.remove("step-active");
    secondStepIcon.classList.add("step-active");
    startBtn.style.display = "none";
    recordBtn.style.display = "block";
    recordBtnEventHandle(stream);
}

/**
 * Changes the "record button" to "stop button" and create a local URL to show the image using an img tag
 */

const stopRecording = function() {
    recordBtn.style.display = "none";
    stopRecordingBtn.style.display = "block";
    timer.style.display = "block";
}

/**
 * Sets the time for the timer when the user start to record
 */

const countTime = function() {
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
}

/**
 * Hides some elements and initiates the upload process
 */

const thirdStep = function() {
    secondStepIcon.classList.remove("step-active");
    repeatRecord.style.display = "none";
    thirdStepIcon.classList.add("step-active");
    uploadBtn.style.opacity = "0";
    gifLayer.style.opacity = "1";
    uploadGifo();
}

/**
 * Adds to record button its functionality and initiates the animation for the camera image
 */

const recordBtnEventHandle = function(stream) {
    recordBtn.addEventListener("click", () => {
        recorder = RecordRTC(stream, DATA_RECORDER);
        recorder.startRecording();
        stopRecording();
        count = 0;
        clearInterval(time);
        countTime();
        smallReel.style.display = "block";
        mediumReel.style.display = "block";
        light.style.display = "block";
    })
}

/**
 * Sends the blob object to the upload api and when receive the gif's id push to the localstorage (also show the download and share button)
 */

const uploadGifo = function() {
    api.apiUploadGif(blob)
    .then((res) => {
        const {data} = res;
        api.apiGetFavoriteId(data.id)
        .then((res) => {
            const {data} = res;
            const myGifosArr = api.getMyGifFromLocalStorage() || [];
            const loaderIcon = document.querySelector(".loader");
            const checkIcon = document.querySelector(".check");
            const loadText = document.querySelector(".loader-text");
            loaderIcon.style.display = "none";
            checkIcon.style.display = "block";
            iconsGif.style.display = "block";
            iconsGif.innerHTML = `
                <span class="icon-icon-download" id="dow-${data.id}">
                    <span class="path1"></span>
                    <span class="path2"></span>
                </span>
                <span class="icon-icon-link-hover">
                    <span class="path1"></span>
                    <span class="path2"></span>
                </span>
            `
            loadText.innerText = "GIFO subido con éxito";
            copyToClipboardBtn(data);
            addDownloadBtn();
            myGifosArr.push(data)
            api.setMyGifToLocalStorage(myGifosArr);
        })
        .catch(err => console.error(`No se ha podido conectar a la Api de busqueda por Id: ${err}`))
    })
    .catch((err) => {
        console.error(`Error al conectar con la Api de subida: ${err}`);
        alert("Ha ocurrido un error con la subida de tu Gifo, intentalo de nuevo.");
    });
}

/**
 * Creates an invisible textarea with the gif's url and copy this url to the clipboard
 */

const copyToClipboardBtn = function(data) {
    const linkContainer = document.createElement("textarea");
    const link = document.createTextNode(`${data.url}`);
    linkContainer.appendChild(link);
    iconsGif.insertAdjacentElement("afterbegin", linkContainer);
    linkContainer.style.opacity = "0";
    const linkBtn = document.querySelector(".icon-icon-link-hover");
    linkBtn.addEventListener("click", () => {
        linkContainer.select();
        try {
            let copy = document.execCommand("copy");
            let msg = copy ? "Enlace copiado al portapapeles." : "El enlace no pudo ser copiado al portapapeles.";
            alert(msg);
        } catch (error) {
            let err = error;
            alert(err);
        }
    })
}

// Listerners

stopRecordingBtn.addEventListener("click", () => {
    recorder.stopRecording(() => {
        blob = recorder.getBlob();
        gifResult.src = URL.createObjectURL(blob);
        videoContainer.style.display = "none";
        gifContainer.style.display = "block";
        beforeThirdStep();
    });
})
repeatRecord.addEventListener("click", () => {
    uploadBtn.style.display = "none";
    repeatRecord.style.display = "none";
    gifContainer.style.display = "none";
    videoContainer.style.display = "block";
    smallReel.style.display = "none";
    mediumReel.style.display = "none";
    light.style.display = "none";
    getUserCamera();
});
startBtn.addEventListener("click", () => {
    firstStep();
    getUserCamera();
});
uploadBtn.addEventListener("click", thirdStep);