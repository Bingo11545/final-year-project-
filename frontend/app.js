// Update these two production URLs after deploying backend/AI services.
const PROD_BACKEND_ORIGIN = 'https://missing-person-backend-vwmy.onrender.com';
const PROD_AI_ORIGIN = 'https://final-year-project-k7vn.onrender.com';

const BACKEND_ORIGIN = PROD_BACKEND_ORIGIN;
const AI_URL = PROD_AI_ORIGIN;
const API_URL = `${BACKEND_ORIGIN}/api`;
const IMG_URL_BASE = `${BACKEND_ORIGIN}/`;

const PUBLIC_PATHS_FOR_GUEST = new Set([
    'index',
    'login',
    'register',
    'forgot_password',
    'reset_password',
    'user/case'
]);

let notificationPollTimer = null;

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
    window.location.href = '/index.html';
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
    const raw = await res.text();
    let data = {};

    if (raw) {
        try {
            data = JSON.parse(raw);
        } catch (e) {
            data = { msg: raw };
        }
    }
    
    if (!res.ok) {
        throw new Error(data.msg || data.error || 'API Error');
    }
    return data;
}

// --- UI Utils ---
function updateNav() {
    const navRight = document.getElementById('nav-right');
    if (!navRight) return;

    if (isLoggedIn()) {
        const role = getUserRole();
        const dashboardLink = role === 'admin'
            ? '/system_admin/index.html'
            : (role === 'law_enforcement' ? '/police_admin/dashboard.html' : '/user/dashboard.html');
        const reportLink = '/user/report.html';
        const reportHtml = role === 'admin'
            ? ''
            : `<a href="${reportLink}" data-key="nav_report">Report/Upload</a>`;
        
        navRight.innerHTML = `
            <a href="${dashboardLink}" title="Dashboard" data-key="dashboard">Dashboard</a>
            <a href="#" id="notif-btn" onclick="toggleNotif()" style="position:relative;">
                🔔 <span id="notif-count" style="display:none; background:red; color:white; border-radius:50%; padding:2px 5px; font-size:0.6rem; position:absolute; top:-5px; right:-5px;">0</span>
            </a>
            ${reportHtml}
            <a href="#" onclick="logout()" data-key="logout">Logout</a>
            <!-- Notification Dropdown -->
            <div id="notif-dropdown" style="display:none; position:absolute; right:120px; top:50px; background:white; color:black; border:1px solid #ddd; width:300px; max-height:300px; overflow-y:auto; z-index:1000; box-shadow:0 2px 10px rgba(0,0,0,0.1);">
                <div style="padding:10px; border-bottom:1px solid #eee; font-weight:bold;">Notifications</div>
                <div id="notif-list"></div>
            </div>
        `;
        startNotificationPolling();
    } else {
        stopNotificationPolling();
        navRight.innerHTML = `
            <a href="/login.html" data-key="login_title">Login</a>
            <a href="/register.html" data-key="register">Register</a>
        `;
    }
    
    // Re-apply translation if function exists
    if(typeof changeLanguage === 'function' && localStorage.getItem('preferredLanguage')) {
        changeLanguage(localStorage.getItem('preferredLanguage'));
    }
}

async function checkNotifications() {
     try {
         const updates = await apiCall('/people/notifications');
         const badge = document.getElementById('notif-count');
         const list = document.getElementById('notif-list');
         if(!badge || !list) return;

         const unread = updates.filter(n => !n.isRead).length;
         if(unread > 0) {
             badge.innerText = unread;
             badge.style.display = 'inline-block';
         } else {
             badge.style.display = 'none';
         }

         if(!updates.length) {
            list.innerHTML = '<div style="padding:10px; color:#6b7280; font-size:0.85rem;">No notifications yet.</div>';
            return;
         }

         list.innerHTML = updates.map(u => {
            const redirectTo = u.relatedPersonId ? `/user/case.html?id=${encodeURIComponent(u.relatedPersonId)}` : '/user/dashboard.html';
            return `
                <a href="${redirectTo}" onclick="markNotificationRead('${u._id}')" style="display:block; text-decoration:none; color:inherit; padding:10px; border-bottom:1px solid #eee; font-size:0.9rem; ${u.isRead ? 'opacity:0.8;' : 'background:rgba(59,130,246,0.08);'}">
                    ${u.message}<br><span style="font-size:0.72rem; color:grey;">${new Date(u.createdAt).toLocaleString()}</span>
                </a>
            `;
         }).join('');
     } catch(e) { console.log("No notifications"); }
}

function startNotificationPolling() {
    if (notificationPollTimer) return;
    checkNotifications();
    notificationPollTimer = setInterval(checkNotifications, 12000);
}

function stopNotificationPolling() {
    if (!notificationPollTimer) return;
    clearInterval(notificationPollTimer);
    notificationPollTimer = null;
}

async function markNotificationRead(notificationId) {
    if (!notificationId) return;
    try {
        await apiCall(`/people/notifications/${notificationId}/read`, 'PUT', {});
    } catch (e) {
        console.log('Failed to mark notification as read');
    }
}

function toggleNotif() {
    const d = document.getElementById('notif-dropdown');
    if(d.style.display === 'none') d.style.display = 'block';
    else d.style.display = 'none';
}

// Check auth on protected pages
function checkAuth() {
    if (!isLoggedIn()) {
        window.location.href = '/login.html';
    }
}

function enforceGuestAccess() {
    if (isLoggedIn()) return;

    const path = decodeURIComponent(window.location.pathname || '/').replace(/^\/+|\/+$/g, '');
    const currentPath = path || 'index';
    const canonicalPath = currentPath.endsWith('.html')
        ? currentPath.slice(0, -5)
        : currentPath;

    if (!PUBLIC_PATHS_FOR_GUEST.has(canonicalPath)) {
        window.location.href = '/login.html';
    }
}

enforceGuestAccess();
