import app from './firebaseConfig.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-analytics.js';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js';
import { getFirestore, doc, setDoc } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js';

const analytics = getAnalytics(app);

const btnImgLogo = document.getElementById('btnImgLogo');
const inputEmail = document.getElementById('inputEmail');
const inputName = document.getElementById('inputName');
const inputPwd = document.getElementById('inputPwd');

btnImgLogo.addEventListener('click', _ => location.href = '../index.html');
btnBack.addEventListener('click', _ => history.back());
btn_login.addEventListener('click', _ => location.href = '../html/login.html');

document.getElementById('btnSign').addEventListener('click', (e) => {
    e.preventDefault();
    const errorDiv = document.getElementById('errorAlert');
    const emailValue = inputEmail.value;
    const nameValue = inputName.value;
    const pwdValue = inputPwd.value;
    const regex_email = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
    const regex_name = /^[a-zA-Zㄱ-ㅎㅏ-ㅣ가-힣]{2,}$/;
    const regex_pwd = /(?=.*\d)(?=.*[a-zA-Z]).{8,}/;

    if (!emailValue) {
        errorDiv.textContent = '이메일을 입력해주세요.';
        inputEmail.focus();
        return;
    } else if (!regex_email.test(emailValue)) {
        errorDiv.textContent = '올바른 이메일 형식을 써주세요.';
        inputEmail.focus();
        return;
    }

    if (!nameValue) {
        errorDiv.textContent = '이름을 입력해주세요.';
        inputName.focus();
        return;
    } else if (!regex_name.test(nameValue)) {
        errorDiv.textContent = '한글이나 영어로 2글자 이상 써주세요';
        inputName.focus();
        return;
    }

    if (!pwdValue) {
        errorDiv.textContent = '비밀번호를 입력해주세요.';
        inputPwd.focus();
        return;
    } else if (pwdValue === emailValue) {
        errorDiv.textContent = '아이디와 다르게 비밀번호를 입력해주세요.';
        inputPwd.focus();
        return;
    } else if (!regex_pwd.test(pwdValue)) {
        errorDiv.textContent = '문자와 숫자 1개 이상 포함, 8자리 이상의 비밀번호를 입력해주세요.';
        inputPwd.focus();
        return;
    }

    signUp(emailValue, nameValue, pwdValue);
});

async function signUp(email, name, pwd) {
    const auth = getAuth(app);
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, pwd);
        const user = userCredential.user;
        await updateUserDisplayName(user, name);
        const userId = user.uid;
        sessionStorage.setItem('userId', userId);
        sessionStorage.setItem('userEmail', email);
        sessionStorage.setItem('userName', name);
        await addUserData(userId, email, name);
        alert(`반갑습니다:) 
        회원가입이 완료되었습니다!`);
        redirectToMembershipt();
    } catch (error) {
        if (error.code == 'auth/email-already-in-use') {
            alert('이미 사용중인 아이디 입니다.');
            if (inputEmail) {
                inputEmail.focus();
            }
        }
    }
}

async function updateUserDisplayName(user, name) {
    try {
        await updateProfile(user, { displayName: name });
        console.log('사용자 이름 설정 성공');
    } catch (error) {
        console.error('사용자 이름 설정 실패:', error);
    }
};

async function addUserData(userId, userEmail, userName) {
    const db = getFirestore(app);
    try {
        await setDoc(doc(db, 'users', userId), {
            email: userEmail,
            name: userName
        });
        console.log('유저 저장 완료');
    } catch (e) {
        console.error(`유저 정보 추가 에러: ${e}`)
    }
}

function redirectToMembershipt() {
    window.location.href = '../html/membership.html';
}
