const form = document.querySelector("form");
const idInput = document.querySelector("#user_id");
const passwordInput = document.querySelector("#user_pw");

const loginButton = document.querySelector("#login_btn");
const logoutButton = document.querySelector("#logout_btn");

const main = document.querySelector("main");
const userName = document.querySelector("#user_name");
const userDetail = document.querySelector("#user_info");
const loadingIndicator = document.querySelector("#loading");

axios.defaults.withCredentials = true;

// 폼 제출 이벤트 초기화
form.addEventListener("submit", (e) => e.preventDefault());

// 로그인 함수
function login() {
  const userId = idInput.value;
  const userPassword = passwordInput.value;

  return axios.post("http://localhost:3000", { userId, userPassword });
}

// 로그아웃 함수
function logout() {
  return axios.delete("http://localhost:3000");
}

// 유저 정보 요청 함수
function getUserInfo() {
  return axios.get("http://localhost:3000");
}

// 유저 정보 렌더링 함수
function renderUserInfo(userInfo) {
  main.style.display = "block";
  form.style.display = "none";
  userName.textContent = userInfo.user_name;
  userDetail.textContent = userInfo.user_info;
}

// 로그인 폼 렌더링 함수
function renderLoginForm() {
  main.style.display = "none";
  form.style.display = "block";
  userName.textContent = "";
  userDetail.textContent = "";
}

// 로딩 상태 표시 함수
function toggleLoading(isLoading) {
  loadingIndicator.style.display = isLoading ? "block" : "none";
}

// 로그인 버튼 클릭 이벤트
loginButton.onclick = () => {
  toggleLoading(true);
  login()
    .then(() => {
      passwordInput.value = ""; // 비밀번호 초기화
      return getUserInfo();
    })
    .then((res) => renderUserInfo(res.data))
    .catch((err) => {
      console.error(err);
      alert("로그인 실패! ID와 비밀번호를 확인하세요.");
    })
    .finally(() => toggleLoading(false));
};

// 로그아웃 버튼 클릭 이벤트
logoutButton.onclick = () => {
  toggleLoading(true);
  logout()
    .then(() => renderLoginForm())
    .catch((err) => {
      console.error(err);
      alert("로그아웃에 실패했습니다. 다시 시도해 주세요.");
    })
    .finally(() => toggleLoading(false));
};
