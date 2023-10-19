import app from './firebaseConfig.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-analytics.js';

const analytics = getAnalytics(app);

const btnImgLogo = document.getElementById('btnImgLogo');
const btnChangeMembership = document.getElementById('btn_chg_freepass');
const btnChangeEmail = document.getElementById('btn_change_id');
const btnChangePwd = document.getElementById('btn_change_pwd');
const btnLogout = document.getElementById('btnLogout');
const membership = sessionStorage.getItem('membership');
// const userId = sessionStorage.getItem('userId');

btnImgLogo.addEventListener('click', _ => location.href = '../html/main.html');
btnChangeMembership.addEventListener('click', _ => location.href = '../html/updateMembership.html');
btnChangeEmail.addEventListener('click', _ => location.href = '../html/updateEmail.html');
btnChangePwd.addEventListener('click', _ => location.href = '../html/updatePwd.html');
btnLogout.addEventListener('click', _ => {
    sessionStorage.clear();
    location.href = '../index.html';
});

membershipInfo();
userInfo();

function membershipInfo() {
    if (membership === 'basic') {
        document.getElementById('div_payContents1').innerText = '베이직 이용권';
        document.getElementById('div_payContents2').innerText = '기본 HD 화질 제공, 1명 재생 가능';
        document.getElementById('profile_li2').style.display = 'none';
        document.getElementById('profile_li3').style.display = 'none';
        document.getElementById('profile_li4').style.display = 'none';
    } else if (membership === 'premium') {
        document.getElementById('div_payContents1').innerText = '프리미엄 이용권';
        document.getElementById('div_payContents2').innerText = 'Ultra HD 4K 화질 제공, 4명 동시재생 가능';
        document.getElementById('profile_li2').style.display = 'block';
        document.getElementById('profile_li3').style.display = 'block';
        document.getElementById('profile_li4').style.display = 'block';
    }
}

function userInfo() {
    const spanUserEmail = document.getElementById('span_userEmail');
    const userEmail = sessionStorage.getItem('userEmail').replace(/"/g, '');
    spanUserEmail.textContent = userEmail;

    if ('basic' == membership) {
        document.getElementById('userName1').textContent = sessionStorage.getItem('user1');
        document.getElementById('userImg1').src = localStorage.getItem('profileURL1');
    } else if ('premium' == membership) {
        for (var i = 1; i < 5; i++) {
            document.getElementById(`userName${i}`).textContent = sessionStorage.getItem(`user${i}`);
            document.getElementById(`userImg${i}`).src = localStorage.getItem(`profileURL${i}`);
        }
    }
}

const multiuserList = document.querySelectorAll('[id^="profile_li"]');
multiuserList.forEach((li) => {
    li.addEventListener('click', (e) => {
        const currentUser = e.currentTarget.dataset.user;
        const preCurrentUser = sessionStorage.getItem(`currentUser`);
        console.log(currentUser === preCurrentUser)
        if (currentUser === preCurrentUser) {
            return;
        } else {
            const currentName = sessionStorage.getItem(currentUser);
            const num = currentUser.charAt(currentUser.length - 1);
            const currentUrl = localStorage.getItem(`profileURL${num}`);
            sessionStorage.setItem('currentUser', currentUser);
            sessionStorage.setItem('currentName', currentName);
            sessionStorage.setItem('currentUrl', currentUrl);

            const confirmMsg = `현재 사용자는 [${currentName}]님으로 변경되었습니다.
        메인 화면으로 이동하시겠습니까?`;
            if (confirm(confirmMsg)) {
                location.href = '../html/main.html';
            }
        }
    });
});

