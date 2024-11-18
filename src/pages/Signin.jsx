import "../css/Signin.css";

import { useState, useContext } from "react";

import { LoginContext } from '../App';
import { useNavigate } from "react-router-dom";
import axios from "axios";


const Signin = () => {
  const { onCreateId, onCreatePassword, onCreateConfirmPassword } = useContext(LoginContext);
  const [errorMsg, setErrorMsg] = useState("");
  const [emailErrorMsg, setEmailErrorMsg] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [registerName, setRegisterName] = useState(""); // 이름 상태 추가
  const [isChecked, setIsChecked] = useState(false);
  const nav = useNavigate();

  const onChangeEmail = (e) => {
    setRegisterEmail(e.target.value);
  };

  const onChangePassword = (e) => {
    setRegisterPassword(e.target.value);
  };

  const onChangeConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
  };

  const onChangeName = (e) => { // 이름 핸들러 추가
    setRegisterName(e.target.value);
  };

  const register = async () => {
    try {
      setErrorMsg("");
      
      const response = await axios.post("http://localhost:8080/users/register", {
        email: registerEmail,
        name: registerName,
        pwd: registerPassword,
        checkPwd: confirmPassword,
        isChecked: isChecked
      });

      if (response.data.code && response.data.code !== 200) {
        console.error("Server responded with error: ", response.data);
        switch (response.data.code) {
            case 404:
                setErrorMsg("존재하지 않는 아이디입니다.");
                break;
            default:
                setErrorMsg(response.data.message);
        }
        return;
      }

      // 이름을 포함한 데이터 저장 처리
      console.log("회원가입 정보:", { email: registerEmail, password: registerPassword, name: registerName });

      onCreateId(registerEmail);
      onCreatePassword(registerPassword);
      onCreateConfirmPassword(confirmPassword);

      setRegisterEmail("");
      setRegisterPassword("");
      setRegisterName(""); // 이름 상태 초기화
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
    if (registerPassword === confirmPassword) {
      await register();
    } else {
      setErrorMsg('비밀번호가 일치하지 않습니다');
    }
  };

  const onCheck = async () => {
    setEmailErrorMsg("");

    try {
      const response = await axios.get("http://localhost:8080/users/check-duplicate-id", {
        params: { email: registerEmail },
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

      if(response.data.data) { 
        setEmailErrorMsg('사용 가능한 이메일입니다');
        setIsChecked(true);
      } else {
        setEmailErrorMsg('이미 가입되어 있는 계정입니다');
        setIsChecked(false);
      }
    } catch (err) {
      setEmailErrorMsg('이미 가입되어 있는 계정입니다');
    }
  };

  return (
    <div className="Signin">
      <h1>회원가입</h1>
      <input
        value={registerName}
        onChange={onChangeName}
        placeholder={"이름을 입력해주세요"} // 이름 입력 필드
      />
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
