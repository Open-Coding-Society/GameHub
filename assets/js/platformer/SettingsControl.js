// SettingsControl.js key purpose is key/value management for game settings.
import LocalStorage from "./LocalStorage.js";
import GameEnv from "./GameEnv.js";
import GameControl from "./GameControl.js";
import Socket from "./Multiplayer.js";
import Chat from "./Chat.js"
import { enableLightMode, enableDarkMode } from './Document.js';


/* Coding Style Notes
 *
 * SettingsControl is defined as a Class
 * * SettingsControl contains a constructor.
 * * SettingsControl.constructor() is called when SettingsControl is instantiated.
 * * SettingsControl is instantiated in SettingsControl.sidebar().
 * * This coding style allows multiple instances of SettingsControl.
 * * This coding style is a common pattern in JavaScript and is very similar to Java.
 * * Methods are defined as ES6 shorthand
 * 
 * 
 * * Observe, instantiation/scoping/encapulation of this.keys 
 * * * The constructor makes an instance of this.keys by calling super(keys). 
 * * * * Observe the super(keys) call, this calls extended LocalStorage class constructor.
 * * * * Review LocalStorage.js for more details.
 * 
 * * SettingsControl manages keys following Model-View-Control (MVC) design pattern.
 * *  * Model is the LocalStorage class, which enables persistence of settings between sessions.
 * *  * View is the HTML/CSS sidebar, which displays and stores document elements in the DOM.
 * *  * Control is the SettingsControl class, which manages exchange of data between Model and View.
 * 
 * 
 * Usage Notes
 * * call SettingsControl.sidebar() to run the settings sidebar.
 * * * the remainder of SettingsControl supports the sidebar and MVC design for settings keys/values. 
 * 
*/

const backgroundDim = {
    create () {
        this.dim = true // sets the dim to be true when settingControl is opened
        console.log("CREATE DIM")
        const dimDiv = document.createElement("div");
        dimDiv.id = "dim";
        dimDiv.style.backgroundColor = "black";
        dimDiv.style.width = "100%";
        dimDiv.style.height = "100%";
        dimDiv.style.position = "absolute";
        dimDiv.style.opacity = "0.8";
        document.body.append(dimDiv);
        dimDiv.style.zIndex = "9998"
        dimDiv.addEventListener("click", this.remove)
    },
    remove () {
        this.dim = false
        console.log("REMOVE DIM");
        const dimDiv = document.getElementById("dim");
        dimDiv.remove();
        isOpen = false
        const sidebar = document.getElementById("sidebar")
        sidebar.style.width = "0px";
        sidebar.style.left = "-100px"
        sidebar.style.top = "15%"
    }
}

let isOpen = true

const SettingsControl = {
    initialize () {
       const sidebarDiv = document.getElementById("sidebar")
       const sidebarContents = this.createSidebar()

       document.getElementById("settings-button").addEventListener("click", this.openSettings)
    },

    openSettings () {
        const submenu = document.querySelector('.submenu');
        const submenuHeight = submenu.offsetHeight;
        // toggle isOpen
        isOpen = true;
        // open and close properties for sidebar based on isOpen
        backgroundDim.create()
        const sidebar = document.querySelector('.sidebar');
        sidebar.style.width = isOpen?"200px":"0px";
        sidebar.style.paddingLeft = isOpen?"10px":"0px";
        sidebar.style.paddingRight = isOpen?"10px":"0px";
        sidebar.style.paddingTop = "10px"
        sidebar.style.top = `calc(${submenuHeight}px + ${GameEnv.top}px)`;
        sidebar.style.left = '0px'

        sidebar.hidden = false
    },

    createSidebar () {
        const levels = this.levelTable();
        document.getElementById("sidebar").append(levels);
        // Get/Construct HTML input and event update fo game speed
        const userID = this.userIDInput();
        document.getElementById("sidebar").append(userID);
 
        // Get/Construct HTML input and event update for game speed 
        const gameSpeed = this.gameSpeedInput();
        document.getElementById("sidebar").append(gameSpeed);
 
        // Get/Construct HTML input and event update for gravity
        const gravityInput = this.gravityInput();
        document.getElementById("sidebar").append(gravityInput);
 
        // Get/Construct HTML input and event update for difficulty
        const difficultyInput = this.difficultyInput();
        document.getElementById("sidebar").append(difficultyInput);
 
        // Get/Construct HTML button and event update for multiplayer
        const chatButton = this.chatButton();
        document.getElementById("sidebar").append(chatButton);
 
        const hintsButton = this.hintsButton();
        document.getElementById("sidebar").append(hintsButton);

        // Theme change button removed
    }, 

    hintsButton() {
        const container = document.createElement("div")
        const title = document.createElement("span")
        title.textContent = "Show Facts:"
        const hintsButton = document.createElement("input");
        hintsButton.type = "checkbox";

        // Reference the hints section
        const hints = document.getElementsByClassName("fun_facts")[0];

        // Check localStorage for existing funFact state and set the initial state
        const localStorageFunFact = window.localStorage.getItem('funFact');

        if (localStorageFunFact !== null) {
            GameEnv.funFact = localStorageFunFact.toLowerCase() === "true";
        } else {
            // Default value if nothing is found in localStorage
            // Default is to disable fun facts
            GameEnv.funFact = false;
        }

        // Set the initial state of hints and the checkbox based on GameEnv.funFact
        if (GameEnv.funFact) {
            hints.style.display = "unset";
            hintsButton.checked = true;
        } else {
            hints.style.display = "none";
            hintsButton.checked = false;
        }

        // Add event listener to the button to update display and localStorage
        hintsButton.addEventListener("click", () => {
            if (!hintsButton.checked) {
                hints.style.display = "none";
                GameEnv.funFact = false;
            } else {
                hints.style.display = "unset";
                GameEnv.funFact = true;
            }

            localStorage.setItem('funFact', GameEnv.funFact);
        });
                    
        container.append(title)
        container.append(hintsButton)

        return container
    },

     levelTable() {
        // create table element
        const t = document.createElement("table");
        t.className = "table levels";
        //create table header
        const header = document.createElement("tr");
        const th1 = document.createElement("th");
        th1.innerText = "#";
        header.append(th1);
        const th2 = document.createElement("th");
        th2.innerText = "Level Tag";
        header.append(th2);
        t.append(header);

        // Create table rows/data
        for(let i = 0, count = 1; i < GameEnv.levels.length; i++){
            if (GameEnv.levels[i].passive) //skip passive levels
                continue; 
            // add level to table
            const row = document.createElement("tr");
            const td1 = document.createElement("td");
            td1.innerText = String(count++); //human counter
            row.append(td1);
            // place level name in button   
            const td2 = document.createElement("td");
            td2.innerText = GameEnv.levels[i].tag;
            row.append(td2);
            // listen for row click
            row.addEventListener("click",()=>{ // when player clicks on the row
                //transition to selected level
                GameControl.transitionToLevel(GameEnv.levels[i]); // resize event is triggered in transitionToLevel
            })
            // add level row to table
            t.append(row);
        }

        return t; //returns <table> element
    },

    gameSpeedInput() {
        const div = document.createElement("div");
        div.innerHTML = "Game Speed: "; // label
    
        const gameSpeed = document.createElement("input");  // get user defined game speed
        gameSpeed.type = "number";
        gameSpeed.min = 1.0;
        gameSpeed.max = 8.0;
        gameSpeed.step = 0.1;
        gameSpeed.default = 2.0; // customed property for default value
        gameSpeed.value = GameEnv.gameSpeed; // GameEnv contains latest game speed
        gameSpeed.className = "input gameSpeed";    // custom style in platformer-styles.scss
    
        gameSpeed.addEventListener("change", () => { 
            // check values are within range
            const value = parseFloat(gameSpeed.value).toFixed(1);
            gameSpeed.value = (value < gameSpeed.min || value > gameSpeed.max || isNaN(value)) ? gameSpeed.default : value;
            // dispatch event to update game speed
            window.dispatchEvent(new CustomEvent("gameSpeed", { detail: {gameSpeed:()=>gameSpeed.value} }));
        });
    
        div.append(gameSpeed); // wrap input element in div
        return div;
    },

    userIDInput () {
        const div = document.createElement("div");
        div.innerHTML = "User ID: "; // label

        const userID = document.createElement("input");  // get user defined userID
        userID.type = "text";
        userID.value = GameEnv.userID; // GameEnv contains latest userID
        userID.maxLength = 10; // set maximum length to 10 characters
        userID.className = "input userID";    // custom style in platformer-styles.scss

        // Retrieve userID from localStorage if available
        const storedUserID = localStorage.getItem('userID');
        if (storedUserID) {
            userID.value = storedUserID;
            GameEnv.userID = storedUserID;
        }

        userID.addEventListener("change", () => { 
            // dispatch event to update userID
            dispatchEvent(new CustomEvent("userID", { detail: {userID:()=>userID.value} }));
            // Save userID to localStorage
            localStorage.setItem('userID', userID.value);
        });

        Socket.sendData("name",GameEnv.userID)

        div.append(userID); // wrap input element in div
        return div;
    },

    difficultyInput() {
        const div = document.createElement("div");
        div.innerHTML = "Difficulty: "; // label
    
        const difficulty = document.createElement("select"); // dropdown for difficulty
        const options = ["Easy", "Normal", "Hard", "Impossible"];
    
        options.forEach(option => {
            const opt = document.createElement("option");
            opt.value = option.toLowerCase();
            opt.text = option;
            difficulty.add(opt);
        });
    
        difficulty.value = GameEnv.difficulty; // GameEnv contains latest difficulty
    
        difficulty.addEventListener("change", () => {
            // dispatch event to update difficulty
            window.dispatchEvent(new CustomEvent("difficulty", { detail: { difficulty: () => difficulty.value } }));
        });
    
        div.append(difficulty); // wrap select element in div
        return div;
    },

    chatButton() {
        const div = document.createElement("div");
        div.innerHTML = "Chat: "; // label
    
        const button = document.createElement("button"); // button for Multiplayer
        button.innerText = "open";
    /**
     * Chat class to make the chat more refined and functional
     */
        const ChatClass = new Chat([]);
        const chatBoxContainer =  ChatClass.chatBoxContainer;
        const chatBox = chatBoxContainer.children.namedItem("chatBox");
        const chatInput = chatBoxContainer.children.namedItem("chatInput");
        const chatButton = chatBoxContainer.children.namedItem("chatButton");
        chatBoxContainer.style.display = "none";
        chatBoxContainer.style.zIndex = 2;
        chatBoxContainer.style.position = "absolute";
        chatBoxContainer.style.top = "70%";
        chatBoxContainer.style.left = "50%";
        chatBoxContainer.style.width = "50%";
        chatBoxContainer.style.height = "30%";
        chatBoxContainer.style.backgroundColor = "grey";
        chatBoxContainer.style.opacity = "65%";
        chatBoxContainer.style.borderRadius = "1%";
        chatBox.style.position = "relative";
        chatBox.style.resize = "both";
        chatBox.style.overflow = "auto";
        chatBox.style.height = "90%";
        chatBox.style.width = "100%";
        chatBox.style.top = "0%";
        chatInput.style.position = "relative";
        chatInput.style.bottom = "0%";
        chatInput.style.height = "10%"
        chatInput.style.width = "80%";
        chatButton.style.position = "relative";
        chatButton.style.height = "10%";
        chatButton.style.width = "20%";
        chatButton.style.bottom = "0%";


        document.getElementById("sidebar").insertAdjacentElement("afterend",chatBoxContainer);

        var isShown = false;
        button.addEventListener("click", () => {
            isShown=!isShown;
            if(isShown){
                chatBoxContainer.style.display = "block";
                button.innerText = "close";
            }else{
                chatBoxContainer.style.display = "none";
                button.innerText = "open"
            }
        });
    
        div.append(button); // wrap button element in div
        return div;
    },

    isThemeInput() {
        // Theme change functionality removed
    },

    gravityInput() {
        const div = document.createElement("div");
        div.innerHTML = "Gravity: "; // label
    
        const gravity = document.createElement("input");  // get user defined gravity
        gravity.type = "number";
        gravity.min = 1.0;
        gravity.max = 8.0;
        gravity.step = 0.1;
        gravity.default = 3.0; // customed property for default value
        gravity.value = GameEnv.gravity; // GameEnv contains latest gravity
        gravity.className = "input gravity";    // custom style in platformer-styles.scss
    
        gravity.addEventListener("change", () => { 
            // check values are within range
            const value = parseFloat(gravity.value).toFixed(1)  ;
            gravity.value = (value < gravity.min || value > gravity.max || isNaN(value)) ? gravity.default : value;
            // dispatch event to update gravity
            window.dispatchEvent(new CustomEvent("gravity", { detail: {gravity:()=>gravity.value} }));
        });
    
        div.append(gravity); // wrap input element in div
        return div;
    },

    reload () {
        window.location.reload()
    }
}

export default SettingsControl;