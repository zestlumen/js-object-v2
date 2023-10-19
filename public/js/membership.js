import app from './firebaseConfig.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-analytics.js';
import { getFirestore, updateDoc, doc, setDoc } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js';

const db = getFirestore(app);
const analytics = getAnalytics(app);

const membership1 = document.getElementById('membership1');
const membership2 = document.getElementById('membership2');
const btn_start = document.getElementById('btn_start');
const userId = sessionStorage.getItem('userId');
let membership = 'premium';

membership1.addEventListener('click', _ => {
    membership = 'basic';
    chgMembership();
});

membership2.addEventListener('click', _ => {
    membership = 'premium';
    chgMembership();
});

btn_start.addEventListener('click', async _ => {
    sessionStorage.setItem('membership', membership);
    await addUserMembership();
    await addMembersData();
    redirectToMulitUserProfile();
});

function chgMembership() {
    const btn_basic = document.getElementById('btn_basic');
    const btn_premium = document.getElementById('btn_premium');
    membership1.style.color = (membership === 'premium') ? 'rgb(70, 70, 70)' : 'rgb(112, 157, 248)';
    membership2.style.color = (membership === 'premium') ? 'rgb(112, 157, 248)' : 'rgb(70, 70, 70)';
    btn_basic.style.border = (membership === 'premium') ? '1px solid rgb(70, 70, 70)' : '1px solid rgb(112, 157, 248)';
    btn_basic.style.color = (membership === 'premium') ? 'rgb(70, 70, 70)' : 'rgb(112, 157, 248)';
    btn_premium.style.border = (membership === 'premium') ? '1px solid rgb(112, 157, 248)' : '1px solid rgb(70, 70, 70)';
    btn_premium.style.color = (membership === 'premium') ? 'rgb(112, 157, 248)' : 'rgb(70, 70, 70)';
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

function redirectToMulitUserProfile() {
    window.location.href = '../html/multiUserProfile.html';
}
