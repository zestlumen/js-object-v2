import app from './firebaseConfig.js';
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-analytics.js";

const analytics = getAnalytics(app);

const btnImgLogo = document.getElementById('btnImgLogo');
const join_banner = document.getElementById('join_banner');
const bicObjectImgDiv = document.getElementById('bicObjectImgDiv');
const btnLogin = document.getElementById('btn_login_page');

btnImgLogo.addEventListener("click", _ => location.href = "html/login.html");
join_banner.addEventListener("click", _ => location.href = "html/join.html");
bicObjectImgDiv.addEventListener("click", _ => location.href = "html/login.html");
btnLogin.addEventListener("click", _ => location.href = "html/login.html");
