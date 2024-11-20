import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getImage } from "../util/get-image";

import "../css/Ranking.css";

const Ranking = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [items, setItems] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    // 로컬스토리지에서 'access' 토큰 여부 확인
    const accessToken = localStorage.getItem("access");
    setIsLoggedIn(!!accessToken);

    // 데이터 가져오기
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/items/top10");

        console.log(response);
        setItems(response.data.data); // API 결과를 상태에 저장
      } catch (error) {
        console.error("데이터를 가져오는 데 실패했습니다:", error);
      }
    };

    fetchData();
  }, []);

  const onClickLogin = () => {
    nav("/login");
  };

  const onClickUsers = () => {
    nav("/users"); // 접속 중인 유저 보기 페이지로 이동
  };

  const onClickEnhance = () => {
    if (!isLoggedIn) {
      alert("로그인 후 이용 가능합니다.");
      return;
    }
    nav("/enhance");
  };

  const getSortedData = () => {
    return items.sort((a, b) => Number(b.level) - Number(a.level));
  };

  const sortedData = getSortedData();

  return (
    <div className="Ranking">
      <header>
        <div
          className="login"
          onClick={isLoggedIn ? onClickUsers : onClickLogin} // 로그인 상태에 따라 버튼 동작 변경
        >
          <img
            src={getImage("login")} // 상태에 따라 아이콘 변경
            alt={isLoggedIn ? "Active Users" : "Login"}
          />
          {isLoggedIn ? "접속 중인 유저 보기" : "로그인하러 가기"}
        </div>

        <div className="enhance" onClick={onClickEnhance}>
          <img src={getImage("fire_red")} alt="enhance" />
          강화하러 가기
        </div>
      </header>

      <h2>명예의 전당</h2>

      {sortedData.length > 0 ? (
        <>
          <div className="topRank">
            <div className="topRank2">
              <img src={getImage("rank2")} alt="Ranking 2" />
              <img src={getImage("sword")} alt="Sword" />
              {sortedData[1].swordName} Lv.{sortedData[1].level}
              <div className="line" />
              <p>{sortedData[1].userName}</p>
            </div>

            <div className="topRank1">
              <img src={getImage("rank1")} alt="Ranking 1" />
              <img src={getImage("sword")} alt="Sword" />
              {sortedData[0].swordName} Lv.{sortedData[0].level}
              <div className="line" />
              <p>{sortedData[0].userName}</p>
            </div>

            <div className="topRank3">
              <img src={getImage("rank3")} alt="Ranking 3" />
              <img src={getImage("sword")} alt="Sword" />
              {sortedData[2].swordName} Lv.{sortedData[2].level}
              <div className="line" />
              <p>{sortedData[2].userName}</p>
            </div>
          </div>

          <div className="other">
            {sortedData.slice(3).map((data, index) => (
              <div className="other-rank" key={index}>
                <img src={getImage("sword")} alt="Sword" />
                {data.swordName} Lv.{data.level}
                <div className="line" />
                <p>{data.userName}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p>데이터를 불러오는 중입니다...</p>
      )}
    </div>
  );
};

export default Ranking;
