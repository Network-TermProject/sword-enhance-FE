import "../css/Signin.css";

import { useState, useContext } from "react";
import { firebaseAuth, createUserWithEmailAndPassword } from "../firebase";
import { LoginContext } from '../App';
import { useNavigate } from "react-router-dom";

const Signin = () => {
  const { onCreateId, onCreatePassword, onCreateConfirmPassword } = useContext(LoginContext);

  const [errorMsg, setErrorMsg] = useState("");
  const [emailErrorMsg, setEmailErrorMsg] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const nav = useNavigate();

  const onChangeEmail = (e) => {
    setRegisterEmail(e.target.value);
  };

  const onChangePassword = (e) => {
    setRegisterPassword(e.target.value);
  };

  const onChangeConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
  }

  const register = async () => {
    try {
      setErrorMsg("");
      await createUserWithEmailAndPassword(firebaseAuth, registerEmail, registerPassword);

      onCreateId(registerEmail);
      onCreatePassword(registerPassword);
      onCreateConfirmPassword(confirmPassword);

      setRegisterEmail("");
      setRegisterPassword("");
      alert('회원가입이 완료되었습니다.');
      nav("/login");
    } catch (err) {
      console.error("Login error: ", err);
      switch (err.code) {
        case 'auth/weak-password':
          setErrorMsg('비밀번호는 6자리 이상이어야 합니다');
          break;
        case 'auth/invalid-email':
          setErrorMsg('이메일 주소를 다시 확인해주세요');
          break;
        case 'auth/internal-error':
          setErrorMsg('잘못된 요청입니다');
          break;
        case 'auth/network-request-failed':
          setErrorMsg('네트워크 요청을 실패했습니다');
          break;
        default:
          setErrorMsg('알 수 없는 오류가 발생했습니다');
      }
    }
  };

  const onSubmit = async (e) => {
    if(registerPassword === confirmPassword) {
      await register();
    }
    else {
      setErrorMsg('비밀번호가 일치하지 않습니다');
    }
  };

  const onCheck = async () => {
    setEmailErrorMsg("");
    try {
      await createUserWithEmailAndPassword(firebaseAuth, registerEmail, 'asjkdfhklsjdhfkjlash');
      setEmailErrorMsg('사용 가능한 이메일입니다');
    } catch (err) {
      setEmailErrorMsg('이미 가입되어 있는 계정입니다');
    }
  }

  return (
    <div className="Signin">
      <h1>회원가입</h1>
      <input
        value={registerEmail}
        onChange={onChangeEmail}
        placeholder={"이메일을 입력해주세요"}
      />
      {emailErrorMsg && <p>{emailErrorMsg}</p>}
      <button
        className="idButton"
        onClick={onCheck}
      >
        이메일 확인
      </button>
      <input
        type="password"
        value={registerPassword}
        onChange={onChangePassword}
        placeholder={"비밀번호를 입력해주세요"}
      />
      <input
        type="password"
        value={confirmPassword}
        onChange={onChangeConfirmPassword}
        placeholder={"비밀번호를 한 번 더 입력해주세요"}
      />
      {errorMsg && <p className="error-msg">{errorMsg}</p>}
      <button onClick={onSubmit}>회원가입</button>
      <p className="signup-link">이미 회원이신가요? <a href="/Login">로그인</a></p>
    </div>
  );
};

export default Signin;
