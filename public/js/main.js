import app from './firebaseConfig.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-analytics.js';
import { getFirestore, getDoc, getDocs, collection, doc, setDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js';

const analytics = getAnalytics(app);
const db = getFirestore(app);

//myListSet
const currentUser = sessionStorage.getItem('currentUser');
const getStoredValue = await getMyListData(currentUser);
let myListSet = new Set();

if (getStoredValue === undefined) {
    myListSet = new Set();
} else {
    myListSet = new Set(JSON.parse(getStoredValue));
}

//header transparent -scroll change
const header = document.getElementById('mainheader');
const headerHeight = header.getBoundingClientRect().height;

fixedHeadArrowAnimation(header, headerHeight, 'header-dark');

//header btn click event
const btnSettings = document.getElementById('settings');
const btnLogout = document.getElementById('logout');
const btnUpdateMultiUser = document.getElementById('updateMultiUserProfile');
const btnImgLogo = document.getElementById('btnImgLogo');

btnUpdateMultiUser.addEventListener("click", _ => location.href = "../html/updateMultiUserProfile.html");
btnSettings.addEventListener("click", _ => location.href = "../html/settings.html");
btnImgLogo.addEventListener('click', _ => {
    location.href = '../html/main.html';
    if (divMainList.classList.contains('display_none')) {
        divMainList.classList.remove('display_none');
    }
});

btnLogout.addEventListener("click", _ => {
    sessionStorage.clear();
    location.href = "../index.html";
});

displayUsersByMembership();
getCurrentUserProfile();

const multiuserList = document.querySelectorAll('[id^="multiuser"]');
multiuserList.forEach((li) => {
    li.addEventListener('click', async (e) => {
        const preCurrentUser = sessionStorage.getItem(`currentUser`);
        const currentUser = e.currentTarget.dataset.user;

        if (currentUser === preCurrentUser) {
            return;
        } else {
            const currentName = sessionStorage.getItem(currentUser);
            const num = currentUser.charAt(currentUser.length - 1);
            const currentUrl = localStorage.getItem(`profileURL${num}`);

            sessionStorage.setItem('currentUser', currentUser);
            sessionStorage.setItem('currentName', currentName);
            sessionStorage.setItem('currentUrl', currentUrl);
            alert(`현재 사용자는 [${currentName}]님으로 변경되었습니다.`)
            getCurrentUserProfile(currentUrl);
        }
        location.href = '../html/main.html';
    });
});

function getCurrentUserProfile(currentUrl) {
    const currentImg = document.getElementById('current_user');
    if (currentImg) {
        if (currentUrl) {
            currentImg.src = currentUrl;
        }
        else {
            const defaulCurrentUrl = sessionStorage.getItem('currentUrl');
            currentImg.src = defaulCurrentUrl;
        }
    } else {
        console.error('currentUser를 찾을 수가 없습니다');
    }
}

function displayUsersByMembership() {
    const membership = sessionStorage.getItem('membership');
    if (membership === 'premium') {
        for (let i = 1; i < 5; i++) {
            const userName = document.getElementById(`userName${i}`);
            const userImg = document.getElementById(`userImg${i}`);
            if (userName !== null && userImg !== null) {
                userName.textContent = sessionStorage.getItem(`user${i}`);
                userImg.src = localStorage.getItem(`profileURL${i}`);
            }
        }
    } else if (membership === 'basic') {
        for (let i = 2; i < 5; i++) {
            document.getElementById(`multiuser${i}`).classList.add('not_prem');
        }
        document.getElementById('userName1').textContent = sessionStorage.getItem('user1');
        document.getElementById('userImg1').src = localStorage.getItem('profileURL1');
    }
}

//search
const btnSearch = document.getElementById('btn_search');
const inputSearch = document.getElementById('search_text');
const searchXbtn = document.getElementById('search_xBtn');
const searchWindow = document.getElementById('search_window');
const searchTagDiv = document.getElementById('searchTagDiv');
const searchImgDiv = document.getElementById('searchImgDiv');
const searchObj = {};

hideSearchElements();
addSearchArray();
getSearchDataListandTagBtn();

btnSearch.addEventListener('click', _ => {
    toggleSearchElements();
    const btnSearchIcon = document.getElementById('btnSearchIcon');
    const tagBtns = document.querySelectorAll('.tag_btn');
    scrollableElement.classList.toggle('scrollable');
    inputSearch.classList.toggle('search_text_visible');
    btnSearch.classList.toggle('btn_search_translate');
    btnSearchIcon.classList.toggle('btnSearchIcon_color');
    searchWindow.classList.toggle('search_window_visible');
    btnArrowUp.classList.toggle('arrow-display-none');
    tagBtns.forEach(btn => {
        btn.classList.toggle('tag_btn_visible');
    });
})

inputSearch.addEventListener('keyup', (e) => {
    searchImgDiv.innerHTML = '';
    let inputValue = e.currentTarget.value;
    if (inputValue !== '') {
        const tagButtons = document.querySelectorAll('.tag_btn');
        tagButtons.forEach(btn => btn.classList.remove('tag_btn_click'));
        searchXbtn.classList.add('search_xBtn_visible');
        searchTagDiv.classList.add('searchTagDiv_none');

        const createdImages = new Set();
        for (const key in searchObj) {
            const videoTitle = searchObj[key].video_title;
            if (searchObj.hasOwnProperty(key) && videoTitle.includes(inputValue)) {
                if (!createdImages.has(key)) {
                    for (let i = 0; i < localStorage.length; i++) {
                        if (parseInt(localStorage.key(i), 10) == key) {
                            const resultImg = document.createElement('img');
                            resultImg.classList.add('search_result_img');
                            resultImg.src = localStorage.getItem(localStorage.key(i));
                            searchImgDiv.appendChild(resultImg);
                            createdImages.add(key);
                        }
                    }

                }
            } else if (!videoTitle.includes(inputValue)) {
                const videoCast = searchObj[key].video_cast;
                videoCast.forEach(castArr => {
                    if (castArr.includes(inputValue) && !createdImages.has(key)) {
                        for (let i = 0; i < localStorage.length; i++) {
                            if (parseInt(localStorage.key(i), 10) == key) {
                                const resultImg = document.createElement('img');
                                resultImg.classList.add('search_result_img');
                                resultImg.src = localStorage.getItem(localStorage.key(i));
                                searchImgDiv.appendChild(resultImg);
                                createdImages.add(key);
                            }
                        }
                    }
                });
            }
            const resultImgs = document.querySelectorAll('.search_result_img');
            imgClickPopup(resultImgs);
        }
    } else {
        searchXbtn.classList.remove('search_xBtn_visible');
        searchTagDiv.classList.remove('searchTagDiv_none');
    }
});

searchXbtn.addEventListener('click', _ => {
    inputSearch.value = '';
    searchImgDiv.innerHTML = '';
    searchXbtn.classList.remove('search_xBtn_visible');
    searchTagDiv.classList.remove('searchTagDiv_none');
});

function hideSearchElements() {
    searchWindow.style.display = 'none';
    searchTagDiv.style.display = 'none';
    searchImgDiv.style.display = 'none';
}

function showSearchElements() {
    searchWindow.style.display = 'block';
    searchTagDiv.style.display = 'block';
    searchImgDiv.style.display = 'block';
}

function toggleSearchElements() {
    const isHidden = searchWindow.style.display === 'none';
    isHidden ? showSearchElements() : hideSearchElements();
}

async function getSearchDataListandTagBtn() {
    const genres = [];
    try {
        const querySnapshot = await getDocs(collection(db, 'videoList'));
        querySnapshot.forEach((doc) => {
            const genre = doc.data().video_genre;
            if (Array.isArray(genre)) {
                genre.forEach(str => {
                    if (!genres.includes(str)) {
                        genres.push(str);
                    }
                });
            }
        });
        createTagBtn(genres);
        tagBtnClick();
    } catch (error) {
        console.error(error);
    }
};

function createTagBtn(genres) {
    genres.forEach((genre) => {
        const button = document.createElement('button');
        button.classList.add('tag_btn');
        button.textContent = genre;
        searchTagDiv.appendChild(button);
    })
}

async function tagBtnClick() {
    const tagBtns = document.querySelectorAll('.tag_btn');
    const selectedTags = [];

    try {
        tagBtns.forEach((btn) => {
            btn.addEventListener('click', async (e) => {
                const matchingKeys = [];
                const clickTag = e.currentTarget.textContent;

                searchImgDiv.innerHTML = '';
                e.currentTarget.classList.toggle('tag_btn_click');

                if (e.currentTarget.classList.contains('tag_btn_click')) {
                    selectedTags.push(clickTag);
                } else {
                    const index = selectedTags.indexOf(clickTag);
                    if (index > -1) selectedTags.splice(index, 1);
                    for (const key in searchObj) {
                        const videoGenre = searchObj[key].video_genre;
                        for (let i = 0; i < matchingKeys.length; i++) {
                            if (videoGenre.includes(clickTag) && matchingKeys[i] == key) {
                                matchingKeys.splice(i, 1);
                            }
                        }
                    }
                }

                for (const key in searchObj) {
                    const videoGenre = searchObj[key].video_genre;
                    if (selectedTags.every(tag => videoGenre.includes(tag))) {
                        matchingKeys.push(key);
                    }
                }

                matchingKeys.forEach(key => {
                    for (let i = 0; i < localStorage.length; i++) {
                        if (parseInt(localStorage.key(i), 10) == key) {
                            const resultImg = document.createElement('img');
                            resultImg.classList.add('search_result_img');
                            resultImg.src = localStorage.getItem(localStorage.key(i));
                            searchImgDiv.appendChild(resultImg);
                        }
                    }
                });
                const resultImgs = document.querySelectorAll('.search_result_img');
                imgClickPopup(resultImgs);
            });
        });
    } catch (e) {
        console.error(e);
    }
}

async function addSearchArray() {
    try {
        const colRef = collection(db, 'videoList');
        const docsSnap = await getDocs(colRef);
        docsSnap.forEach((doc) => {
            const { video_cast, video_genre, video_title, video_key } = doc.data();
            searchObj[video_key] = {
                video_cast: video_cast,
                video_genre: video_genre,
                video_title: video_title
            };
        });
    } catch (e) {
        console.error(e);
    }
}

//main drama display - representative drama
const mainDramaDiv = document.getElementById('mainDramaDiv');
const mainImg = document.createElement('img');
mainImg.classList.add('mainImg');
mainImg.src = localStorage.getItem('mainDramaUrl');
mainDramaDiv.appendChild(mainImg);

const mainDramaDescription = document.getElementById('mainDramaDescription');
mainDramaDescription.textContent = '사랑은 달콤하면서도 씁쓸하고, 인생은 좋을 때도 슬플 때도 있는 법.바쁘게 돌아가는 섬 제주에서 하루하루 살아가는 우리들의 이야기가 펼쳐진다.';

//main list display - initialScreen
const divMainList = document.getElementById('main_div_list');
const cateWord = ['km.jpg', 'fm.jpg', 'kd.jpg', 'fd.jpg', 'vs.jpg', 'do.jpg', 'an.jpg'];
const mainList = ['한국 영화', '해외 영화', '흥미진진 멈출 수 없는 한국 시리즈', '한번 보면 마니아가 된다는 해외 시리즈', '여름 더위도, 심심함도 시원하게 날려주는 예능', '잔잔하지만 마음을 울리는 다큐멘터리', '누구나 마음에 품고 다니는 애니메이션'];
const LIST_NUM = 5;
const ul = document.createElement('ul');

mainList.forEach((cate, index) => {
    const li = document.createElement('li');
    const liCateDiv = document.createElement('div');
    const imageDiv = document.createElement('div');

    liCateDiv.textContent = cate;
    liCateDiv.classList.add('liCateDiv');
    li.appendChild(liCateDiv);
    li.classList.add('main_li');
    imageDiv.classList.add('imageDiv');

    const listImgArr = checkLocalStorageMovieImg(cateWord[index]);
    listImgArr.forEach(imgUrl => {
        const imgElement = document.createElement('img');
        imgElement.classList.add('imgElement');
        imgElement.src = imgUrl;
        imageDiv.appendChild(imgElement);
    });

    li.appendChild(imageDiv);
    ul.appendChild(li);
});
divMainList.appendChild(ul);

const posterImgList = document.querySelectorAll('.imgElement');
imgClickPopup(posterImgList);

function checkLocalStorageMovieImg(str) {
    const listImgArr = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        if (value.includes(str)) {
            listImgArr.push(value);
        }
    }

    const randomImgArr = [];
    while (randomImgArr.length < LIST_NUM && listImgArr.length > 0) {
        const randomIndex = Math.floor(Math.random() * listImgArr.length);
        const randomImage = listImgArr[randomIndex];
        if (!randomImgArr.includes(randomImage)) {
            randomImgArr.push(randomImage);
        }
    }
    return randomImgArr;
}
//click header1-myList
const btnMyList = document.querySelector('.btn_mylist');
const myListDiv = document.querySelector('.myListDiv');

btnMyList.addEventListener('click', _ => {
    cateListDiv.classList.add('display_none');
    mainDramaDiv.classList.add('display_none');
    divMainList.classList.add('display_none');
    myListDiv.innerHTML = "";
    const imageDiv = document.createElement('div');
    imageDiv.classList.add('myListImgDiv');
    myListSet.forEach((src) => {
        const imgElement = document.createElement('img');
        imgElement.classList.add('myListImg');
        imgElement.src = src;
        imageDiv.appendChild(imgElement);
    });
    myListDiv.appendChild(imageDiv);
    const myListImgLists = document.querySelectorAll('.myListImg');
    imgClickPopup(myListImgLists);
});

//click header1-category li - change main list 
let categoryArr = [];
const toggleCateLi = document.querySelectorAll('.toggle_category_li');
const cateListDiv = document.getElementById('cate_choice_list');
const cateUl = document.createElement('ul');
cateUl.classList.add('cateUl');

toggleCateLi.forEach((li, index) => {
    categoryArr.push(toggleCateLi[index].textContent);
    li.addEventListener('click', (e) => {
        mainDramaDiv.classList.add('display_none');
        divMainList.classList.add('display_none');
        cateListDiv.classList.remove('display_none');
        cateUl.innerHTML = '';
        cateListDiv.scrollTo(0, 0);
        const selectedCate = e.currentTarget.textContent;
        const categoryHeader = document.createElement('div');
        categoryHeader.classList.add('categoryHeader');
        categoryHeader.textContent = selectedCate;
        cateUl.appendChild(categoryHeader);
        if (selectedCate === categoryArr[index]) {
            const cateImgUrlArr = getCategoryImg(cateWord[index]);
            for (let i = 0; i < cateImgUrlArr.length; i += LIST_NUM) {
                const chunk = cateImgUrlArr.slice(i, i + LIST_NUM);
                const cateLi = document.createElement('li');
                cateLi.classList.add('cateLi');
                chunk.forEach(imgUrl => {
                    const imgElement = document.createElement('img');
                    imgElement.classList.add('cateImg');
                    imgElement.src = imgUrl;
                    cateLi.appendChild(imgElement);
                });
                cateUl.appendChild(cateLi);
            }
            cateListDiv.appendChild(cateUl);
        }
        const cateImgLists = document.querySelectorAll('.cateImg');
        imgClickPopup(cateImgLists);
    });
});

function getCategoryImg(str) {
    const listImgArr = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        if (value.includes(str)) {
            listImgArr.push(value);
        }
    }
    return listImgArr;
}

//maindrama detail btn
const btnMainDetail = document.getElementById('btn_main_ourblues_detail');
btnMainDetail.addEventListener('click', _ => {
    const imgSrc = '../img/img_movie/1_our_blues_kd.jpg';
    const videoNum = imgSrc.match(/img_movie\/(\d{1,2})/)[1];
    btnHeart.setAttribute('data-click-src', imgSrc);
    scrollableElement.classList.add('scrollable');

    showDetailPopUp();
    getVideoDetail(videoNum);

    if (myListSet.has(imgSrc)) {
        transHeart.classList.add('trans-heart-hidden');
        fillHeart.classList.add('heart-fill-change');
    } else {
        transHeart.classList.remove('trans-heart-hidden');
        fillHeart.classList.remove('heart-fill-change');
    }

    document.getElementById("detail_popup_episode").classList.add('displayBlockEpi');
    createEpisode();
    epiPlayIcon();
    createRecommend(imgSrc);
    recPlayIcon();
});

//img click, heartBtn click event for myList - detail PopUp
const detailPopUp = document.getElementById('detail_popup');
const wrap = document.getElementById('wrap');
const scrollableElement = document.getElementById('scrollable');

const btnHeart = document.getElementById('btnHeart');
const transHeart = document.querySelector('.trans-heart');
const fillHeart = document.querySelector('.fill-heart');

btnHeart.addEventListener('click', e => {
    let clickedImgSrc = btnHeart.getAttribute('data-click-src');

    if (myListSet.has(clickedImgSrc)) {
        myListSet.delete(clickedImgSrc);
        transHeart.classList.remove('trans-heart-hidden');
        fillHeart.classList.remove('heart-fill-change');
        if (divMainList.classList.contains('display_none') === true && cateListDiv.classList.contains('display_none') === true) {
            btnMyList.click();
        }
    } else {
        myListSet.add(clickedImgSrc);
        transHeart.classList.add('trans-heart-hidden');
        fillHeart.classList.add('heart-fill-change');
    }
    addMyListData(myListSet, currentUser)
    console.log(myListSet)
});

function imgClickPopup(listsName) {
    if (listsName) {
        listsName.forEach((img) => {

            img.addEventListener('click', _ => {
                const videoNum = img.src.match(/img_movie\/(\d{1,2})/)[1];
                btnHeart.setAttribute('data-click-src', img.src);
                scrollableElement.classList.add('scrollable');

                showDetailPopUp();
                getVideoDetail(videoNum);

                if (myListSet.has(img.src)) {
                    transHeart.classList.add('trans-heart-hidden');
                    fillHeart.classList.add('heart-fill-change');
                } else {
                    transHeart.classList.remove('trans-heart-hidden');
                    fillHeart.classList.remove('heart-fill-change');
                }

                if (img.src.includes('1_our_blues_kd.jpg')) {
                    document.getElementById("detail_popup_episode").classList.add('displayBlockEpi');
                    createEpisode();
                    epiPlayIcon();
                } else {
                    document.getElementById("detail_popup_episode").classList.remove('displayBlockEpi');
                }
                createRecommend(img.src);
                recPlayIcon();
            });
        });

    }
}

function showDetailPopUp() {
    btnArrowUp.classList.add('arrow-display-none');
    wrap.classList.add('s_show');
    // notDetailPopUpElement.classList.add('event-blocked');
    // mainBody.classList.add('event-blocked2');
    detailPopUp.scrollTo(0, 0);
    detailPopUp.classList.add('popup-visible');
    const xBtn = document.querySelector('.fa-circle-xmark');
    xBtn.addEventListener('click', hideDetailPopUp);
    const moreBtn = document.querySelector('.btn_cast_more');
    moreBtn.addEventListener('click', _ => {
        const popupDetailDiv = document.querySelector('.detail_popup_footer');
        popupDetailDiv.scrollIntoView({ behavior: 'smooth', block: 'end' });
    });
}

function hideDetailPopUp() {
    scrollableElement.classList.remove('scrollable');
    btnArrowUp.classList.remove('arrow-display-none');
    wrap.classList.remove('s_show');
    detailPopUp.classList.remove('popup-visible');
    document.body.style.overflow = 'auto';
}

//create Episode 
function createEpisode() {
    const epiCnt = 5;
    const epiTextArr = [
        '인생의 고비에 맞닥뜨린 후 도시를 떠나 고향으로 내려온 한수. 머지않아 그곳에서 학교 동창인 은희와 재회한다.',
        '한수와 은희의 동창회는 한바탕 소동과 함께 마무리된다. 한수의 제안에 싱숭생숭해진 은희는 그의 속마음도 모른 채 생각에 잠기는데.',
        '한수와 함께 하룻밤 여행을 떠나는 은희. 은희 걱정에 발을 구르던 친구들은 그동안 한수가 숨겨왔던 비밀에 대해 알게 된다.',
        '엉겨 붙는 남자를 쫓아준 정준에게 산책을 제안하는 영옥. 한편 다른 해녀들은 영옥의 일하는 방식에 불만을 내비친다.',
        '영주는 고등학교를 졸업한 뒤 제주를 떠나고 싶어 하지만, 예기치 못한 사건이 그녀의 계획을 방해한다. 그런 영주를 걱정하는 현.'
    ];
    const epiTimeArr = ['55분', '71분', '75분', '60분', '61분'];
    const epiTitleArr = ['한수와 은희 1', '한수와은희 2', '한수와 은희 3', '영옥과 정준 1', '영주와 현주'];
    const epiVideoName = document.getElementById('video_title1');
    epiVideoName.textContent = '우리들의 블루스';

    const popUpEpisode = document.getElementById("detail_popup_episode");

    for (let i = 0; i < epiCnt; i++) {
        const div_episode = document.createElement('div');
        div_episode.classList.add('detail_popup_episode_list');

        const span_cnt = document.createElement('span');
        span_cnt.classList.add('epi_cnt');
        span_cnt.innerText = i + 1;

        const div_img_all = document.createElement('div');
        div_img_all.classList.add('epi_cnt_img_all');
        const img_epi = document.createElement('img');
        img_epi.src = `../img/img_epi/epi_${i + 1}.jpg`;
        img_epi.classList.add('epi_img');
        const epi_i = document.createElement('i');
        epi_i.classList.add('fa-solid', 'fa-play', 'epi_play_i');
        div_img_all.append(img_epi, epi_i);

        const div_info = document.createElement('div');
        div_info.classList.add('div_info');
        const span_container = document.createElement('div');
        span_container.classList.add('span_container');
        const span_title = document.createElement('span');
        span_title.innerText = epiTitleArr[i];
        const span_time = document.createElement('span');
        span_time.innerText = epiTimeArr[i];
        span_container.append(span_title, span_time);
        const span_plot = document.createElement('span');
        span_plot.classList.add('span_plot');
        span_plot.innerText = epiTextArr[i];
        div_info.append(span_container, span_plot);

        div_episode.append(span_cnt, div_img_all, div_info);
        popUpEpisode.appendChild(div_episode);
    }
}

function epiPlayIcon() {
    const lists = document.querySelectorAll('.detail_popup_episode_list');
    lists.forEach((li, i) => {
        const epi_i = document.querySelectorAll('.epi_play_i');
        li.addEventListener('mouseover', _ => {
            epi_i[i].classList.add('play_i_opacity');
        });
        li.addEventListener('mouseout', _ => {
            epi_i[i].classList.remove('play_i_opacity');
        });
        li.addEventListener('click', _ => location.href = '../html/videoPlayback.html')
    });
}

//create Recommend
function createRecommend(src) {
    const recommend_container = document.getElementById('detail_popup_recommend_container');
    recommend_container.innerHTML = '';

    const jpgArr = [];
    for (let i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i).includes('jpg')) {
            jpgArr.push(localStorage.key(i));
        }
    }

    const recCnt = 8;
    const randomArr = [];
    const srcSlice = src.slice(src.indexOf('img_movie/'));
    while (randomArr.length < recCnt) {
        const randomIndex = Math.floor(Math.random() * jpgArr.length);
        const randomImage = jpgArr[randomIndex];
        if (!randomArr.includes(randomImage) && !randomArr.includes(srcSlice)) {
            randomArr.push(randomImage);
        }
    }

    const rec_ul = document.createElement('ul');
    rec_ul.classList.add('rec_ul');
    const rec_li = document.createElement('li');
    rec_li.classList.add('rec_li');
    const rec_li2 = document.createElement('li');
    rec_li2.classList.add('rec_li');

    for (let i = 0; i < recCnt; i++) {
        const img_container = document.createElement('div');
        img_container.classList.add('rec_img_container');
        const rec_img = document.createElement('img');
        rec_img.classList.add('rec_img');
        rec_img.src = localStorage.getItem(randomArr[i]);
        const rec_i = document.createElement('i');
        rec_i.classList.add('fa-solid', 'fa-play', 'rec_play_i');
        img_container.append(rec_img, rec_i);
        i < 4 ? rec_li.appendChild(img_container) : rec_li2.appendChild(img_container);
    }
    rec_ul.append(rec_li, rec_li2);
    recommend_container.appendChild(rec_ul);
    recImgClick();
}

function recImgClick() {
    const recImgList = document.querySelectorAll('.rec_img');
    imgClickPopup(recImgList);
}

function recPlayIcon() {
    const lists = document.querySelectorAll('.rec_img_container');
    lists.forEach((li, i) => {
        const rec_i = document.querySelectorAll('.rec_play_i');
        li.addEventListener('mouseover', _ => {
            rec_i[i].classList.add('rec_play_i_opacity');
        });
        li.addEventListener('mouseout', _ => {
            rec_i[i].classList.remove('rec_play_i_opacity');
        });
    });
}

async function getVideoDetail(videoNum) {
    try {
        const docRef = doc(db, 'videoList', videoNum);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const videoData = docSnap.data();
            if (videoData.video_url) {
                sessionStorage.setItem("video_url", videoData.video_url);
            }
            sessionStorage.setItem("play_key", videoData.video_key);
            document.getElementById("video_preview").innerHTML = videoData.video_preview;
            document.getElementById("video_rating1").innerText = videoData.video_rating;
            document.getElementById("video_rating2").innerText = videoData.video_rating;
            if (Array.isArray(videoData.video_cast)) {
                const castString1 = videoData.video_cast.slice(0, 3).join(", ");
                const castString2 = videoData.video_cast.join(", ");
                document.getElementById("video_cast1").innerText = castString1;
                document.getElementById("video_cast2").innerText = castString2;
            }
            document.getElementById("video_release").innerText = videoData.video_release;
            document.getElementById("video_contents").innerText = videoData.video_contents;
            if (Array.isArray(videoData.video_genre)) {
                const genreString = videoData.video_genre.join(", ");
                document.getElementById("video_genre1").innerText = genreString;
                document.getElementById("video_genre2").innerText = genreString;
            }
            document.getElementById("video_title1").innerText = videoData.video_title;
            document.getElementById("video_title2").innerText = videoData.video_title;
            if (Array.isArray(videoData.video_director)) {
                const directString = videoData.video_director.join(", ");
                document.getElementById("video_director").innerText = directString;
            }
        } else {
            console.error('해당 영상 정보가 없습니다.');
        }
    } catch (e) {
        console.error(e);
    }
}

//arrow-up btn - scroll opacity, click event
const btnArrowUp = document.getElementById('arrow-up');
const mainDramaDivHeight = mainDramaDiv.getBoundingClientRect().height;

fixedHeadArrowAnimation(btnArrowUp, mainDramaDivHeight, 'arrow-up-visible');

function fixedHeadArrowAnimation(element, elementHeight, className) {
    document.addEventListener('scroll', _ => {
        if (window.scrollY > elementHeight) {
            element.classList.add(className);
        } else {
            element.classList.remove(className);
        }
    });
}

btnArrowUp.addEventListener('click', _ => {
    const cateList = document.querySelector('.cate_choice_list');
    if (divMainList.classList.contains('display_none')) {
        cateList.scrollIntoView({ behavior: 'smooth' });
    } else {
        mainDramaDiv.scrollIntoView({ behavior: 'smooth' });
    }
});

//playBtn - go to videoPlayback.html
const videoPlayBtn = document.getElementById("btn_detail_video_play");
videoPlayBtn.addEventListener("click", _ => location.href = "../html/videoPlayback.html");

const mainDramaPlayBtn = document.getElementById('mainDramaPlayBtn');
mainDramaPlayBtn.addEventListener("click", _ => location.href = "../html/videoPlayback.html");

//myList function
async function addMyListData(myListSet, currentUser) {
    try {
        const userId = sessionStorage.getItem('userId');
        const docRef = doc(db, 'myList', userId);

        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
            await setDoc(docRef, {});
        }
        await updateDoc(docRef, { [currentUser]: JSON.stringify(Array.from(myListSet)) })
            .then(() => {
                console.log('myList 업데이트 성공');
            })
            .catch((error) => {
                console.error('myList 업데이트 에러:', error);
            });

    } catch (e) {
        console.error(e);
    }
}

async function getMyListData(currentUser) {
    try {
        const userId = sessionStorage.getItem('userId');
        const docRef = doc(db, 'myList', userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const fieldData = docSnap.data()[currentUser];
            return fieldData;
        } else {
            console.log('마이리스트에 해당 데이터가 없습니다.')
        }
    } catch (e) {
        console.error(e);
    }
}







