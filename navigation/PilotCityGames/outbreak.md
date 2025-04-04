---
layout: post
title: Outbreak
description: Outbreak
Author: Lars
permalink: /outbreak
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
        --background: linear-gradient(145deg, #789DBC, #FFE3E3, #FEF9F2, #C9E9D2, rgb(120, 157, 188), rgb(255, 227, 227), rgb(254, 249, 242), rgb(201, 233, 210));
        --text-color: #e1e1e1;
        --card-bg: rgba(30, 41, 59, 0.8);
        --error: #e74c3c;
        --success: #2ecc71;
    }

    body {
        background: var(--background);
        min-height: 100vh;
        margin: 0;
        padding: 0;
    }

    .picture-gallery {
        max-width: 1200px;
        margin: 2rem auto;
        padding: 0 1rem;
        background: white;
    }

    .upload-form {
        background-color: var(--card-bg);
        padding: 2rem;
        border-radius: 8px;
        margin-bottom: 2rem;
    }

    .form-group {
        margin-bottom: 1rem;
    }

    .form-label {
        display: block;
        margin-bottom: 0.5rem;
        color: var(--text-color);
    }

    .form-input {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        background-color: rgba(255, 255, 255, 0.05);
        color: var(--text-color);
    }

    .submit-btn {
        background-color: var(--primary-color);
        color: white;
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s;
    }

    .submit-btn:hover {
        background-color: var(--secondary-color);
    }

    .gallery-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1.5rem;
        padding: 1rem 0;
    }

    .picture-card {
        background-color: var(--card-bg);
        border-radius: 8px;
        overflow: hidden;
        transition: transform 0.3s;
        max-width: 300px;
        margin: 0 auto;
    }

    .picture-img {
        width: 100%;
        height: 160px;
        object-fit: contain;
        background-color: rgba(0, 0, 0, 0.1);
        padding: 0.5rem;
    }

    .picture-info {
        padding: 1rem;
        color: var(--text-color);
    }

    .picture-info h3 {
        margin: 0 0 0.5rem 0;
        color: var(--text-color);
    }

    .picture-info p {
        margin: 0 0 1rem 0;
        font-size: 0.9rem;
        color: rgba(225, 225, 225, 0.8);
    }

    .delete-btn {
        background-color: var(--error);
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
        transition: opacity 0.3s;
    }

    .delete-btn:hover {
        opacity: 0.9;
    }

    .message {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        border-radius: 4px;
        animation: fadeIn 0.3s ease-in;
        z-index: 1000;
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
</style>

<div class="picture-gallery">
    <div class="upload-form">
        <h2>Upload Drawing</h2>
        <form id="picture-form" enctype="multipart/form-data">
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
                <input type="file" id="image" accept="image/png" class="form-input" required>
            </div>
            <button type="submit" class="submit-btn">Upload Drawing</button>
        </form>
    </div>
    <div id="message" class="message" style="display: none;"></div>
    <div id="gallery" class="gallery-grid"></div>
</div>

<script type="module">
    import { pythonURI } from '{{site.baseurl}}/assets/js/api/config.js';

    const fetchConfig = {
        credentials: "include",
        headers: {
            'X-Origin': 'client'
        }
    };

    async function fetchPictures() {
        try {
            const response = await fetch(`${pythonURI}/api/pictures`, {
                method: "GET",
                ...fetchConfig
            });

            if (!response.ok) throw new Error('Failed to load pictures');
            const pictures = await response.json();

            const gallery = document.getElementById('gallery');
            gallery.innerHTML = '';

            pictures.forEach(picture => {
                const card = document.createElement('div');
                card.className = 'picture-card';
                card.innerHTML = `
                    <img src="${picture.image_data}" 
                         alt="${picture.drawing_name}" 
                         class="picture-img">
                    <div class="picture-info">
                        <h3>${picture.drawing_name}</h3>
                        <p>${picture.description || 'No description'}</p>
                        <small>By: ${picture.user_name}</small>
                        <br>
                        <div class="button-group">
                            ${picture.can_delete ? 
                                `<button onclick="deletePicture(${picture.id})" class="delete-btn">Delete Drawing</button>` 
                                : ''}
                        </div>
                    </div>
                `;
                gallery.appendChild(card);
            });
        } catch (error) {
            console.error('Error:', error);
            showMessage('Failed to load pictures: ' + error.message, true);
        }
    }

    document.getElementById('picture-form').addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const formData = new FormData();
        formData.append('drawing_name', document.getElementById('drawingName').value);
        formData.append('description', document.getElementById('description').value);
        formData.append('image', document.getElementById('image').files[0]);

        try {
            const response = await fetch(`${pythonURI}/api/pictures`, {
                method: "POST",
                ...fetchConfig,
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to upload picture');
            }

            showMessage('Picture uploaded successfully!');
            this.reset();
            await fetchPictures();
        } catch (error) {
            console.error('Error:', error);
            showMessage('Upload failed: ' + error.message, true);
        }
    });

    window.deletePicture = async function(pictureId) {
        if (!confirm('Are you sure you want to delete this picture?')) return;

        try {
            const response = await fetch(`${pythonURI}/api/pictures/delete/${pictureId}`, {
                method: "DELETE",
                ...fetchConfig
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete picture');
            }

            showMessage('Picture deleted successfully');
            await fetchPictures();
        } catch (error) {
            console.error('Error:', error);
            showMessage('Delete failed: ' + error.message, true);
        }
    };

    window.deleteUser = async function(username) {
        if (!confirm(`Are you sure you want to delete user: ${username}?`)) return;

        try {
            const response = await fetch(`${pythonURI}/api/admin/user`, {
                method: "DELETE",
                ...fetchConfig,
                headers: {
                    ...fetchConfig.headers,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: username })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete user');
            }

            showMessage('User deleted successfully');
            await fetchPictures();
        } catch (error) {
            console.error('Error:', error);
            showMessage('Delete user failed: ' + error.message, true);
        }
    };

    function showMessage(message, isError = false) {
        const messageEl = document.getElementById('message');
        messageEl.textContent = message;
        messageEl.style.display = 'block';
        messageEl.style.backgroundColor = isError ? '#C6E7FF' : '#D4F6FF';
        messageEl.style.color = isError ? '#FBFBFB' : '#FFDDAE';
        setTimeout(() => messageEl.style.display = 'none', 3000);
    }

    document.addEventListener('DOMContentLoaded', fetchPictures);
</script>