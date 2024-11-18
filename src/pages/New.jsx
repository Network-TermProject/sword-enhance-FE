import '../css/New.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getImage } from "../util/get-image";
import axios from 'axios';
import { getAccessToken } from '../util/get-token';

const New = () => {
  const [swordName, setSwordName] = useState(""); // 검 이름 상태 추가
  const [errorMsg, setErrorMsg] = useState(""); // 에러 메시지 상태 추가
  const nav = useNavigate();

  const createSword = async (swordName) => {
    try {
      const token = getAccessToken(); // 액세스 토큰 가져오기
  
      if (!token) {
        throw new Error('Access token is required');
      }
  
      const response = await axios.post(
        "http://localhost:8080/items",
        { name: swordName },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Authorization 헤더에 토큰 추가
            "Content-Type": "application/json",
          },
        }
      );
  
      return response.data; // 서버 응답 데이터 반환
    } catch (error) {
      console.error("Error creating sword:", error.message);
      throw error;
    }
  };

  const onSubmit = async () => {
    if (swordName.trim() === "") {
      setErrorMsg("검의 이름을 입력해주세요.");
      return;
    }

    try {
      await createSword(swordName); // 검 이름을 서버로 전달
      alert("검 생성이 완료되었습니다.");
      nav("/enhance");
    } catch (error) {
      setErrorMsg("아이템 생성에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="New">
      <h2>검의 이름을 입력해주세요</h2>

      <div className="sword">
        <img src={getImage('sword')} alt="sword" />
      </div>

      <input
        maxLength={5}
        placeholder="ex) 박보검 (5자 이내)"
        value={swordName} // 입력값 상태와 바인딩
        onChange={(e) => setSwordName(e.target.value)} // 입력값 업데이트
      />

      {errorMsg && <p className="error-msg">{errorMsg}</p>} {/* 에러 메시지 표시 */}

      <button onClick={onSubmit}>이름 짓기</button>
    </div>
  );
};

export default New;
