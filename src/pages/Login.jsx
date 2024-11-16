import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { firebaseAuth, signInWithEmailAndPassword } from "../firebase";

import "../css/Login.css"

const Login= () => {
  const [typingEmail, setTypingEmail] = useState("");
  const [typingPassword, setTypingPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

    const nav = useNavigate();
    
    const onChangeEmail = (e) => {
        setTypingEmail(e.target.value);
    }

    const onChangePassword = (e) => {
        setTypingPassword(e.target.value);
    }

    const login= async () =>{
        try {
            setErrorMsg("");
            const typedUserInfo = await signInWithEmailAndPassword(firebaseAuth, typingEmail, typingPassword);
            console.log(typedUserInfo);
            setTypingEmail("")
            setTypingPassword("")
            nav("/New");
        } catch(err) {
            console.error("Login error: ", err);
            switch (err.code) {
                case "auth/invalid-credential":
                    setErrorMsg("이메일 혹은 아이디를 다시 확인해주세요.");
                    break;
                default:
                    setErrorMsg("알 수 없는 오류입니다");
            }
        }
    }

    
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
                placeholder={"비밀번호를 입력해주세요"}/>
            {errorMsg && <p className="error-msg">{errorMsg}</p>}
            <button onClick={login}>로그인</button>

            <p className="signup-link">아직 회원이 아니신가요? <a href="/Signin">회원가입</a></p>
        </div>
    );
};

export default Login;