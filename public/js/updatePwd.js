import app from './firebaseConfig.js';
import { getAuth, sendPasswordResetEmail, updatePassword, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js';

const analytics = getAnalytics(app);

const btnImgLogo = document.getElementById('btnImgLogo');
const btnBack = document.getElementById('btnBack');
const btnSendEmail = document.getElementById('btnSendEmail');
const btnChange = document.getElementById('btnChange');
const btnCancle = document.getElementById('btnCancle');
const pwd = document.getElementById('input_now_pwd');
const newPwd = document.getElementById('input_new_pwd');
const confirmPwd = document.getElementById('input_new_pwd2');

btnImgLogo.addEventListener('click', _ => location.href = '../html/main.html');
btnBack.addEventListener('click', _ => history.back());
btnCancle.addEventListener('click', _ => location.href = '../html/settings.html');

validatePwd();

btnSendEmail.addEventListener("click", async _ => {
    const auth = await getAuth(app);
    const email = sessionStorage.getItem('userEmail');
    sendPasswordResetEmail(auth, email)
        .then(() => {
            alert('비밀번호를 재설정 할 수 있도록 이메일로 보냈습니다! 확인해주세요!');
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert('에러발생', errorCode, errorMessage);
        });
});

btnChange.addEventListener('click', async _ => {
    if (pwd.value !== newPwd.value && newPwd.value === confirmPwd.value) {
        pwdChange();
    }
});


function validatePwd() {
    const regex_pwd = /(?=.*\d)(?=.*[a-zA-Z]).{8,}/;
    let errorMsgPwd1 = document.getElementById('errorMsgPwd1');
    let errorMsgPwd2 = document.getElementById('errorMsgPwd2');
    let errorMsgPwd3 = document.getElementById('errorMsgPwd3');

    pwd.addEventListener('keyup', (e) => {
        e.preventDefault();
        let inputValue = e.target.value;
        if (inputValue === '') {
            errorMsgPwd1.textContent = '기존 비밀번호를 입력해주세요.';
            return;
        } else if (!regex_pwd.test(inputValue)) {
            errorMsgPwd1.textContent = '문자와 숫자 1개 이상 포함, 8자리 이상의 비밀번호를 입력해주세요.';
            return;
        } else {
            errorMsgPwd1.textContent = '';
        }
    });

    newPwd.addEventListener('keyup', (e) => {
        let inputValue = e.target.value;
        if (inputValue === '') {
            errorMsgPwd2.textContent = '새로운 비밀번호를 입력해주세요.';
            newPwd.value.focus();
            return;
        } else if (!regex_pwd.test(inputValue)) {
            errorMsgPwd2.textContent = '문자와 숫자 1개 이상 포함, 8자리 이상의 비밀번호를 입력해주세요.';
            return;
        } else {
            errorMsgPwd2.textContent = '';
        }
    });

    newPwd.addEventListener('blur', (e) => {
        let inputValue = e.targetValue;
        if (inputValue === pwd.value) {
            errorMsgPwd2.textContent = '기존의 비밀번호와 다르게 설정해주세요';
            return;
        } else {
            errorMsgPwd2.textContent = '';
        }
    });

    confirmPwd.addEventListener('keyup', (e) => {
        let inputValue = e.target.value;
        if (inputValue === '') {
            errorMsgPwd3.textContent = '새 비밀번호를 입력해주세요.';
            return;
        } else if (!regex_pwd.test(inputValue)) {
            errorMsgPwd3.textContent = '문자와 숫자 1개 이상 포함, 8자리 이상의 비밀번호를 입력해주세요.';
            return;
        } else {
            errorMsgPwd3.textContent = '';
        }
    });

    confirmPwd.addEventListener('blur', (e) => {
        let inputValue = e.target.value;
        if (inputValue !== newPwd.value) {
            errorMsgPwd3.textContent = '위에 입력한 새 비밀번호와 일치하지 않습니다.';
            return;
        } else {
            errorMsgPwd3.textContent = '';
        }
    });
}

async function pwdChange() {
    try {
        const auth = await getAuth(app);
        const email = sessionStorage.getItem('userEmail');
        const updatePwd = newPwd.value;

        try {
            await signInWithEmailAndPassword(auth, email, pwd.value);
        } catch (e) {
            alert('현재 비밀번호 오류');
            console.log('singInError: ', e);
            return;
        }

        try {
            await updatePassword(auth.currentUser, updatePwd);
            await auth.signOut();
            pwd.value = '';
            newPwd.value = '';
            confirmPwd.value = '';
            sessionStorage.clear();
            const alertRedirect = confirm(`비밀번호가 변경되었습니다.
        재로그인해주시기 바랍니다.`);
            if (alertRedirect) {
                location.href = '../html/login.html';
            };

        } catch (e) {
            alert('비밀번호 업데이트 오류');
            console.log('updateError: ', e);
            return;
        }
    } catch (e) {
        alert('오류가 발생했어요..!!');
        console.log('오류발생', e);
    }
}
