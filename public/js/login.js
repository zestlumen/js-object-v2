import app from './firebaseConfig.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-analytics.js';
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js';
import { getFirestore, doc, getDoc } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js';

const auth = getAuth(app);
const analytics = getAnalytics(app);

const btnLogo = document.getElementById('imgLogo');
const btnJoin = document.getElementById('btnJoin');
const btnBack = document.getElementById('btnBack');
const btnEmailLogin = document.getElementById('btnEmailLogin');
const btnGoogleLogin = document.getElementById('gLoginBtn');
const inputEmail = document.getElementById('inputEmail');
const inputPwd = document.getElementById('inputPwd');
const errorDiv = document.getElementById('errorDiv');

btnLogo.addEventListener('click', _ => location.href = '../index.html');
btnJoin.addEventListener('click', _ => location.href = '../html/join.html');
btnBack.addEventListener('click', _ => history.back());
btnEmailLogin.addEventListener('click', _ => location.href = '../html/emailLogin.html');

document.getElementById('loginBtn').addEventListener('click', async (e) => {
    e.preventDefault();
    if (inputEmail.value.trim() === '') {
        errorDiv.textContent = "이메일을 입력해주세요!";
        inputEmail.focus();
    } else if (inputPwd.value.trim() === '') {
        errorDiv.textContent = "비밀번호를 입력해주세요!";
        inputPwd.focus();
    } else {
        await signIn(inputEmail.value, inputPwd.value);
        checkMembership();
    }
});

inputEmail.addEventListener('keyup', (e) => {
    const regex_email = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
    let emailValue = e.target.value;
    if (!regex_email.test(emailValue)) {
        errorDiv.textContent = "올바른 이메일로 입력해주세요";
        inputEmail.focus();
        return;
    }
    errorDiv.textContent = '';
});

inputPwd.addEventListener('keyup', (e) => {
    let pwdValue = e.target.value;
    if (pwdValue) {
        errorDiv.textContent = '';
    }
});

btnGoogleLogin.addEventListener('click', () => {
    googleSingInLogin();
    checkMembership();
    a()
});


async function signIn(loginId, loginPwd) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, loginId, loginPwd);
        const user = userCredential.user;
        sessionStorage.setItem('userId', user.uid);
        sessionStorage.setItem('userEmail', user.email);
        sessionStorage.setItem('userName', user.displayName);
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode === 'auth/invalid-email') {
            alert('잘못된 형식의 이메일 주소입니다.');
        }
        if (errorCode === 'auth/wrong-password') {
            alert('올바르지 않은 비밀번호 입니다.');
        }
        if (errorCode === 'auth/user-not-found') {
            alert('해당 이메일 주소를 사용하는 계정을 찾을 수 없습니다.');
        }
        console.log(errorCode, errorMessage)
    }
}

async function googleSingInLogin() {
    const provider = new GoogleAuthProvider();

    try {
        await provider.setCustomParameters({ prompt: 'select_account' });
        const result = signInWithPopup(auth, provider);
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        console.log(user)
        sessionStorage.setItem('userId', user.uid);
        sessionStorage.setItem('userEmail', user.email);
        sessionStorage.setItem('userName', user.displayName);

    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        const errorEmail = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log(error);
        console.log(`에러코드 ${errorCode}`);
        console.log(`에러메시지 ${errorMessage}`);
        console.log(`에러이메일 ${errorEmail}`);
        console.log(credential)
    }
}

async function checkMembership() {
    const db = getFirestore(app);
    const userId = sessionStorage.getItem('userId');
    const docRef = doc(db, 'users', userId);
    console.log(typeof (userId), userId)
    try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const membership = docSnap.data().membership;
            if (membership) {
                console.log(membership)
                sessionStorage.setItem('membership', membership);
                window.location.href = '../html/multiUserProfile.html';
            } else {
                console.log('membership 데이터 없음');
                location.href = '../html/membership.html';
            }
        } else {
            console.log('user정보 없음');
        }
    } catch (e) {
        console.error('문서검색 중 오류발생', e);
    }
}