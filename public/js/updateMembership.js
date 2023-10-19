import app from './firebaseConfig.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-analytics.js';
import { getFirestore, updateDoc, doc, setDoc } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js';

const db = getFirestore(app);
const analytics = getAnalytics(app);

const btnImgLogo = document.getElementById('btnImgLogo');
const btnChange = document.getElementById('btn_free_chg');
const preMembership = sessionStorage.getItem("membership");
const userId = sessionStorage.getItem('userId');
let membership = '';

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

selectedMembershipToChange();

btnChange.addEventListener('click', async _ => {
    if (preMembership === 'basic') {
        membership = 'premium';
    } else if (preMembership === 'premium') {
        membership = 'basic';
    }
    await addUserMembership();
    await addMembersData();
    updateSessionStorage();
    location.href = "../html/settings.html";
});

function selectedMembershipToChange() {
    const headline = document.getElementById('chg_freepass_h3');
    const description = document.getElementById('chg_freepass_info');
    const liBasic = document.querySelectorAll('.basic_li');
    const liPremium = document.querySelectorAll('.premium_li');
    const btnBasic = document.getElementById('btn_basic');
    const btnPremium = document.getElementById('btn_premium');

    if (preMembership === "basic") {
        headline.textContent = "프리미엄으로 변경하시겠습니까?";
        description.textContent = "Ultra HD 4K 화질 제공, 4명 동시재생 가능한 프로필 상태로 변경됩니다.";
        btnPremium.classList.add('choicBorder');
        liPremium.forEach(li => {
            li.classList.add('choiceFont');
        });
    } else if (preMembership === "premium") {
        headline.textContent = "베이직으로 변경하시겠습니까?";
        description.textContent = "동시 재생이 지원되지 않아 기본 프로필 제외한 다른 프로필은 잠금 상태로 변경됩니다.";
        btnBasic.classList.add('choicBorder');
        liBasic.forEach(li => {
            li.classList.add('choiceFont');
        });
    }
}


async function addUserMembership() {
    const date = new Date().toLocaleString().replace(" ", "");
    const docRef = doc(db, 'users', userId);
    try {
        await updateDoc(docRef, {
            membership: `${membership}`,
            date: `${date}`
        });
        console.log('user정보에 멤버십,날짜 시간 추가 완료');
    } catch (e) {
        console.error('멤버십,날찌 시간 추가 에러', e);
    }
}

async function addMembersData() {
    try {
        if (membership === 'premium') {
            await setDoc(doc(db, 'members', userId), {
                user1: 'user1',
                user2: 'user2',
                user3: 'user3',
                user4: 'user4',
            });
        } else if (membership === 'basic') {
            await setDoc(doc(db, 'members', userId), {
                user1: 'user1'
            });
        }
        console.log('멤버 저장 완료');
    } catch (e) {
        console.error(`멤버 정보 추가 에러: ${e}`);
    }
}

function updateSessionStorage() {
    const keys = ['updateProfileName', 'updateProfileUserNum', 'updateProfileUrl'];
    const defaultUserURL = localStorage.getItem('profileURL1');

    keys.forEach(key => {
        if (sessionStorage.getItem(key)) {
            sessionStorage.removeItem(key);
        }
    });

    if (membership === 'basic') {
        sessionStorage.setItem('user1', 'user1');
        for (let i = 2; i < 5; i++) {
            sessionStorage.removeItem(`user${i}`);
        }
    } else if (membership === 'premium') {
        for (let i = 2; i < 5; i++) {
            sessionStorage.setItem(`user${i}`, `user${i}`);
        }
    }
    sessionStorage.setItem('membership', membership);
    sessionStorage.setItem('currentName', 'user1');
    sessionStorage.setItem('currentUrl', defaultUserURL);
};

