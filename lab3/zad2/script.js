const setButton = document.getElementById("set");
const deleteButton = document.getElementById("delete");
const addButton = document.getElementById("add");
const mainArea = document.getElementById("main");

const azure = document.querySelectorAll(".azure");
const headerAnimated = document.querySelectorAll(".header-animated");
const aside = document.querySelector("aside");
const main = document.querySelector("main");
const nav = document.querySelector("nav");
const ul = document.querySelectorAll("ul");




setButton.addEventListener("click", () => {
    azure.forEach(elem => elem.classList.add("azure-styling"));
    headerAnimated.forEach(elem => elem.classList.add("header-animation"));
    aside.classList.add("aside-styling");
    main.classList.add("main-styling");
    nav.classList.add("nav-styling");
    ul.forEach(elem => elem.classList.add("ul-styling"));
});

deleteButton.addEventListener("click", () => {
    azure.forEach(elem => elem.classList.remove("azure-styling"));
    headerAnimated.forEach(elem => elem.classList.remove("header-animation"));
    aside.classList.remove("aside-styling");
    main.classList.remove("main-styling");
    nav.classList.remove("nav-styling");
    ul.forEach(elem => elem.classList.remove("ul-styling"));
});


const wojski = [];
wojski.push([
    ["Natenczas Wojski chwycił na taśmie przypięty"],
    ["Swój róg bawoli, długi, cętkowany, kręty"],
    ["Jak wąż boa, oburącz do ust go przycisnął,"],
    ["Wzdął policzki jak banię, w oczach krwią zabłysnął,"],
    ["Zasunął wpół powieki, wciągnął w głąb pół brzucha"],
    ["I do płuc wysłał z niego cały zapas ducha,"],
    ["I zagrał: róg jak wicher, wirowatym dechem"],
    ["Niesie w puszczę muzykę i podwaja echem."]
]);
wojski.push([
    ["Umilkli strzelcy, stali szczwacze zadziwieni"],
    ["Mocą, czystością, dziwną harmoniją pieni."],
    ["Starzec cały kunszt, którym niegdyś w lasach słynął,"],
    ["Jeszcze raz przed uszami myśliwców rozwinął;"],
    ["Napełnił wnet, ożywił knieje i dąbrowy,"],
    ["Jakby psiarnię w nie wpuścił i rozpoczął łowy."]
]);
wojski.push([
    ["Bo w graniu była łowów historyja krótka:"],
    ["Zrazu odzew dźwięczący, rześki: to pobudka;"],
    ["Potem jęki po jękach skomlą: to psów granie;"],
    ["A gdzieniegdzie ton twardszy jak grzmot: to strzelanie."]
]);
let wojskiIndex = 0;

addButton.addEventListener("click", () => {
    wojski[wojskiIndex++].forEach(line => {
        const newNode = document.createTextNode(line);
        main.appendChild(newNode);
        const br = document.createElement("br");
        main.appendChild(br);
    })

    const br = document.createElement("br");
    main.appendChild(br);
    
    if (wojskiIndex === wojski.length) addButton.disabled = true;
});