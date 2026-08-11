const envelope = document.querySelector(".envelope");
const seal = document.querySelector(".seal");
const invitation = document.querySelector(".invitation");
const nightChapter = 
    document.querySelector(".chapter-night");

let automaticNavigation = true;
let autoTimer = null;

const AUTO_DELAY = 5000; // 5 seconds


/* ==========================================
   ENVELOPE
========================================== */

seal.addEventListener("click", () => {

    envelope.classList.add("open");

    startAutomaticNavigation();

});


/* ==========================================
   AUTOMATIC NAVIGATION
========================================== */

function startAutomaticNavigation(){

    clearTimeout(autoTimer);

    autoTimer = setTimeout(() => {

        if (!automaticNavigation) return;

        const nextChapter =
            document.querySelector(".chapter-night");

        if (!nextChapter) return;

        smoothScrollTo(
            invitation,
            nextChapter.offsetTop,
            2200
        );

    }, AUTO_DELAY);

}

function smoothScrollTo(element, target, duration){

    const start = element.scrollTop;
    const distance = target - start;
    const startTime = performance.now();

    const previousSnap = element.style.scrollSnapType;
    const previousBehavior = element.style.scrollBehavior;

    // O JS assume o controle total da transição
    element.style.scrollSnapType = "none";
    element.style.scrollBehavior = "auto";

    function animate(currentTime){

        if (!automaticNavigation){

            element.style.scrollSnapType = previousSnap;
            element.style.scrollBehavior = previousBehavior;

            return;

        }

        const elapsed = currentTime - startTime;

        const progress =
            Math.min(elapsed / duration, 1);

        /*
         * Movimento suave:
         * começa devagar,
         * ganha velocidade,
         * desacelera no final.
         */

        const eased =
            progress < 0.5
                ? 2 * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 2) / 2;

        element.scrollTop =
            start + distance * eased;

        /*
         * A próxima tela começa a nascer
         * enquanto estamos chegando nela.
         */

              
        if (progress >= 0.35){

            document
                .querySelector(".chapter-hero")
                .classList
                .add("is-leaving");

        }

        if (progress < 1){

            requestAnimationFrame(animate);

        } else {

            element.scrollTop = target;

            element.style.scrollSnapType = previousSnap;
            element.style.scrollBehavior = previousBehavior;

        }

    }

    requestAnimationFrame(animate);

}


/* ==========================================
   MANUAL NAVIGATION
========================================== */

function disableAutomaticNavigation(){

    if (!automaticNavigation) return;

    automaticNavigation = false;

    clearTimeout(autoTimer);

}

/* ==========================================
   CHAPTER VISIBILITY
========================================== */

const chapters = document.querySelectorAll(".chapter");

const chapterObserver = new IntersectionObserver(
    (entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting){

                entry.target.classList.add("is-visible");

            }

        });

    },
    {
        root: invitation,
        threshold:0.5
    }
);

chapters.forEach((chapter) => {

    chapterObserver.observe(chapter);

});


/* ==========================================
   TOUCH / SWIPE
========================================== */

let touchStartY = 0;

invitation.addEventListener("touchstart", (event) => {

    touchStartY = event.touches[0].clientY;

}, { passive:true });


invitation.addEventListener("touchend", (event) => {

    const touchEndY = event.changedTouches[0].clientY;

    const distance = Math.abs(touchEndY - touchStartY);

    if (distance > 20){

        disableAutomaticNavigation();

    }

}, { passive:true });


/* ==========================================
   MOUSE / TRACKPAD
========================================== */

invitation.addEventListener("wheel", (event) => {

    if (Math.abs(event.deltaY) > 10){

        disableAutomaticNavigation();

    }

}, { passive:true });


const countdownDays = document.querySelector('[data-unit="days"]');
const countdownHours = document.querySelector('[data-unit="hours"]');
const countdownMinutes = document.querySelector('[data-unit="minutes"]');
const countdownSeconds = document.querySelector('[data-unit="seconds"]');


/* ==========================================
   COUNTDOWN
========================================== */

const weddingDate = new Date("2026-10-30T21:00:00-03:00");

function updateCountdown(){

    const now = new Date();

    const difference =
        weddingDate.getTime() - now.getTime();

    if (difference <= 0){

        countdownDays.textContent = "00";
        countdownHours.textContent = "00";
        countdownMinutes.textContent = "00";
        countdownSeconds.textContent = "00";

        return;

    }

    const totalSeconds =
        Math.floor(difference / 1000);

    const days =
        Math.floor(totalSeconds / 86400);

    const hours =
        Math.floor((totalSeconds % 86400) / 3600);

    const minutes =
        Math.floor((totalSeconds % 3600) / 60);

    const seconds =
        totalSeconds % 60;


    countdownDays.textContent =
        String(days).padStart(2, "0");

    countdownHours.textContent =
        String(hours).padStart(2, "0");

    countdownMinutes.textContent =
        String(minutes).padStart(2, "0");

    countdownSeconds.textContent =
        String(seconds).padStart(2, "0");

}

updateCountdown();

setInterval(updateCountdown, 1000);


const pixModal = document.getElementById("pixModal");
const openPixModal = document.getElementById("openPixModal");
const pixCopyButton = document.getElementById("pixCopyButton");
const pixCopyText = document.getElementById("pixCopyText");
const pixKey = document.getElementById("pixKey");

const pixCloseButtons = document.querySelectorAll("[data-pix-close]");


function openPix(){

    pixModal.classList.add("is-open");

    pixModal.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";

}


function closePix(){

    pixModal.classList.remove("is-open");

    pixModal.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";

}


openPixModal.addEventListener("click", openPix);


pixCloseButtons.forEach((button) => {

    button.addEventListener("click", closePix);

});


document.addEventListener("keydown", (event) => {

    if(
        event.key === "Escape" &&
        pixModal.classList.contains("is-open")
    ){

        closePix();

    }

});


pixCopyButton.addEventListener("click", async () => {

    const key = pixKey.textContent.trim();

    try{

        await navigator.clipboard.writeText(key);

        pixCopyText.textContent = "CHAVE COPIADA";
        pixCopyButton.classList.add("copied");

        setTimeout(() => {

            pixCopyText.textContent = "COPIAR CHAVE";
            pixCopyButton.classList.remove("copied");

        }, 2200);

    }catch(error){

        pixCopyText.textContent = "COPIE MANUALMENTE";

    }

});