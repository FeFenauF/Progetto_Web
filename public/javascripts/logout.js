'use strict';
const logout= document.getElementById('logout');

logout.addEventListener('click', () => {
    fetch('/login/session/current', { method: 'DELETE' })
        .then(()=> window.location = '/login');
});