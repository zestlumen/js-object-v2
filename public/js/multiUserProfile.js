import app from './firebaseConfig.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-analytics.js';
import { getFirestore, doc, getDoc } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js';
// import { getStorage } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-storage.js';

// const storage = getStorage(app);
const analytics = getAnalytics(app);

const btnImgLogo = document.getElementById('btnImgLogo');
const btnProfileUpdate = document.getElementById('btn_update');
const liElements = document.querySelectorAll('li');
const membership = sessionStorage.getItem('membership');

btnProfileUpdate.addEventListener('click', _ => location.href = '../html/updateMultiUserProfile.html');

displayProfile();
usersInfo();


saveUserImagesToLocalStorage();//localStorage에 2개만 변환됨..
savePosterImagesToLocalStorage();
saveMainDramaImage();

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

liElements.forEach((li) => {
    li.addEventListener('click', (e) => {
        const currentUser = e.currentTarget.dataset.user;
        const currentName = sessionStorage.getItem(currentUser);
        const num = currentUser.charAt(currentUser.length - 1);
        const currentUrl = localStorage.getItem(`profileURL${num}`);
        sessionStorage.setItem('currentUser', currentUser);
        sessionStorage.setItem('currentName', currentName);
        sessionStorage.setItem('currentUrl', currentUrl);
        alert(`오브젝트를 방문해주셔서 감사합니다 :)
        영상재생화면 구현은 우리들의 블루스에서만 볼 수 있습니다!`);
        window.location.href = '../html/main.html';
    });
});



async function displayProfile() {
    if (membership === 'premium') {
        for (let i = 1; i < 5; i++) {
            if (isKeyExists(`profileURL${i}`)) {
                const imgUrl = localStorage.getItem(`profileURL${i}`);
                const proImg = document.getElementById(`pro_img${i}`);
                if (imgUrl && proImg) proImg.src = imgUrl;
            } else {
                try {
                    // const imgUrl = await getImage(`profile/pro${i}.jpg`);
                    const imgUrl = `../img/img_profile/pro${i}.jpg`;
                    const proImg = document.getElementById(`pro_img${i}`);
                    if (imgUrl) {
                        proImg.src = imgUrl;
                        localStorage.setItem(`profileURL${i}`, imgUrl);
                    }

                } catch (e) {
                    console.error('오류발생:', e);
                }
            }
        }
    } else if (membership === 'basic') {
        try {
            displayNonePremium();
            // const imgUrl = await getImage('');
            const imgUrl = '../img/img_profile/pro1.jpg';
            const proImg1 = document.getElementById("pro_img1");
            if (imgUrl) {
                proImg1.src = imgUrl;
                localStorage.setItem(`profileURL1`, imgUrl);
            }
        } catch (e) {
            console.error('오류발생:', e);
        }

    }
}


function isKeyExists(key) {
    return key in localStorage;
}

function displayNonePremium() {
    for (let i = 2; i < 5; i++) {
        document.getElementById(`profile_li${i}`).classList.add('not_prem');
    }
}

async function usersInfo() {
    const db = getFirestore(app);
    const userId = sessionStorage.getItem('userId');
    const docRef = doc(db, 'members', userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        const users = docSnap.data();
        Object.entries(users).forEach(([key, value]) => {
            document.getElementById(key).innerText = value;
            sessionStorage.setItem(key, value);
        });
    } else {
        console.error('유저정보가 없습니다');
    }
}


//mainPoster Img Base64변환 및 localstorage저장
function getImageBase64(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const dataURL = canvas.toDataURL('image/jpg')
            resolve(dataURL);
        };
        img.onerror = reject;
        img.src = url;
    });
}

async function saveUserImagesToLocalStorage() {
    const imgUrls = [
        '../img/img_profile/pro1.jpg',
        '../img/img_profile/pro2.jpg',
        '../img/img_profile/pro2.jpg',
        '../img/img_profile/pro2.jpg'
    ];
    for (const imgUrl of imgUrls) {
        try {
            const localKey = `profileURL${imgUrl.replace(/\D/g, '')}`;
            const base64Data = await getImageBase64(imgUrl);
            localStorage.setItem(localKey, base64Data);
        } catch (e) {
            console.error('이미지 로드 및 변환 실패:', e);
        }
    }
}

//그냥 local에 저장하기.. 뒤에 코드 다 바꿀 수 없음
function savePosterImagesToLocalStorage() {
    const imgUrls = [
        '../img/img_movie/1_our_blues_kd.jpg',
        '../img/img_movie/2_minamdang_kd.jpg',
        '../img/img_movie/3_WhyOhSoojae_kd.jpg',
        '../img/img_movie/4_human disqualification_kd.jpg',
        '../img/img_movie/6_WhenTheCamelliaBlooms_kd.jpg',
        '../img/img_movie/10_TheNotebook_fm.jpg',
        '../img/img_movie/11_Flipped_fm.jpg',
        '../img/img_movie/12_InterferingWithLove_vs.jpg',
        '../img/img_movie/13_GoldenCounselingCenter_vs.jpg',
        '../img/img_movie/17_RoundTheNeighborhood_do.jpg',
        '../img/img_movie/19_MetYou_do.jpg',
        '../img/img_movie/20_3DaysDocumentary_do.jpg',
        '../img/img_movie/21_KissTheUniverse_do.jpg',
        '../img/img_movie/22_CardCaptorCherry_an.jpg',
        '../img/img_movie/23_Conan_an.jpg',
        '../img/img_movie/24_OnePiece_an.jpg',
        '../img/img_movie/25_HighQ_an.jpg',
        '../img/img_movie/26_CSI_fd.jpg',
        '../img/img_movie/27_Why_Women_Kill_fd.jpg',
        '../img/img_movie/28_The_Big_Bang_Theory_fd.jpg',
        '../img/img_movie/29_Late_Night_Restaurant_fd.jpg',
        '../img/img_movie/30_unnatural_death_fd.jpg',
        '../img/img_movie/31_Gravity_fm.jpg',
        '../img/img_movie/32_Inception_fm.jpg',
        '../img/img_movie/33_Snowpiercer_km.jpg',
        '../img/img_movie/34_Knives_Out_fm.jpg',
        '../img/img_movie/36_national_receipt_vs.jpg',
        '../img/img_movie/39_Running_Man_vs.jpg',
        '../img/img_movie/40_ghost_story_vs.jpg',
        '../img/img_movie/41_Dont_Cross_That_River_do.jpg',
        '../img/img_movie/42_The_Secret_Life_of_Cats_do.jpg',
        '../img/img_movie/43_1919_do.jpg',
        '../img/img_movie/47_Summer_Wars_an.jpg',
        '../img/img_movie/49_moonlight_angel_an.jpg',
        '../img/img_movie/50_witch_km.jpg',
        '../img/img_movie/51_Believer_km.jpg',
        '../img/img_movie/52_ToYoonhee_km.jpg',
        '../img/img_movie/53_little_princess_km.jpg'
    ];

    for (const imgUrl of imgUrls) {
        try {
            const localKey = imgUrl.substring(17);
            localStorage.setItem(localKey, imgUrl);
        } catch (e) {
            console.error('이미지 로드 및 변환 실패:', e);
        }
    }
}

function saveMainDramaImage() {
    const imgUrls = [
        '../img/img_logomain/main_ourblues.jpg',
        '../img/img_logomain/object_logo.png'
    ];

    for (const [index, imgUrl] of imgUrls.entries()) {
        const localKey = index === 0 ? 'mainDramaUrl' : 'logoUrl';
        if (localKey !== null && imgUrl !== null) {
            localStorage.setItem(localKey, imgUrl);
        }
    }
}


// async function saveMainDramaImage() {
    //     const imagesRef = ref(storage, 'imgLogo');
    //     const imgList = await listAll(imagesRef);
    //     console.log(checkLocalStorageMovieImg())
    //     if (localStorage.getItem('logoUrl')) {
    //         return;
    //     }
    //     for (const [index, imageRef] of imgList.items.entries()) {
    //         const imageUrl = await getDownloadURL(imageRef);
    //         const localKey = index === 0 ? 'mainDramaUrl' : 'logoUrl';
    //         if (localKey !== null && imageUrl !== null) {
    //             localStorage.setItem(localKey, imageUrl);
    //         }
    //     };
    // }

//-------파이어베이스 데이터 읽기 초과

// async function getImage(url) {
//     const storageRef = ref(storage, url);
//     try {
//         const downloadURL = await getDownloadURL(storageRef);
//         return downloadURL;
//     } catch (e) {
//         console.error(`오류발생: ${e}`);
//         return null;
//     }
// }

// async function saveMovieImage() {
//     const imagesRef = ref(storage, 'imgMovie');
//     const imgList = await listAll(imagesRef);
//     console.log(checkLocalStorageMovieImg())
//     if (checkLocalStorageMovieImg()) {
//         return;
//     }
//     for (const imageRef of imgList.items) {
//         const imageUrl = await getDownloadURL(imageRef);
//         const localKey = getLocalKeyFromImageUrl(imageUrl);
//         console.log(imageUrl, localKey)
//         if (localKey !== null && imageUrl !== null) {
//             localStorage.setItem(localKey, imageUrl);
//         }
//     };
// }

// function getLocalKeyFromImageUrl(imageUrl) {
//     const regex = /2F(\d+)_/;
//     const matches = imageUrl.match(regex);
//     if (matches && matches.length > 1) {
//         const num = matches[1];
//         return num;
//     };
//     return null;
// }


// function checkLocalStorageMovieImg() {
//     for (let i = 0; i < localStorage.length; i++) {
//         const key = localStorage.key(i);
//         const value = localStorage.getItem(key);
//         if (value.includes('imgMovie')) {
//             return true;
//         }
//     }
//     return false;
// }

// async function saveMainDramaImage() {
//     const imagesRef = ref(storage, 'imgLogo');
//     const imgList = await listAll(imagesRef);
//     console.log(checkLocalStorageMovieImg())
//     if (localStorage.getItem('logoUrl')) {
//         return;
//     }
//     for (const [index, imageRef] of imgList.items.entries()) {
//         const imageUrl = await getDownloadURL(imageRef);
//         const localKey = index === 0 ? 'mainDramaUrl' : 'logoUrl';
//         if (localKey !== null && imageUrl !== null) {
//             localStorage.setItem(localKey, imageUrl);
//         }
//     };
// }



// -------The localStorage has exceeded the quota (로컬스토리지 할당량 초과)

// async function savePosterImagesToLocalStorage() {
//     const imgUrls = [
//         '../img/img_movie/1_our blues_kd.jpg',
//         '../img/img/img_movie/2_minamdang_kd.jpg',
//         '../img/img_movie/3_WhyOhSoojae_kd.jpg',
//         '../img/img_movie/4_human disqualification_kd.jpg',
//         '../img/img_movie/6_WhenTheCamelliaBlooms_kd.jpg',
//         '../img/img_movie/10_TheNotebook_fm.jpg',
//         '../img/img_movie/11_Flipped_fm.jpg',
//         '../img/img_movie/12_InterferingWithLove_vs.jpg',
//         '../img/img_movie/13_GoldenCounselingCenter_vs.jpg',
//         '../img/img_movie/17_RoundTheNeighborhood_do.jpg',
//         '../img/img_movie/19_MetYou_do.jpg',
//         '../img/img_movie/20_3DaysDocumentary_do.jpg',
//         '../img/img_movie/21_KissTheUniverse_do.jpg',
//         '../img/img_movie/22_CardCaptorCherry_an.jpg',
//         '../img/img_movie/23_Conan_an.jpg',
//         '../img/img_movie/24_OnePiece_an.jpg',
//         '../img/img_movie/25_HighQ_an.jpg',
//         '../img/img_movie/26_CSI_fd.jpg',
//         '../img/img_movie/27_Why_Women_Kill_fd.jpg',
//         '../img/img_movie/28_The_Big_Bang_Theory_fd.jpg',
//         '../img/img_movie/29_Late_Night_Restaurant_fd.jpg',
//         '../img/img_movie/30_unnatural_death_fd.jpg',
//         '../img/img_movie/31_Gravity_fm.jpg',
//         '../img/img_movie/32_Inception_fm.jpg',
//         '../img/img_movie/33_Snowpiercer_km.jpg',
//         '../img/img_movie/34_Knives_Out_fm.jpg',
//         '../img/img_movie/36_national_receipt_vs.jpg',
//         '../img/img_movie/39_Running_Man_vs.jpg',
//         '../img/img_movie/40_ghost_story_vs.jpg',
//         '../img/img_movie/41_Dont_Cross_That_River_do.jpg',
//         '../img/img_movie/42_The_Secret_Life_of_Cats_do.jpg',
//         '../img/img_movie/43_1919_do.jpg img/img_movie/47_Summer_Wars_an.jpg',
//         '../img/img_movie/47_Summer_Wars_an.jpg',
//         '../img/img_movie/49_moonlight_angel_an.jpg',
//         '../img/img_movie/50_witch_km.jpg',
//         '../img/img_movie/51_Believer_km.jpg',
//         '../img/img_movie/52_ToYoonhee_km.jpg',
//         '../img/img_movie/53_little_princess_km.jpg'
//     ];
//     for (const imgUrl of imgUrls) {
//         try {
//             const localKey = `profileURL${imgUrl.substring(17)}`;
//             const base64Data = await getImageBase64(imgUrl);
//             localStorage.setItem(localKey, base64Data);
//         } catch (e) {
//             console.error('이미지 로드 및 변환 실패:', e);
//         }
//     }
// }