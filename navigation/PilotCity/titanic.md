---
layout: base
title: Titanic Survival Game
search_exclude: true
permalink: /titanic
---

<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Titanic Survival Predictor</title>
    <style>
       body {
            background: linear-gradient(150deg, #0e3348, #247994, #147ea0, #0f547b);
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f6f6f6;
            }
        .container {
            max-width: 500px;
            margin: auto;
            background: #5ebedd;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        h2 {
            color: #333;
        }
        label {
            display: block;
            margin: 10px 0 5px;
            font-weight: bold;
        }
        input, select {
            width: 100%;
            padding: 8px;
            margin-bottom: 15px;
            border: 1px solid #ccc;
            border-radius: 5px;
        }
        button {
            background-color: #007BFF;
            color: white;
            padding: 10px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            width: 100%;
            font-size: 16px;
        }
        button:hover {
            background-color: #0056b3;
        }
        #result {
            margin-top: 20px;
            font-size: 18px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Titanic Survival Predictor</h2>
        <p>Enter your details below to see if you would have survived the Titanic disaster!</p>        
            <label for="pclass">Passenger Class:</label>
            <select id="pclass">
                <option value="1">First Class</option>
                <option value="2">Second Class</option>
                <option value="3">Third Class</option>
            </select>
        <label for="sex">Sex:</label>
        <select id="sex">
            <option value="male">Male</option>
            <option value="female">Female</option>
        </select>
        <label for="age">Age:</label>
        <input type="number" id="age" placeholder="Enter your age" required>
        <label for="sibsp">Siblings/Spouses on Board:</label>
        <input type="number" id="sibsp" placeholder="Number of siblings/spouses">
        <label for="parch">Parents/Children on Board:</label>
        <input type="number" id="parch" placeholder="Number of parents/children">
        <label for="fare">Fare Paid ($):</label>
        <input type="number" id="fare" placeholder="Enter fare amount">
        <label for="embarked">Embarked Port:</label>
        <select id="embarked">
            <option value="C">Cherbourg</option>
            <option value="Q">Queenstown</option>
            <option value="S">Southampton</option>
        </select>
        <label for="alone">Were you traveling alone?</label>
        <select id="alone">
            <option value="true">Alone</option>
            <option value="false">Not Alone</option>
        </select>
        <button onclick="predictSurvival()">Check Survival Probability</button>
        <p id="result"></p>
    </div>

<script>
    async function predictSurvival() {
        // Gather user input
        let passengerData = {
            pclass: parseInt(document.getElementById("pclass").value),
            sex: document.getElementById("sex").value,
            age: parseFloat(document.getElementById("age").value),
            sibsp: parseInt(document.getElementById("sibsp").value),
            parch: parseInt(document.getElementById("parch").value),
            fare: parseFloat(document.getElementById("fare").value),
            embarked: document.getElementById("embarked").value,
            alone: document.getElementById("alone").value === "true"
        };

        console.log("Sending Data:", passengerData); // Debugging check

        try {
            // Send POST request to Titanic API
            let response = await fetch("http://127.0.0.1:5000/api/predict", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(passengerData)
            });

            let data = await response.json();
            
            // Display survival probability
            document.getElementById("result").innerHTML = `
                <strong>Survival Probability:</strong> ${(data.survive * 100).toFixed(2)}% <br>
                <strong>Death Probability:</strong> ${(data.die * 100).toFixed(2)}%
            `;
        } catch (error) {
            console.error("Error:", error);
            document.getElementById("result").innerHTML = "<strong>Error:</strong> Could not get a prediction.";
        }
    }
</script>
</body>
</html>