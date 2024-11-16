import '../css/Enhance.css'
import '../css/Modal.css'

import { getImage } from "../util/get-image";

import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import React from 'react';
import Modal from 'react-modal'

Modal.setAppElement('#root');

const Enhance = () => {

  const nav = useNavigate();

  let [coupon, setCoupon] = useState(3);
  let [level, setLevel] = useState(1);
  let [probSuccess, setProbSuccess] = useState(90);
  let [probDestruction, setProbDestruction] = useState(5);
  let [probFail, setProbFail] = useState(100-probSuccess-probDestruction);
  let [countTry, setCountTry] = useState(1);
  let [countSuccess, setCountSuccess] = useState(1);

  const [result, setResult] = useState("");
  const [instructModalIsOpen, setInstructModalIsOpen] = useState(false);
  const [enhanceModalIsOpen, setEnhanceModalIsOpen] = useState(false);
  const [couponModalISOpen, setCouponModalIsOpen] = useState(false);
  const [noCouponModalIsOpen, setNoCouponModalIsOpen] = useState(false);
  const [resultModalIsOpen, setResultModalIsOpen] = useState(false);

  const swordName = '박보검';

  const onClickRanking = () =>{
    nav("/");
  }
  
  const openInstructModal = () => {
    setInstructModalIsOpen(true);
  }
  const closeInstructModal = () => {
    setInstructModalIsOpen(false);
  }
  const openEnhanceModal = () => {
    setEnhanceModalIsOpen(true);
  }
  const closeEnhanceModal = () => {
    setEnhanceModalIsOpen(false);
  }
  const openCouponModal = () => {
    setCouponModalIsOpen(true);
  }
  const closeCouponModal = () => {
    setCouponModalIsOpen(false);
  }
  const openResultModal = () => {
    setResultModalIsOpen(true);
  }
  const closeResultModal = () => {
    setResultModalIsOpen(false);
  }

  const openNoCouponModal = () => {
    setNoCouponModalIsOpen(true);
  }
  const closeNoCouponModal = () => {
    setNoCouponModalIsOpen(false);
  }

  const probabilities = [
    { component :
    <div>
      <h3>강화 성공!</h3>
      <img className='result' src={getImage('diamond')} alt="success" />
    </div>,
    chance: probSuccess,
    action: () => {
      if(countSuccess < 7) {
        switch(countSuccess){
          case 1: setProbSuccess(80); break;
          case 2: setProbSuccess(70); break;
          case 3: setProbSuccess(50); break;
          case 4: setProbSuccess(30); break;
          case 5: setProbSuccess(10); break;
          case 6: setProbSuccess(3); break;
          default: setProbSuccess(3);
        }
      }
      setCountSuccess(prev => prev+1);
      setCountTry(prev => prev+1);
      setLevel(prev => prev+1);
    }},
    //----------------------------------------
    { component :
    <div>
      <h3>파괴되었습니다.</h3>
      <img className='result' src={getImage('fire_blue')} alt="destruct" />
    </div>,
    chance: probDestruction,
    action: ()=>{
      setCountTry(prev => prev+1);
      setLevel(0);
    }},
    //----------------------------------------
    { component :
    <div>
      <h3>강화 실패!</h3>
      <img className='result' src={getImage('tears')} alt="fail" />
    </div>,
    chance: probFail,
    action: () => {
      setCountTry(prev => prev+1);
      if(level > 0){
        setLevel(prev => prev-1);
      }
    }},
  ];

  const getProbability = (setLevel, setProbSuccess, countTry, setCountTry) => {
    const random = Math.random() * 100;
    let sum = 0;

    for (const { component, chance, action } of probabilities) {
      sum += chance;
      if(random < sum) {
        action(setLevel, setProbSuccess, countTry, setCountTry);
        return component;
      }
    }
  }

  useEffect(()=>{
    if(resultModalIsOpen){
      const component = getProbability(setLevel, setProbSuccess, countTry, setCountTry);
      setResult(component);
    }
  }, [resultModalIsOpen]);

  useEffect(() => {
    setProbFail(100-probSuccess-probDestruction);
  },[probSuccess, probDestruction]);

  useEffect(() => {
    console.log(`level:${level} countTry:${countTry} probSuccess:${probSuccess} probDestruct:${probDestruction} probFail:${probFail}`);
  },[probFail]);

  useEffect(() => {
    if(countTry >= 4 && probDestruction < 50) {
      setProbDestruction(prev => prev+5);
    }
  },[countTry]);

  return (
    <div className='Enhance'>

      <div className='menu-enhance'>
        <div
        className='menu-item'
        onClick={openInstructModal}
        >
        <img src={getImage('instruction')} alt="instruction" />
        설명서
        </div>
      </div>

      <div className='menu-prob'>
        <div
        className='menu-item'
        >
        <img src={getImage('card')} alt="card" />
        확률 증가권 : {coupon}개 남음
        </div>
      </div>

      <div className='menu-rank'>
        <div
        className='menu-item'
        onClick={onClickRanking}
        >
        <img src={getImage('trophy')} alt="trophy" />
        명예의 전당 가기
        </div>
      </div>

      <h2 className='info'>
        {swordName}
        <br/>
        Lv.{level}
      </h2>

      <div className='sword'>
        <img src={getImage('sword')} alt="sword" />
      </div>

      <button
        onClick={openEnhanceModal}
        >
        강화하기
      </button>

      {/* 모달 */}
      <Modal //설명서
        className='modal-instruct'
        isOpen={instructModalIsOpen}
        onRequestClose={closeInstructModal}
        contentLabel='instruction'
      >
        <img className='x' onClick={closeInstructModal} src={getImage('x')} alt="x" />
        
        <p>
          확률 증가권(사용시 확률 10% 증가)은 계정당 3개 주어집니다.<br/>
          강화 단계에 따른 강화 확률이 보여집니다.<br/>
          <br/>
          💪🏻강화 확률<br/>
          90% → 80% → 70% → 50% → 30% → 10% → 3%<br/>
          7번 성공 이후에는 3%로 고정됩니다<br/>
            <br/>
          🔥파괴 확률<br/>
          3강 이전 5%<br/>
          4강 이후부터 5%씩 증가,<br/>
          예) 4강 10%, 15%....<br/>
          최대 50%까지 증가합니다<br/>
          <br/>
          파괴되지 않을 경우 한 단계 하강<br/>
          파괴될 경우 Lv.0으로 하강
        </p>
      </Modal>

      <Modal //강화하시겠습니까?
        className='modal-enhance'
        isOpen={enhanceModalIsOpen}
        onRequestClose={closeEnhanceModal}
        contentLabel='enhance'
      >
        <h3>정말 강화하시겠습니까?</h3>
        <div className='button'>
          <button
            onClick={() => {
              closeEnhanceModal();
              openCouponModal();
            }}
          >예</button> |
          <button
            onClick={closeEnhanceModal}
          >아니오</button>
        </div>
      </Modal>

      <Modal //확률증가권을 사용하시겠습니까?
        className='modal-enhance'
        isOpen={couponModalISOpen}
        onRequestClose={closeCouponModal}
        contentLabel='coupon'
      >
        <h3>확률 증가권을 사용하시겠습니까?</h3>
        사용시 자동으로 즉시 강화하기가 실행 됩니다<br/>
        사용시 강화 성공 확률은 13%입니다
        <div className='button'>
          <button
            onClick={()=>{
              closeCouponModal();
              if(coupon > 0){
                setCoupon(prev => prev-1);
                openResultModal();
              }
              else {
                openNoCouponModal();
              }
            }}
          >예</button> |
          <button
            onClick={()=>{
              closeCouponModal();
              openResultModal();
            }}
          >아니오</button>
        </div>
      </Modal>

      <Modal
        className='modal-enhance'
        isOpen={noCouponModalIsOpen}
        onRequestClose={closeNoCouponModal}
        contentLabel='noCoupon'
      >
        <h3>사용할 수 있는 확률 증가권이 없습니다.</h3>
        <button onClick={closeNoCouponModal}>확인</button>
      </Modal>

      <Modal //강화 결과
        className='modal-enhance'
        isOpen={resultModalIsOpen}
        onRequestClose={closeResultModal}
        contentLabel='result'
      >
        <img className='x' onClick={closeResultModal} src={getImage('x')} alt="x" />
          {result}
      </Modal>
    </div>
  )
}

export default Enhance;