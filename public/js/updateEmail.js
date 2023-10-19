import app from './firebaseConfig.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-analytics.js';
import { signInWithEmailAndPassword, getAuth, updateEmail } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js';

const analytics = getAnalytics(app);

const btnImgLogo = document.getElementById('btnImgLogo');
const btnBack = document.getElementById('btnBack');
const btnChange = document.getElementById('btnChange');
const btnCancle = document.getElementById('btnCancle');
const preUserEmail = sessionStorage.getItem('userEmail');
const inputPwd = document.getElementById('userPwd');
let confirmEmail = false;
let confirmPwd = false;

btnImgLogo.addEventListener('click', _ => location.href = '../html/main.html');
btnBack.addEventListener('click', _ => history.back());
btnCancle.addEventListener('click', _ => location.href = '../html/settings.html');

displayCurrentEmail();
validateEmailandPwd();

btnChange.addEventListener('click', _ => changeEmail(preUserEmail, inputPwd.value));

function displayCurrentEmail() {
    const currentEmail = document.getElementById('currentEmail');;
    const sessionPreEmail = sessionStorage.getItem('userEmail');
    currentEmail.textContent = sessionPreEmail;
}

function validateEmailandPwd() {
    const errorDivEmail = document.getElementById('errorMsgEmail');
    const errorDivPwd = document.getElementById('errorMsgPwd');
    const inputEmail = document.getElementById('newEmail');

    inputEmail.addEventListener('keyup', (e) => {
        let inputValue = e.target.value;
        const regex_email = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;

        if (!inputValue) {
            errorDivEmail.textContent = '이메일을 입력해주세요';
            inputEmail.focus();
            confirmEmail = false;
            checkBtn();
            return;
        } else if (!regex_email.test(inputValue)) {
            errorDivEmail.textContent = '올바른 이메일 형식을 써주세요.';
            inputEmail.focus();
            confirmEmail = false;
            checkBtn();
            return;
        } else if (inputValue === preUserEmail) {
            errorDivEmail.textContent = '이전 이메일과 다른 이메일로 써주세요.';
            inputEmail.focus();
            confirmEmail = false;
            checkBtn();
            return;
        } else {
            errorDivEmail.textContent = '';
        }

        if (regex_email.test(inputValue)) {
            confirmEmail = true;
        } else {
            confirmEmail = false;
        }

        checkBtn();
    });

    inputPwd.addEventListener('keyup', (e) => {
        let inputValue = e.target.value;
        const regex_pwd = /(?=.*\d)(?=.*[a-zA-Z]).{8,}/;

        if (!inputValue) {
            errorDivPwd.textContent = '비밀번호를 입력해주세요';
            inputPwd.focus();
            confirmPwd = false;
            checkBtn();
            return;
        } else if (!regex_pwd.test(inputValue)) {
            errorDivPwd.textContent = '문자와 숫자 1개 이상 포함, 8자리 이상의 비밀번호를 입력해주세요.';
            inputPwd.focus();
            confirmPwd = false;
            checkBtn();
            return;
        } else if (inputValue === inputEmail.value) {
            errorDivPwd.textContent = '아이디와 다르게 비밀번호를 입력해주세요.';
            inputPwd.focus();
            confirmPwd = false;
            checkBtn();
            return;
        } else {
            errorDivPwd.textContent = '';
        }

        if (regex_pwd.test(inputValue)) {
            confirmPwd = true;
        } else {
            confirmPwd = false;
        }

        checkBtn();
    });

    checkBtn();
}

function checkBtn() {
    if (confirmEmail === true && confirmPwd === true) {
        btnChange.classList.remove('btn-disabled');
    } else {
        btnChange.classList.add('btn-disabled');
    }
}

async function changeEmail(preEmail, pwd) {
    const auth = await getAuth(app);
    let newEmail = document.getElementById('newEmail').value;
    try {
        await signInWithEmailAndPassword(auth, preEmail, pwd);
        await updateEmail(auth.currentUser, newEmail);
        sessionStorage.setItem('userEmail', newEmail);
        newEmail = '';
        inputPwd.value = '';
        const alertRedirect = confirm(`이메일이 변경되었습니다.
        계정설정 페이지로 이동하시겠습니까?`);
        if (alertRedirect) {
            location.href = '../html/settings.html';
        }
        displayCurrentEmail();
    } catch (e) {
        const errorCode = e.code;
        const errorMessage = e.message;
        if (errorCode === 'auth/invalid-email') {
            alert('잘못된 이메일 형식입니다.');
        }
        if (errorCode === 'auth/wrong-password') {
            alert('잘못된 비밀번호 입니다.');
        }
        if (errorCode === 'auth/user-not-found') {
            alert('해당 이메일 주소를 사용하는 계정을 찾을 수 없습니다.');
        }
        if (errorCode === 'auth/too-many-requests') {
            alert('죄송합니다. 너무 많은 요청이 발생하여 일시적으로 차단되었습니다.');
        }
        if (errorCode === 'auth/network-request-failed') {
            alert('죄송합니다. 네트워크 연결 오류가 발생하였습니다.');
        }
        console.log(errorCode, errorMessage)
    }
}


// function validateInput(inputElement, regex, errorMsgElement, errorMsg) {
//     const inputValue = inputElement.value;
//     if (!inputValue) {
//         errorMsgElement.textContent = errorMsg;
//         inputElement.focus();
//         return false;
//     } else if (!regex.test(inputValue)) {
//         errorMsgElement.textContent = errorMsg;
//         inputElement.focus();
//         return false;
//     } else {
//         errorMsgElement.textContent = '';
//         return true;
//     }
// }

// function validateEmailandPwd() {
//     const inputEmail = document.getElementById('newEmail');
//     const inputPwd = document.getElementById('userPwd');
//     const errorDivEmail = document.getElementById('errorMsgEmail');
//     const errorDivPwd = document.getElementById('errorMsgPwd');

//     let confirmEmail = false;
//     let confirmPwd = false;

//     function checkBtn() {
//         if (confirmEmail === true && confirmPwd === true) {
//             btnChange.classList.remove('btn-disabled');
//         } else {
//             btnChange.classList.add('btn-disabled');
//         }
//     };

//     inputEmail.addEventListener('keyup', () => {
//         const regex_email = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
//         const errorMsg2 = '올바른 이메일 형식을 써주세요.';
//         confirmEmail = validateInput(inputEmail, regex_email, errorDivEmail, errorMsg2);
//         checkBtn();
//     });
//     inputPwd.addEventListener('keyup', () => {
//         const regex_pwd = /(?=.*\d)(?=.*[a-zA-Z]).{8,}/;
//         const errorMsg = '문자와 숫자 1개 이상 포함, 8자리 이상의 비밀번호를 입력해주세요.';
//         confirmEmail = validateInput(inputEmail, regex_email, errorDivPwd, errorMsg);
//         checkBtn();
//     });
//     checkBtn();
// }