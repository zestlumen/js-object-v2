
import app from './firebaseConfig.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-analytics.js';

const analytics = getAnalytics(app);
const cachedImages = {};

const btnImgLogo = document.getElementById('btnImgLogo');
const btnUpdate = document.getElementById('btn_update');
const membership = sessionStorage.getItem('membership');

btnImgLogo.addEventListener('click', _ => {
    const current = sessionStorage.getItem('currentName');
    if (!current) {
        const name = sessionStorage.getItem('user1');
        const url = localStorage.getItem('profileURL1');
        sessionStorage.setItem('currentUser', user1);
        sessionStorage.setItem('currentName', name);
        sessionStorage.setItem('currentUrl', url);
        alert(`기본 유저인 [${name}]으로 시작합니다. 반갑습니다!`);
    }
    location.href = '../html/main.html';
});

btnUpdate.addEventListener('click', _ => location.href = '../html/multiUserProfile.html');

showMultiUserName();
showMultiUserImg();

for (let i = 1; i < 5; i++) {
    document.getElementById(`profile_li${i}`).addEventListener('click', _ => {
        const name = sessionStorage.getItem(`user${i}`);
        const url = localStorage.getItem(`profileURL${i}`);
        sessionStorage.setItem('updateProfileName', name);
        sessionStorage.setItem('updateProfileUrl', url);
        sessionStorage.setItem('updateProfileUserNum', `user${i}`);
        window.location.href = '../html/updateUser.html';
    });
}

async function showMultiUserName() {
    if (membership === 'premium') {
        for (let i = 1; i < 5; i++) {
            let username = sessionStorage.getItem(`user${i}`);
            let spanName = document.getElementById(`span_user_profile${i}`);
            if (spanName) {
                spanName.textContent = username;
            }
        }
    } else if (membership === 'basic') {
        const username = sessionStorage.getItem(`user1`);
        const spanName = document.getElementById('span_user_profile1');
        if (spanName) {
            spanName.textContent = username;
        }
    } else {
        console.error(`username 오류발생`);
    }
}

function showMultiUserImg() {
    if (membership === 'premium') {
        for (let i = 1; i < 5; i++) {
            const imgUrl = localStorage.getItem(`profileURL${i}`);
            const proImg = document.getElementById(`pro_img${i}`);
            if (imgUrl && proImg) proImg.src = imgUrl;
        }
    } else if (membership === 'basic') {
        displayNonePremium();
        const imgUrl = localStorage.getItem('profileURL1');
        const proImg1 = document.getElementById("pro_img1");
        if (imgUrl && proImg1) proImg1.src = imgUrl;
    } else {
        console.error(`sessionStorage.getItem('membership')에 문제가 있음`);
    }
}

function displayNonePremium() {
    for (let i = 2; i < 5; i++) {
        document.getElementById(`profile_li${i}`).classList.add('not_prem');
    }
}






