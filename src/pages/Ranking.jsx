import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getImage } from "../util/get-image";

import "../css/Ranking.css";

const Ranking = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const nav = useNavigate();

  const mockData = [
    { swordName: "혜워니검", userName: "조혜원", level: 1 },
    { swordName: "두번째검", userName: "안세영", level: 2 },
    { swordName: "내가일등검", userName: "박승준", level: 3 },
    { swordName: "짐의검", userName: "김지원", level: 4 },
    { swordName: "풍선검", userName: "조예진", level: 5 },
    { swordName: "나무검", userName: "이강혁", level: 6 },
    { swordName: "당검", userName: "장민호", level: 7 },
    { swordName: "박보검", userName: "계다현", level: 8 },
    { swordName: "은검", userName: "양혜원", level: 9 },
    { swordName: "나일등검", userName: "전시현", level: 10 },
  ];

  const getSortedData = () => {
    return mockData.toSorted((a, b) => Number(b.level) - Number(a.level));
  };

  const sortedData = getSortedData();

  useEffect(() => {
    // 로컬스토리지에서 'access' 토큰 여부 확인
    const accessToken = localStorage.getItem("access");
    setIsLoggedIn(!!accessToken);
  }, []);

  const onClickLogin = () => {
    nav("/login");
  };

  const onClickUsers = () => {
    nav("/users"); // 접속 중인 유저 보기 페이지로 이동
  };

  const onClickEnhance = () => {
    nav("/enhance");
  };

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
    </div>
  );
};

export default Ranking;
