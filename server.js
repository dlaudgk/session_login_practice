const express = require("express");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const users = [
  {
    user_id: "oz_user1",
    user_password: "1234",
    user_name: "김오즈",
    user_info: "서울에 거주하는 김오즈입니다.",
  },
  {
    user_id: "oz_user2",
    user_password: "4567",
    user_name: "박코딩",
    user_info: "부산에 거주하는 박코딩입니다.",
  },
  {
    user_id: "oz_user3",
    user_password: "7890",
    user_name: "이쿠키",
    user_info: "경기에 거주하는 이쿠키입니다.",
  },
  {
    user_id: "oz_user4",
    user_password: "1357",
    user_name: "최노드",
    user_info: "제주에 거주하는 최노드입니다.",
  },
];

const app = express();

app.use(
  cors({
    // ⭐️ 라이브서버의 포트번호를 정확히 지정
    origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
    methods: ["OPTIONS", "POST", "GET", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

// 1️⃣. 세션 옵션 설정
app.use(
  session({
    secret: "mySecretKey", // 암호화 키
    resave: false, // 변경사항이 없는 세션은 저장하지 않음
    saveUninitialized: false, // 빈 세션은 저장하지 않음
    name: "session_id", // 쿠키 이름 설정
    cookie: {
      httpOnly: true, // JavaScript로 쿠키 접근 불가
      secure: false, // HTTPS 환경에서만 쿠키 전송 (개발 환경에서는 false)
      maxAge: 1000 * 60 * 60, // 쿠키 유효 기간 (1시간)
    },
  })
);

// POST 요청 (로그인 요청)
app.post("/", (req, res) => {
  // 2️⃣. 구조분해 할당 사용
  const { user_id, user_password } = req.body;

  // 3️⃣. 유저 정보 확인 (find 메서드 활용)
  const userInfo = users.find(
    (user) => user.user_id === user_id && user.user_password === user_password
  );

  if (!userInfo) {
    res.status(401).send("로그인 실패"); // 로그인 실패 응답
  } else {
    // 유저가 존재하는 경우 세션에 user_id 저장
    req.session.userId = userInfo.user_id;
    res.send("⭐️세션 생성 완료!");
  }
});

// GET 요청 (유저 정보 요청)
app.get("/", (req, res) => {
  const userInfo = users.find((el) => el.user_id === req.session.userId);

  if (!userInfo) {
    res.status(404).send("유저 정보를 찾을 수 없습니다.");
  } else {
    res.json(userInfo); // 유저 정보 반환
  }
});

// DELETE 요청 (로그아웃 요청)
app.delete("/", (req, res) => {
  // 4️⃣. 세션 내 정보 삭제
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("세션 삭제 중 오류 발생");
    }

    // 5️⃣. 쿠키 삭제
    res.clearCookie("session_id"); // 세션 쿠키 삭제
    res.send("🧹세션 삭제 완료");
  });
});

app.listen(3000, () => console.log("서버 실행 ..."));
