import '../css/New.css'

import { useNavigate } from 'react-router-dom';
import { getImage } from "../util/get-image";

const New = () => {

  const nav = useNavigate();

  const onSubmit = () =>{
    //새로운 유저 생성
    nav("/enhance");
  }

  return (
    <div className='New'>

      <h2>검의 이름을 입력해주세요</h2>

      <div className='sword'>
        <img src={getImage('sword')} alt="sword" />
      </div>

      <input
      maxLength={5}
      placeholder='ex) 박보검 (5자 이내)'
      >
      </input>

      <button onClick={onSubmit}>이름 짓기</button>


    </div>
  )
}

export default New;