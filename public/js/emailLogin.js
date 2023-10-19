import app from './firebaseConfig.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-analytics.js';
import { getAuth, sendSignInLinkToEmail } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js';

const analytics = getAnalytics(app);

const btnLogo = document.getElementById('imgLogo');
const btnBack = document.getElementById('btnBack');
const btnSend = document.getElementById('btnSend');
const errorDiv = document.getElementById('errorDiv');
const inputEmail = document.getElementById('inputEmail');

btnLogo.addEventListener('click', _ => location.href = '../index.html');
btnBack.addEventListener('click', _ => history.back());

inputEmail.addEventListener('keyup', (e) => {
    const regex_email = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
    let emailValue = e.target.value;
    if (emailValue === '') {
        errorDiv.textContent = '이메일을 입력해주세요';
    }
    if (!regex_email.test(emailValue)) {
        errorDiv.textContent = "올바른 이메일로 입력해주세요";
        inputEmail.focus();
        return;
    }
    errorDiv.textContent = '';
});

btnSend.addEventListener('click', sendLinkToEmail);

async function sendLinkToEmail() {
    const auth = await getAuth();
    const email = inputEmail.value;
    const actionCodeSettings = {
        url: 'https://object-fd3df.web.app',
        handleCodeInApp: true,
        iOS: {
            bundleId: 'com.example.ios'
        },
        android: {
            packageName: 'com.example.android',
            installApp: true,
            minimumVersion: '12'
        },
        dynamicLinkDomain: 'example.page.link'
    };

    try {
        await sendSignInLinkToEmail(auth, email, actionCodeSettings);
        window.sessionStorage.setItem('userEmail', email);
        alert('이메일로 인증 링크가 전송되었습니다!');
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(`전송 오류: code:${errorCode}, messsage:${errorMessage}`);
        if (errorCode === 'auth/network-request-failed') {
            alert('네트워크 요청에 실패했습니다.');
        }
    }
}
