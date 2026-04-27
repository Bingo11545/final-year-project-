const IS_LOCAL_ENV = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Update these two production URLs after deploying backend/AI services.
const PROD_BACKEND_ORIGIN = 'https://missing-person-backend.onrender.com';
const PROD_AI_ORIGIN = 'https://missing-person-ai-service.onrender.com';

const BACKEND_ORIGIN = IS_LOCAL_ENV ? 'http://localhost:5000' : PROD_BACKEND_ORIGIN;
const AI_URL = IS_LOCAL_ENV ? 'http://localhost:5001' : PROD_AI_ORIGIN;
const API_URL = `${BACKEND_ORIGIN}/api`;
const IMG_URL_BASE = `${BACKEND_ORIGIN}/`;

// --- Auth Utils ---
function getToken() {
    return localStorage.getItem('token');
}

function getUserRole() {
    const token = getToken();
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.user.role;
    } catch (e) {
        return null;
    }
}

function isLoggedIn() {
    return !!getToken();
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
}

async function apiCall(endpoint, method = 'GET', body = null, isFormData = false) {
    const headers = {};
    const token = getToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    // If not FormData, set Content-Type JSON
    if (!isFormData) {
        headers['Content-Type'] = 'application/json';
    }

    const config = {
        method,
        headers,
    };

    if (body) {
        config.body = isFormData ? body : JSON.stringify(body);
        // Explicitly delete Content-Type for FormData to let browser set boundary
        if (isFormData) delete headers['Content-Type']; 
    }

    const res = await fetch(`${API_URL}${endpoint}`, config);
    const data = await res.json();
    
    if (!res.ok) {
        throw new Error(data.msg || data.error || 'API Error');
    }
    return data;
}

// --- UI Utils ---
function updateNav() {
    const navRight = document.getElementById('nav-right');
    if (isLoggedIn()) {
        const role = getUserRole();
        const dashboardLink = (role === 'law_enforcement' || role === 'admin') ? 'police_dashboard.html' : 'dashboard.html';
        
        navRight.innerHTML = `
            <a href="${dashboardLink}" title="Dashboard" data-key="dashboard">Dashboard</a>
            <a href="tel:991" style="background:#dc3545; color:white; border-radius:4px; padding:5px 10px; margin-right:5px;" data-key="btn_emergency">Emergency: 991</a>
            <a href="#" id="notif-btn" onclick="toggleNotif()" style="position:relative;">
                🔔 <span id="notif-count" style="display:none; background:red; color:white; border-radius:50%; padding:2px 5px; font-size:0.6rem; position:absolute; top:-5px; right:-5px;">0</span>
            </a>
            <a href="report.html" data-key="nav_report">Report/Upload</a>
            <a href="#" onclick="logout()" data-key="logout">Logout</a>
            <!-- Notification Dropdown -->
            <div id="notif-dropdown" style="display:none; position:absolute; right:120px; top:50px; background:white; color:black; border:1px solid #ddd; width:300px; max-height:300px; overflow-y:auto; z-index:1000; box-shadow:0 2px 10px rgba(0,0,0,0.1);">
                <div style="padding:10px; border-bottom:1px solid #eee; font-weight:bold;">Notifications</div>
                <div id="notif-list"></div>
            </div>
        `;
        checkNotifications();
    } else {
        navRight.innerHTML = `
            <a href="tel:991" style="background:#dc3545; color:white; border-radius:4px; padding:5px 10px; margin-right:5px;" data-key="btn_emergency">Emergency: 991</a>
            <a href="login.html" data-key="login_title">Login</a>
            <a href="register.html" data-key="register">Register</a>
        `;
    }
    
    // Re-apply translation if function exists
    if(typeof changeLanguage === 'function' && localStorage.getItem('preferredLanguage')) {
        changeLanguage(localStorage.getItem('preferredLanguage'));
    }
}

async function checkNotifications() {
     try {
         const updates = await apiCall('/people/notifications'); // Endpoint we made
         if(updates && updates.length > 0) {
             const count = updates.filter(n => !n.isRead).length; 
             // We won't track read status perfectly in this simplified version, just show list
             const badge = document.getElementById('notif-count');
             if(updates.length > 0) {
                 badge.innerText = updates.length;
                 badge.style.display = 'inline-block';
             }
             
             const list = document.getElementById('notif-list');
             list.innerHTML = updates.map(u => `
                <div style="padding:10px; border-bottom:1px solid #eee; font-size:0.9rem;">
                    ${u.message} <br> <span style="font-size:0.7rem; color:grey;">${new Date(u.createdAt).toLocaleDateString()}</span>
                </div>
             `).join('');
         }
     } catch(e) { console.log("No notifications"); }
}

function toggleNotif() {
    const d = document.getElementById('notif-dropdown');
    if(d.style.display === 'none') d.style.display = 'block';
    else d.style.display = 'none';
}

// Check auth on protected pages
function checkAuth() {
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
    }
}
