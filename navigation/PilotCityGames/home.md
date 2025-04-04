---
layout: post
title: Home
description: Home Page
Author: Everyone
permalink: /index
---

<table>
    <tr>
        <td><a href="{{site.baseurl}}/index">Home</a></td>
        <td><a href="{{site.baseurl}}/blackjack">BlackJack</a></td>
        <td><a href="{{site.baseurl}}/building">Building</a></td>
        <td><a href="{{site.baseurl}}/editing">Editing</a></td>
        <td><a href="{{site.baseurl}}/exploration">Exploration</a></td>
        <td><a href="{{site.baseurl}}/outbreak">Outbreak</a></td>
        <td><a href="{{site.baseurl}}/worldmap">WorldMap</a></td>
    </tr>
</table>

<style>
    :root {
        --primary-color: #1a237e;
        --secondary-color: #283593;
        --background: linear-gradient(145deg, #727D73, #AAB99A, #D0DDD0, #F0F0D7, rgb(114, 125, 115), rgb(170, 185, 154), rgb(208, 221, 208), rgb(240, 240, 215));
        --text-color: #e1e1e1;
        --card-bg: rgba(30, 41, 59, 0.8);
        --error: #e74c3c;
        --success: #2ecc71;
    }

    body {
        background: var(--background);
        color: var(--text-color);
        min-height: 100vh;
    }

    table {
        width: 100%;
        margin-bottom: 2rem;
        border-collapse: collapse;
        background: rgba(30, 41, 59, 0.5);
        border-radius: 8px;
    }

    table td {
        padding: 0.5rem;
        text-align: center;
    }

    table a {
        color: #93c5fd;
        text-decoration: none;
        transition: color 0.3s ease;
    }

    table a:hover {
        color: #60a5fa;
    }

    .picture-gallery {
        max-width: 1200px;
        margin: 2rem auto;
        padding: 1rem;
    }

    .upload-form {
        background: var(--card-bg);
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        margin-bottom: 2rem;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .form-group {
        margin-bottom: 1.5rem;
    }

    .form-label {
        display: block;
        margin-bottom: 0.5rem;
        color: var(--text-color);
        font-weight: 500;
    }

    .form-input {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        background: rgba(15, 23, 42, 0.7);
        color: var(--text-color);
        transition: border-color 0.3s ease;
    }

    .form-input:focus {
        outline: none;
        border-color: #3b82f6;
    }

    .submit-btn {
        background: #3b82f6;
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .submit-btn:hover {
        background: #2563eb;
        transform: translateY(-2px);
    }

    .gallery-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 2rem;
    }

    .picture-card {
        background: var(--card-bg);
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .picture-card:hover {
        transform: translateY(-5px);
    }

    .picture-img {
        width: 100%;
        height: 200px;
        object-fit: contain;
        background: transparent;
        padding: 1rem;
    }

    .picture-info {
        padding: 1rem;
    }

    .picture-info h3 {
        color: #93c5fd;
        margin: 0 0 0.5rem 0;
    }

    .picture-info p {
        color: var(--text-color);
        margin: 0 0 1rem 0;
        opacity: 0.8;
    }

    .picture-info small {
        color: var(--text-color);
        opacity: 0.6;
    }

    #message {
        padding: 1rem;
        margin: 1rem 0;
        border-radius: 4px;
        display: none;
    }
</style>

<div class="picture-gallery">
    <div id="app"></div>
    <div class="upload-form">
        <h2>Upload New Picture</h2>
        <div class="form-group">
            <label class="form-label">User Name</label>
            <input type="text" id="userName" class="form-input" required>
        </div>
        <div class="form-group">
            <label class="form-label">Drawing Name</label>
            <input type="text" id="drawingName" class="form-input" required>
        </div>
        <div class="form-group">
            <label class="form-label">Description</label>
            <textarea id="description" class="form-input" rows="3"></textarea>
        </div>
        <div class="form-group">
            <label class="form-label">Picture (PNG only)</label>
            <input type="file" id="pictureFile" accept=".png" class="form-input" required>
        </div>
        <button onclick="uploadPicture()" class="submit-btn">Upload Picture</button>
    </div>
    <div id="message"></div>
    <div id="galleryGrid" class="gallery-grid"></div>
</div>

<script>
    const API_URL = 'https://scribble.stu.nighthawkcodingsociety.com/api/picture';

    function showMessage(message, isError = false) {
        const messageEl = document.getElementById('message');
        messageEl.textContent = message;
        messageEl.style.display = 'block';
        messageEl.style.backgroundColor = isError ? 'rgba(231, 76, 60, 0.2)' : 'rgba(46, 204, 113, 0.2)';
        messageEl.style.color = isError ? '#e74c3c' : '#2ecc71';
        messageEl.style.border = `1px solid ${isError ? '#e74c3c' : '#2ecc71'}`;
        messageEl.style.padding = '1rem';
        messageEl.style.borderRadius = '4px';
        setTimeout(() => messageEl.style.display = 'none', 3000);
    }

    async function uploadPicture() {
        const userName = document.getElementById('userName').value;
        const drawingName = document.getElementById('drawingName').value;
        const description = document.getElementById('description').value;
        const pictureFile = document.getElementById('pictureFile').files[0];

        if (!userName || !drawingName || !pictureFile) {
            showMessage('Please fill in all required fields', true);
            return;
        }

        const formData = new FormData();
        formData.append('user_name', userName);
        formData.append('drawing_name', drawingName);
        formData.append('description', description);
        formData.append('image', pictureFile);

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            console.log('Upload response:', data);

            if (response.ok) {
                showMessage('Picture uploaded successfully');
                clearForm();
                fetchPictures();
            } else {
                throw new Error(data.error || 'Failed to upload picture');
            }
        } catch (error) {
            console.error('Upload error:', error);
            showMessage(error.message, true);
        }
    }

    function clearForm() {
        document.getElementById('userName').value = '';
        document.getElementById('drawingName').value = '';
        document.getElementById('description').value = '';
        document.getElementById('pictureFile').value = '';
    }

    async function fetchPictures() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Failed to fetch pictures');
            const data = await response.json();
            console.log('Fetched pictures:', data);
            displayPictures(data.pictures || []);
        } catch (error) {
            console.error('Fetch error:', error);
            showMessage(error.message, true);
        }
    }

    function displayPictures(pictures) {
        const grid = document.getElementById('galleryGrid');
        grid.innerHTML = '';

        pictures.forEach(picture => {
            const card = document.createElement('div');
            card.className = 'picture-card';
            card.innerHTML = `
                <img src="${picture.image_url}" 
                     alt="${picture.drawing_name}" 
                     class="picture-img"
                     onerror="this.onerror=null; this.src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='">
                <div class="picture-info">
                    <h3>${picture.drawing_name}</h3>
                    <p>${picture.description || 'No description provided'}</p>
                    <small>By: ${picture.user_name}</small>
                    <small class="date">${new Date(picture.created_at).toLocaleDateString()}</small>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    // Initialize gallery
    fetchPictures();

    // Refresh every 30 seconds
    setInterval(fetchPictures, 30000);

    document.addEventListener('DOMContentLoaded', () => {
        const app = document.querySelector('#app');
        if (!app) {
            console.error('Error: #app container not found. Ensure the div with id "app" is in the HTML.');
            return;
        }
        const toolbar = document.createElement('div');
        toolbar.style.cssText = `
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 10px;
            background: rgba(255, 255, 255, 0.3);
            padding: 10px;
            border-radius: 10px;
            gap: 10px;
            flex-wrap: wrap;
        `;
        const colorPicker = document.createElement('input');
        colorPicker.type = 'color';
        colorPicker.value = '#000000';
        colorPicker.style.cssText = `
            width: 40px;
            height: 40px;
            border: none;
            cursor: pointer;
        `;
        toolbar.appendChild(colorPicker);
        let currentColor = colorPicker.value;
        let isEraser = false;
        colorPicker.addEventListener('input', () => {
            currentColor = colorPicker.value;
            isEraser = false;
            eraserButton.style.background = 'white';
            eraserButton.style.color = 'black';
        });
        const brushSize = document.createElement('input');
        brushSize.type = 'range';
        brushSize.min = '1';
        brushSize.max = '50';
        brushSize.value = '5';
        brushSize.style.cssText = 'margin: 0 10px;';
        toolbar.appendChild(brushSize);
        const markerButton = document.createElement('button');
        markerButton.textContent = 'Marker';
        markerButton.style.cssText = `
            background: #FF5733;
            color: white;
            border: 2px solid #000;
            padding: 10px;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
        `;
        markerButton.addEventListener('click', () => {
            isEraser = false;
            currentColor = '#000000';
            colorPicker.value = currentColor;
            eraserButton.style.background = 'white';
            eraserButton.style.color = 'black';
        });
        toolbar.appendChild(markerButton);
        const eraserButton = document.createElement('button');
        eraserButton.textContent = 'Eraser';
        eraserButton.style.cssText = `
            background: white;
            color: black;
            border: 2px solid #000;
            padding: 10px;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
        `;
        eraserButton.addEventListener('click', () => {
            isEraser = true;
            eraserButton.style.background = 'black';
            eraserButton.style.color = 'white';
        });
        toolbar.appendChild(eraserButton);
        const undoButton = document.createElement('button');
        undoButton.textContent = 'Undo';
        undoButton.style.cssText = `
            background: #FFC107;
            color: white;
            border: none;
            padding: 10px;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
        `;
        undoButton.addEventListener('click', () => {
            if (undoStack.length > 0) {
                undoStack.pop();
                const lastImage = undoStack.length > 0 ? undoStack[undoStack.length - 1] : null;
                const img = new Image();
                img.src = lastImage || '';
                img.onload = () => {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0);
                };
            }
        });
        toolbar.appendChild(undoButton);
        const resetButton = document.createElement('button');
        resetButton.textContent = 'Reset';
        resetButton.style.cssText = `
            background: #DC3545;
            color: white;
            border: none;
            padding: 10px;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
        `;
        resetButton.addEventListener('click', () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            undoStack = [];
        });
        toolbar.appendChild(resetButton);
        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save Drawing';
        saveButton.style.cssText = `
            background: #28A745;
            color: white;
            border: none;
            padding: 10px;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
        `;
        saveButton.addEventListener('click', () => {
            const drawingData = canvas.toDataURL("image/png");
            const link = document.createElement('a');
            link.download = `drawing.png`;
            link.href = drawingData;
            link.click();
        });
        toolbar.appendChild(saveButton);
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 600;
        canvas.style.cssText = `
            border: 2px solid black;
            background: white;
            cursor: crosshair;
        `;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        let drawing = false;
        let undoStack = [];
        canvas.addEventListener('mousedown', (e) => {
            drawing = true;
            ctx.beginPath();
            ctx.moveTo(e.offsetX, e.offsetY);
        });
        canvas.addEventListener('mousemove', (e) => {
            if (drawing) {
                ctx.strokeStyle = isEraser ? 'white' : currentColor;
                ctx.lineWidth = brushSize.value;
                ctx.lineCap = 'round';
                ctx.lineTo(e.offsetX, e.offsetY);
                ctx.stroke();
            }
        });
        canvas.addEventListener('mouseup', () => {
            drawing = false;
            ctx.closePath();
            undoStack.push(canvas.toDataURL());
        });
        canvas.addEventListener('mouseleave', () => {
            drawing = false;
        });
        app.appendChild(toolbar);
        app.appendChild(canvas);
        loadDrawings();
    });

    function saveDrawing() {
        const userName = document.getElementById('userName').value.trim();
        const drawingName = document.getElementById('drawingName').value.trim();
        if (!userName || !drawingName) {
            showMessage('Please fill in all fields correctly', true);
            return;
        }
        const drawingData = canvas.toDataURL("image/jpeg");
        fetch('http://127.0.0.1:8203/api/drawings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_name: userName,
                drawing_name: drawingName,
                drawing: drawingData
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                showMessage('Drawing saved successfully');
                loadDrawings();
            } else {
                showMessage(`Error: ${data.error}`, true);
            }
        })
        .catch(error => {
            showMessage(`Error: ${error.message}`, true);
        });
    }

    function loadDrawings() {
        fetch('http://127.0.0.1:8203/api/drawings')
        .then(response => response.json())
        .then(data => {
            const drawingsTableBody = document.querySelector('#drawingsTable tbody');
            drawingsTableBody.innerHTML = '';
            data.drawings.forEach(drawing => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${drawing.user_name}</td>
                    <td>${drawing.drawing_name}</td>
                    <td>
                        <button onclick="viewDrawing('${drawing.drawing}')">View</button>
                        <button onclick="deleteDrawing(${drawing.id})">Delete</button>
                    </td>
                `;
                drawingsTableBody.appendChild(row);
            });
        })
        .catch(error => {
            showMessage(`Error: ${error.message}`, true);
        });
    }

    function viewDrawing(drawingData) {
        const img = new Image();
        img.src = drawingData;
        const drawingsList = document.getElementById('drawings-list');
        drawingsList.innerHTML = '';
        drawingsList.appendChild(img);
    }

    function deleteDrawing(drawingId) {
        fetch(`http://127.0.0.1:8203/api/drawings/${drawingId}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                showMessage('Drawing deleted successfully');
                loadDrawings();
            } else {
                showMessage(`Error: ${data.error}`, true);
            }
        })
        .catch(error => {
            showMessage(`Error: ${error.message}`, true);
        });
    }
</script>