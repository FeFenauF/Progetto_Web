'use strict';
const logout= document.getElementById('logout');

logout.addEventListener('click', () => {
    fetch('/session/current', { method: 'DELETE' })
        .then(()=> window.location = '/login');
});