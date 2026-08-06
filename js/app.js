console.log("✨ Entre Noites iniciado.");


const seal = document.querySelector(".seal");
const envelope = document.querySelector(".envelope");

seal.addEventListener("click", () => {

    if(envelope.classList.contains("opening")) return;

    envelope.classList.add("opening");

});