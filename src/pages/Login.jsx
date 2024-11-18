import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "../css/Login.css";

const Login = () => {
  const [typingEmail, setTypingEmail] = useState("");
  const [typingPassword, setTypingPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const nav = useNavigate();

  const onChangeEmail = (e) => {
    setTypingEmail(e.target.value);
  };

  const onChangePassword = (e) => {
    setTypingPassword(e.target.value);
  };

  const login = async () => {
    try {
      setErrorMsg("");
      console.log(typingEmail);
      console.log(typingPassword);

      // 로그인 요청
      const response = await axios.post("http://localhost:8080/users/login", {
        email: typingEmail,
        pwd: typingPassword,
      });

      if (response.data.code && response.data.code !== 200) {
        console.error("Server responded with error: ", response.data);
        switch (response.data.code) {
          case 404:
            setErrorMsg("존재하지 않는 아이디입니다.");
            break;
          default:
            setErrorMsg("서버에서 알 수 없는 오류가 발생했습니다.");
        }
        return;
      }

    //   console.log(response);

      // Access Token 저장
      localStorage.setItem("access", response.data.data.accessToken);

      // GET 요청으로 items 확인
      const itemsResponse = await axios.get("http://localhost:8080/items", {
        headers: {
          Authorization: `Bearer ${response.data.data.accessToken}`,
        },
      });

      console.log(itemsResponse);

      // items 값에 따라 페이지 이동
      if (itemsResponse.data.data == null) {
        nav("/New"); // items가 없으면 New로 이동
      } else {
        nav("/enhance"); // items가 존재하면 enhance로 이동
      }
    } catch (err) {
      console.error("Login error: ", err);
      switch (err.code) {
        case "auth/invalid-credential":
          setErrorMsg("이메일 혹은 아이디를 다시 확인해주세요.");
          break;
        default:
          setErrorMsg("알 수 없는 오류입니다");
      }
    }
  };

  return (
    <div className="Login">
      <h1>로그인</h1>
      <input
        value={typingEmail}
        onChange={onChangeEmail}
        placeholder={"아이디를 입력해주세요"}
      />
      <input
        type="password"
        value={typingPassword}
        onChange={onChangePassword}
        placeholder={"비밀번호를 입력해주세요"}
      />
      {errorMsg && <p className="error-msg">{errorMsg}</p>}
      <button onClick={login}>로그인</button>

      <p className="signup-link">
        아직 회원이 아니신가요? <a href="/Signin">회원가입</a>
      </p>
    </div>
  );
};

export default Login;
