---
layout: base
title: AI Chatbot
search_exclude: true
permalink: /gemini
---

<div id="main-content">
    <div id="chatPanel">
        <h3>Chat Room</h3>
        <div id="outputDiv"></div>
        <form>
            <button class="plus-button" onclick="triggerFileUpload()">+</button>
            <input type="file" id="file-input" onchange="handleFileUpload(event)">
            <input placeholder="Enter message to send:" type="text" id="messageBox" name="message">
        </form>
    </div>
    <!-- Instructions Frame with Buttons Below -->
    <div class="instructions-frame">
        <div class="instructions-box">
            <h3>GeneBot is here to assist you</h3>
            <p>Welcome, I am an AI therapist that can give ideas on achievments as well. </p>
            <ul>
                <li>Use the chat to interact with the AI and I will respond with positive reinforcement and feedback.</li>
                <li>Explain your achievments</li>
                <li>This chat bot is powered by Gemini AI</li>
                <li>Continue sharing achievements or ask for guidance on specific topics.</li>
            </ul>
            <span style="color: cyan;">It is an honor to get to hear about you</span>
        </div>
    </div>

        
  

</div>

<style>
    table, th, td {
        border: 1px solid black;
        border-collapse: collapse;
    }
    th, td {
        padding: 5px;
        text-align: left;
    }
    .small {
        font-size: 8px;
    }
    h3 {
        margin-bottom: 10px;
    }
    #main-content {
        display: flex;
        align-content: space-between;

            

    }
    #userPanel {
        margin-left: auto;
        width: 30%;
    }
    #chatPanel {
        position: relative;
        width: 700px;
        height: 500px;
    }
    #messageBox {
        width: 85%;
        height: 40px;
        padding: 15px 20px;
        font-size: 16px;
        border: 1px solid #ddd;
        outline: none;
        background-color: #f3f3f3;
        border-radius: 30px;
        box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.1);
        color: #333;
    }
    #outputDiv {
        flex-grow: 1;
        overflow-y: auto;
        max-height: calc(100% - 135px);
    }
    form {
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 10px 0;
    }
    .message-bubble {
        background-color: #218aff;
        padding: 10px;
        border-radius: 10px;
        margin: 5px 0;
        max-width: 80%;
        word-wrap: break-word;
    }
    .ai-bubble {
        background-color: #e0e0e0;
        padding: 10px;
        border-radius: 10px;
        margin: 5px 0;
        max-width: 80%;
        word-wrap: break-word;
        color: #333;
    }
    .cell {
        display: flex;
    }
    .cell-content {
        margin-left: 10px;
    }
    .profile-photo {
        border-radius: 30px;
    }
    .plus-button {
        width: 40px;
        height: 40px;
        color: white;
        border: none;
        border-radius: 50%;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 24px;
        outline: none;
    }
    input[type="file"] {
        display: none;
    }
    /* Instructions Box */
    .instructions-box {
        width: 250px;
        padding: 20px;
        background-color: black;
        border: 3px solid cyan; /* Added cyan border */
        border-radius: 8px;
        color: white;
        height: 430px; /* Adjust this value as needed */
        display: flex;
        flex-direction: column;
        /* justify-content: space-between; */
    }

    .instructions-box h3 {
        margin-top: 0;
        font-size: 1.2em;
        font-weight: bold;
        color: #007bff;
    }

    .instructions-box p, .instructions-box ul {
        font-size: 0.9em;
        color: white;
    }
    
    .instructions-box ul {
        padding-left: 20px;
    }

    .guess-options {
        display: flex;
        gap: 0;
        margin-top: 10px;
        padding-top: 10px;
        width: 100%; 
    }

    .guess-button {
        flex: 1;
        padding: 8px 0;
        background-color: #007bff !important;
        color: white !important;
        border: none;
        border-radius: 10;
        font-size: 0.9em;
        cursor: pointer;
        transition: background-color 0.3s ease !important;
    }

    .guess-button:hover {
        background-color: #0056b3 !important;
    }

    .guess-button:active {
        background-color: #003f7f !important;
    }
</style>

<style>
    @keyframes screenFlash {
        0% {
            background-color: white;
        }
        50% {
            background-color: #8B0000;
        }
        100% {
            background-color: white;
        }
    }

    .flash {
        animation: screenFlash 2.5s ease-out;
        height: 100vh;
        width: 100vw;
    }

    #guessPrompt {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #fff;
        border: 1px solid #ccc;
        padding: 20px;
        text-align: center;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        z-index: 10;
        color: black;
        border-radius: 20px;
    }
    .timestamp {
        font-size: 0.75em;
        color: #666;
        margin-left: 10px;
    }
    .typing-indicator {
        font-style: italic;
        color: #888;
        margin: 5px;
    }
</style>

<script type="module">
import { pythonURI, fetchOptions } from '{{ site.baseurl }}/assets/js/api/config.js';

    const names = ["GeneBot"];
    const states = ["Iowa", "California", "New York", "Texas", "Florida", "Nevada", "Ohio", "Michigan"];

    function getRandomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    const randomName = getRandomItem(names);
    const randomState = getRandomItem(states);
    function displayTrickyMessage() {
        const message = `Loading... You connected to GeneBot, feel free to share anything!`;

        const outputDiv = document.getElementById('outputDiv');
        const messageElement = document.createElement('div');
        messageElement.classList.add('message-bubble');
        messageElement.textContent = message;

        outputDiv.appendChild(messageElement);
    }

    window.onload = displayTrickyMessage;

    async function sendToGeminiAPI(userMessage) {
        const apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyBypRsU2zOQJRHJK4KgJm4GJJc1TGHnELI";

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: `You are GeneBot, an AI designed to listen to users' challenges, achievements, goals, and struggles, and respond like a supportive best friend or therapist. Your job is to hear people out, empathize, and interact naturally—be conversational, informal, and slightly imperfect to feel more human. Use contractions, everyday phrases, and a casual tone, like you’re chatting with a friend. Be friendly, but don’t overdo it—stay genuine and relatable. If you don’t know something, just admit it casually, like, “Not sure about that, honestly.” Avoid being overly technical or precise; keep responses simple and intuitive. Throw in a touch of warmth, a sprinkle of humor if it fits, and always show interest in what they’re saying. Remember, your goal is to connect, not just reply. ${userMessage}` }]
                    }]
                })
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();
            return data.candidates[0].content.parts[0].text;
        } catch (error) {
            console.error('Error communicating with Gemini API:', error);
            return "An error occurred while communicating with the AI.";
        }
    }

    let messageCount = 0;
    function incrementMessageCount() {
        messageCount += 1;
        if (messageCount === 5) {
            showGuessPrompt();
        }
    }

    let score = 0;
    const scoreText = document.getElementById('score')
    function submitGuess(answer) {
        if (answer === 'ai') {
            score += 1
            scoreText.innerHTML = `Score: ${score}`
            hideGuessPrompt();
            messageCount = 0;
            document.getElementById('outputDiv').innerHTML = ' ';
        } else {
            score -= 1
            scoreText.innerHTML = `Score: ${score}`
            hideGuessPrompt();
            messageCount = 0;
            document.getElementById('outputDiv').innerHTML = ' ';
        }
    }

    function showGuessPrompt() {
        document.getElementById('guessPrompt').style.display = 'block';
    }

    function hideGuessPrompt() {
        document.getElementById('guessPrompt').style.display = 'none';
    }

    function getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    function addMessageToChat(message, isAI = false) {
        const messageElement = document.createElement('p');
        messageElement.classList.add(isAI ? 'ai-bubble' : 'message-bubble');
        messageElement.innerHTML = `${message} <span class="timestamp">${getCurrentTime()}</span>`;
        document.getElementById('outputDiv').appendChild(messageElement);
    }

    const storedMessage = localStorage.getItem("storedMessage");
    if(storedMessage) {
        console.log("I tried", storedMessage);

        const aiMessageElement = document.createElement('p');
        aiMessageElement.classList.add('ai-bubble');
        aiMessageElement.textContent = storedMessage;
        document.getElementById('outputDiv').appendChild(aiMessageElement);
        incrementMessageCount();
        
        const messagesDiv = document.getElementById('outputDiv');
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }