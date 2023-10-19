
import app from './firebaseConfig.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-analytics.js';
import { getFirestore, doc, getDoc } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-storage.js';


const analytics = getAnalytics(app);
const storage = getStorage(app);

const videoMovie = document.getElementById("video_movie");
const videoSideList = document.getElementById("video_movie_sideList");
const videoAdLists = {
    place_img_list: [],
    place_name_list: [],
    place_section_list: [],
    place_url_list: [],
    pro_img_list: [],
    pro_name_list: [],
    pro_url_list: [],
    pro_section_list: []
};

await getVideoAdDataList();

videoMovie.src = '../video/movie_ourblues.mp4';
videoSideList.classList.remove('video_movie_sideList_visible'); videoMovie.classList.add('video_movie_full');
videoMovie.classList.add('video_movie_full');
videoMovie.muted = true;

videoMovie.addEventListener('click', _ => {
    videoSideList.classList.remove('video_movie_sideList_visible');
    videoMovie.classList.add('video_movie_full');
})

requestAnimationFrame(checkCurrentTime);

let lastTime = 0;

function checkCurrentTime(timestamp) {
    const elapsedTime = timestamp - lastTime;
    if (elapsedTime >= 1000) {
        const currentTime = Math.floor(videoMovie.currentTime);
        lastTime = timestamp;



        const proSections = videoAdLists.pro_section_list;
        const placeSections = videoAdLists.place_section_list;

        for (let i = 0; i < proSections.length; i++) {
            if (proSections[i] == currentTime || proSections[i] < currentTime) {
                for (let j = 0; j < i + 1; j++) {
                    let itemDiv = document.getElementById(`pro_item${j + 1}`);
                    itemDiv && itemDiv.classList.add('div_item_visible');
                    if (proSections[j] == currentTime) {
                        itemDiv && itemDiv.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            }
        }

        for (let i = 0; i < placeSections.length; i++) {
            if (placeSections[i] == currentTime || placeSections[i] < currentTime) {
                for (let j = 0; j < i + 1; j++) {
                    let itemDiv = document.getElementById(`place_item${j + 1}`);
                    itemDiv && itemDiv.classList.add('div_item_visible');
                    if (placeSections[j] == currentTime) {
                        itemDiv && itemDiv.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            }
        }
    }

    requestAnimationFrame(checkCurrentTime);
}

function sideScrollPosition(listName, currentTime) {
    for (let i = 0; i < listName.length; i + 2) {
        if (listName[i] == currentTime) {
            const divItem = listName == proSections ? document.getElementById(`pro_item${i + 1}`) : document.getElementById(`place_item${i + 1}`);
            divItem.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

//showIconHeader();
const divVideoMovie = document.getElementById("div_video_movie");
const videoHeader = document.getElementById("video_movie_header");
divVideoMovie.addEventListener('mouseover', _ => {
    videoHeader.classList.add('visible');
});
divVideoMovie.addEventListener('mouseout', _ => {
    videoHeader.classList.remove('visible');
});

//header Btn clickEvent
const headerBackBtn = document.getElementById("video_movie_back");
const headerProblemBtn = document.getElementById('video_movie_problem');

const headerClothesBtn = document.getElementById("video_movie_clothes");
const headerPlaceBtn = document.getElementById("video_movie_place");
const video_movie_sideList = document.getElementById('video_movie_sideList');
const video_sideList1 = document.getElementById('video_sideList1');
const video_sideList2 = document.getElementById('video_sideList2');

headerBackBtn.addEventListener('click', _ => {
    history.back();
});
headerProblemBtn.addEventListener('click', function () {
});

headerClothesBtn.addEventListener('click', _ => {
    handleAdBtnClick(video_sideList1, videoAdLists.pro_img_list, videoAdLists.pro_url_list, videoAdLists.pro_section_list, videoAdLists.pro_name_list);
});

headerPlaceBtn.addEventListener('click', _ => {
    handleAdBtnClick(video_sideList2, videoAdLists.place_img_list, videoAdLists.place_url_list, videoAdLists.place_section_list, videoAdLists.place_name_list);
});

function handleAdBtnClick(sideList, imgList, urlList, sectionList, nameList) {
    if (videoMovie.classList.contains('video_movie_full')) {
        videoMovie.classList.remove('video_movie_full');
        video_movie_sideList.classList.add('video_movie_sideList_visible');
        video_sideList1.classList.toggle('sideList_none', sideList !== video_sideList1);
        video_sideList2.classList.toggle('sideList_none', sideList !== video_sideList2);
    } else {
        videoMovie.classList.add('video_movie_full');
    }

    imgList.forEach((img, i) => {
        const url = urlList[i];
        const section = sectionList[i];
        const name = nameList[i];
        displayAdList(section, url, img, name, sideList, i);
    });
}

function displayAdList(time, href, src, name, sideList, i) {
    let hr = Math.floor(parseInt(time) / 3600);
    let min = Math.floor((parseInt(time) - (hr * 3600)) / 60);
    let sec = Math.floor(parseInt(time) - (hr * 3600) - (min * 60));
    if (hr < 10) { hr = "0" + hr; }
    if (min < 10) { min = "0" + min; }
    if (sec < 10) { sec = "0" + sec; }
    if (hr) { hr = "00"; }

    const formattedTime = min + ":" + sec;

    const div_item = document.createElement('div');
    div_item.id = (sideList === document.getElementById('video_sideList1')) ? `pro_item${i + 1}` : `place_item${i + 1}`;
    div_item.classList.add('div_item');
    const time_div = document.createElement('div');
    time_div.classList.add('time_div');
    const a_container = document.createElement('a');
    a_container.classList.add('a_container');
    const name_div = document.createElement('div');
    name_div.classList.add('name_div');
    const img_div = document.createElement('img');
    img_div.classList.add('img_div');

    time_div.innerText = formattedTime;
    img_div.src = src;
    name_div.innerHTML = name;
    a_container.href = href;
    a_container.target = "_blank";
    a_container.append(img_div, name_div);
    div_item.append(time_div, a_container);
    sideList.appendChild(div_item);
}

async function getVideoAdDataList() {
    try {
        const db = getFirestore(app);
        const docRef = doc(db, 'videoAdvertisement', '1');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const videoAd = docSnap.data();
            for (let key in videoAd) {
                if (videoAd.hasOwnProperty(key)) {
                    const value = videoAd[key].split(",");
                    sessionStorage.setItem(key, value);
                    if (key === 'video_section') {
                        videoAdLists[`pro_section_list`] = value;
                    } else {
                        videoAdLists[`${key}_list`] = value;
                    }
                }
            }
        } else {
            console.log('ad데이터 없음')
        }
    } catch (error) {
        console.error(error);
    }
}