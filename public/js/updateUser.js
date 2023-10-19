import app from './firebaseConfig.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-analytics.js';
import { getFirestore, doc, updateDoc } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js';

const analytics = getAnalytics(app);

const btnImgLogo = document.getElementById('btnImgLogo');
const profileName = document.getElementById('pro_name');
const preName = sessionStorage.getItem('updateProfileName');
const btnUpdate = document.getElementById('btn_update');
const nameErrorSpan = document.getElementById('nameErrorSpan');

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

await getToBeUpdatedProfile();

btnUpdate.addEventListener('click', _ => {
    if (profileName.value.trim() === '') {
        nameErrorSpan.textContent = "이름을 입력해주세요!";
        profileName.focus();
    } else if (profileName.value === preName) {
        window.location.href = '../html/updateMultiUserProfile.html';
    } else {
        profileUpdate(profileName.value);
    }
});

profileName.addEventListener('keyup', (e) => {
    let inputValue = e.target.value;
    const regex = /^[가-힣a-zA-Z0-9]{2,8}$/;
    if (!regex.test(inputValue)) {
        nameErrorSpan.textContent = "한글,영어,숫자로 이루어진 2~8자리까지 입력해주세요";
        profileName.focus();
    } else {
        nameErrorSpan.textContent = '';
    }
});

async function getToBeUpdatedProfile() {
    const profileImg = document.getElementById('pro_img1');
    const preImg = sessionStorage.getItem('updateProfileUrl');
    if (profileImg && profileName) {
        profileImg.src = preImg;
        profileName.value = preName;
    }
}

function profileUpdate(inputValue) {
    const db = getFirestore(app);
    const userId = sessionStorage.getItem('userId');
    const userNum = sessionStorage.getItem('updateProfileUserNum');
    const docRef = doc(db, 'members', userId);
    updateDoc(docRef, { [userNum]: inputValue })
        .then(() => {
            console.log('문서 업데이트 성공');
            sessionStorage.setItem(userNum, inputValue);
            window.location.href = '../html/updateMultiUserProfile.html';
        })
        .catch((error) => {
            console.error('문서 업데이트 에러:', error);
        });
}



