import "../css/Enhance.css";
import "../css/Modal.css";

import { getImage } from "../util/get-image";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAccessToken } from "../util/get-token";
import axios from "axios";
import React from "react";
import Modal from "react-modal";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

Modal.setAppElement("#root");

const Enhance = () => {
  const nav = useNavigate();
  const token = getAccessToken();

  let [coupon, setCoupon] = useState(0);
  let [level, setLevel] = useState(1);
  let [probSuccess, setProbSuccess] = useState(90);
  let [probDestruction, setProbDestruction] = useState(5);
  let [probFail, setProbFail] = useState(100 - probSuccess - probDestruction);
  let [countTry, setCountTry] = useState(1);
  let [countSuccess, setCountSuccess] = useState(1);

  const [result, setResult] = useState("");
  const [instructModalIsOpen, setInstructModalIsOpen] = useState(false);
  const [enhanceModalIsOpen, setEnhanceModalIsOpen] = useState(false);
  const [couponModalISOpen, setCouponModalIsOpen] = useState(false);
  const [noCouponModalIsOpen, setNoCouponModalIsOpen] = useState(false);
  const [resultModalIsOpen, setResultModalIsOpen] = useState(false);
  const [swordName, setSwordName] = useState("");
  const [itemId, setItemId] = useState("");
  const [stompClient, setStompClient] = useState(null);
  const [userName, setUsername] = useState("");

  // WebSocket 연결 설정
  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),
      onConnect: () => {
        console.log("Connected to WebSocket");
      },
      onDisconnect: () => {
        console.log("Disconnected from WebSocket");
      },
    });

    client.activate();
    setStompClient(client);

    return () => client.deactivate();
  }, []);

  const fetchEnhance = async (useCoupon) => {
    try {
      const payload = {
        id: itemId, // 아이템 ID
        isBoosted: useCoupon, // 확률 증가권 사용 여부
      };

      const response = await axios.post(
        "http://localhost:8080/enhance",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Authorization 헤더 추가
          },
        }
      );

      const data = response.data.data;
      console.log(data);

      if (data) {
        const result = data.status;
        const newLevel = data.item.level;

        switch (result) {
          case "SUCCESS":
            setResult(
              <div>
                <h3>강화 성공!</h3>
                <img className="result" src={getImage("diamond")} alt="success" />
              </div>
            );
            setLevel(newLevel);

            // WebSocket 메시지 전송
            if (stompClient && stompClient.connected) {
              stompClient.publish({
                destination: "/app/chat",
                body: `강화 성공! ${userName}님이 ${swordName} Lv.${newLevel}로 강화되었습니다.`,
              });
            }

            if (countSuccess < 7) {
              setCountSuccess((prev) => prev + 1);
              setProbSuccess(() => {
                const successChances = [80, 70, 50, 30, 10, 3];
                return successChances[Math.min(countSuccess, successChances.length - 1)];
              });
            }
            break;

          case "FAIL":
            setResult(
              <div>
                <h3>강화 실패!</h3>
                <img className="result" src={getImage("tears")} alt="fail" />
              </div>
            );
            setLevel((prev) => Math.max(0, prev - 1));
            break;

          case "DESTRUCTION":
            setResult(
              <div>
                <h3>파괴되었습니다.</h3>
                <img className="result" src={getImage("fire_blue")} alt="destruct" />
              </div>
            );
            setLevel(0);
            break;

          default:
            console.error("Unknown result from enhance API");
        }
        setCountTry((prev) => prev + 1);
      } else {
        console.error("Failed to get enhancement result.");
      }
    } catch (error) {
      console.error("Enhancement API failed:", error);
    }
  };

  useEffect(() => {
    setProbFail(100 - probSuccess - probDestruction);
  }, [probSuccess, probDestruction]);

  useEffect(() => {
    if (countTry >= 4 && probDestruction < 50) {
      setProbDestruction((prev) => prev + 5);
    }
  }, [countTry]);

  const fetchItem = async () => {
    const itemResponse = await axios.get("http://localhost:8080/items", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const userResponse = await axios.get("http://localhost:8080/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setSwordName(itemResponse.data.data.name);
    setLevel(itemResponse.data.data.level);
    setItemId(itemResponse.data.data.id);
    setCoupon(userResponse.data.data.booster);
    setUsername(userResponse.data.data.name);
  };

  useEffect(() => {
    try {
      fetchItem();
    } catch (error) {
      console.error("Enhancement API failed:", error);
    }
  }, []);

  return (
    <div className="Enhance">
      {/* 메뉴 */}
      <div className="menu-enhance">
        <div className="menu-item" onClick={() => setInstructModalIsOpen(true)}>
          <img src={getImage("instruction")} alt="instruction" />
          설명서
        </div>
      </div>

      <div className="menu-prob">
        <div className="menu-item">
          <img src={getImage("card")} alt="card" />
          확률 증가권 : {coupon}개 남음
        </div>
      </div>

      <div className="menu-rank">
        <div className="menu-item" onClick={() => nav("/")}>
          <img src={getImage("trophy")} alt="trophy" />
          명예의 전당 가기
        </div>
      </div>

      {/* 강화 정보 */}
      <h2 className="info">
        {swordName}
        <br />
        Lv.{level}
      </h2>

      <div className="sword">
        <img src={getImage("sword")} alt="sword" />
      </div>

      <button onClick={() => setEnhanceModalIsOpen(true)}>강화하기</button>

      {/* 모달 */}
      <Modal
        className="modal-instruct"
        isOpen={instructModalIsOpen}
        onRequestClose={() => setInstructModalIsOpen(false)}
      >
        <p>강화 설명서 내용</p>
      </Modal>

      <Modal
        className="modal-enhance"
        isOpen={enhanceModalIsOpen}
        onRequestClose={() => setEnhanceModalIsOpen(false)}
      >
        <h3>정말 강화하시겠습니까?</h3>
        <div className="button">
          <button
            onClick={() => {
              setEnhanceModalIsOpen(false);
              setCouponModalIsOpen(true);
            }}
          >
            예
          </button>
          |
          <button onClick={() => setEnhanceModalIsOpen(false)}>아니오</button>
        </div>
      </Modal>

      <Modal
        className="modal-enhance"
        isOpen={couponModalISOpen}
        onRequestClose={() => setCouponModalIsOpen(false)}
      >
        <h3>확률 증가권을 사용하시겠습니까?</h3>
        사용시 자동으로 즉시 강화하기가 실행됩니다
        <div className="button">
          <button
            onClick={() => {
              setCouponModalIsOpen(false);
              if (coupon > 0) {
                setCoupon((prev) => prev - 1);
                fetchEnhance(true);
                setResultModalIsOpen(true);
              } else {
                setNoCouponModalIsOpen(true);
              }
            }}
          >
            예
          </button>
          |
          <button
            onClick={() => {
              setCouponModalIsOpen(false);
              fetchEnhance(false);
              setResultModalIsOpen(true);
            }}
          >
            아니오
          </button>
        </div>
      </Modal>

      <Modal
        className="modal-enhance"
        isOpen={noCouponModalIsOpen}
        onRequestClose={() => setNoCouponModalIsOpen(false)}
      >
        <h3>사용할 수 있는 확률 증가권이 없습니다.</h3>
        <button onClick={() => setNoCouponModalIsOpen(false)}>확인</button>
      </Modal>

      <Modal
        className="modal-enhance"
        isOpen={resultModalIsOpen}
        onRequestClose={() => setResultModalIsOpen(false)}
      >
        {result}
      </Modal>
    </div>
  );
};

export default Enhance;
