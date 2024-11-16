import '../css/Ranking.css';

import { useNavigate } from 'react-router-dom';
import { getImage } from "../util/get-image";

const Ranking = () => {

    const nav = useNavigate();

    const mockData = [
    {
      swordName: "혜워니검",
      userName: "조혜원",
      level: 1,
    },
    {
      swordName: "두번째검",
      userName: "안세영",
      level: 2,
    },
    {
      swordName: "내가일등검",
      userName: "박승준",
      level: 3,
    },
    {
      swordName: "짐의검",
      userName: "김지원",
      level: 4,
    },
    {
      swordName: "풍선검",
      userName: "조예진",
      level: 5,
    },
    {
      swordName: "나무검",
      userName: "이강혁",
      level: 6,
    },
    {
      swordName: "당검",
      userName: "장민호",
      level: 7,
    },
    {
      swordName: "박보검",
      userName: "계다현",
      level: 8,
    },
    {
      swordName: "은검",
      userName: "양혜원",
      level: 9,
    },
    {
      swordName: "나일등검",
      userName: "전시현",
      level: 10,
    },
    ];

    const getSortedData = () => {
      return mockData.toSorted((a,b) => {
        return Number(b.level) - Number(a.level);
      })
    }

    const sortedData = getSortedData();

    const onClickLogin = () =>{
      nav("/Login");
    }

    const onClickEnhance = () =>{
      nav("/Enhance");
    }

    return (
      <div className='Ranking'>

        <header>
        <div
            className='login'
            onClick={onClickLogin}
            >
            <img src={getImage('login')} alt="login" />
            로그인하러 가기
          </div>

          <div
            className='enhance'
            onClick={onClickEnhance}
            >
            <img src={getImage('fire_red')} alt="enhance" />
            강화하러 가기
          </div>
        </header>
        
        <h2>명예의 전당</h2>

        <div className='topRank'>
          <div className='topRank2'>
            <img src={getImage('rank2')} alt="Ranking 2" />
            <img src={getImage('sword')} alt="Sword" />
            {sortedData[1].swordName} Lv.{sortedData[1].level}
            <div className='line'/>
            <p>{sortedData[1].userName}</p>
          </div>

          <div className='topRank1'>
            <img src={getImage('rank1')} alt="Ranking 1" />
            <img src={getImage('sword')} alt="Sword" />
            {sortedData[0].swordName} Lv.{sortedData[0].level}
            <div className='line'/>
            <p>{sortedData[0].userName}</p>
          </div>

          <div className='topRank3'>
            <img src={getImage('rank3')} alt="Ranking 3" />
            <img src={getImage('sword')} alt="Sword" />
            {sortedData[2].swordName} Lv.{sortedData[2].level}
            <div className='line'/>
            <p>{sortedData[2].userName}</p>
          </div>
        </div>

        <div className='other'>

          <div className='other-rank'>
            <img src={getImage('sword')} alt="Sword" />
            {sortedData[3].swordName} Lv.{sortedData[3].level}
            <div className='line'/>
            <p>{sortedData[3].userName}</p>
          </div>

          <div className='other-rank'>
            <img src={getImage('sword')} alt="Sword" />
            {sortedData[4].swordName} Lv.{sortedData[4].level}
            <div className='line'/>
            <p>{sortedData[4].userName}</p>
          </div>

          <div className='other-rank'>
            <img src={getImage('sword')} alt="Sword" />
            {sortedData[5].swordName} Lv.{sortedData[5].level}
            <div className='line'/>
            <p>{sortedData[5].userName}</p>
          </div>

          <div className='other-rank'>
            <img src={getImage('sword')} alt="Sword" />
            {sortedData[6].swordName} Lv.{sortedData[6].level}
            <div className='line'/>
            <p>{sortedData[6].userName}</p>
          </div>

          <div className='other-rank'>
            <img src={getImage('sword')} alt="Sword" />
            {sortedData[7].swordName} Lv.{sortedData[7].level}
            <div className='line'/>
            <p>{sortedData[7].userName}</p>
          </div>

          <div className='other-rank'>
            <img src={getImage('sword')} alt="Sword" />
            {sortedData[8].swordName} Lv.{sortedData[8].level}
            <div className='line'/>
            <p>{sortedData[8].userName}</p>
          </div>

          <div className='other-rank'>
            <img src={getImage('sword')} alt="Sword" />
            {sortedData[9].swordName} Lv.{sortedData[9].level}
            <div className='line'/>
            <p>{sortedData[9].userName}</p>
          </div>
          
        </div>

      </div>
    )
}

export default Ranking;