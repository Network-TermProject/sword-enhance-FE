import React, { useState, useEffect } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import axios from "axios";
import "../css/Chat.css";

const WebSocketChat = () => {
  const [stompClient, setStompClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [itemLevel, setItemLevel] = useState(0);
  const [itemName, setItemName] = useState("");
  const [activeUsers, setActiveUsers] = useState([]);

  useEffect(() => {
    const accessToken = localStorage.getItem("access");

    if (!accessToken) {
      console.error("No access token found. Please log in.");
      return;
    }

    // 사용자 정보 가져오기
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/users", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const userData = response.data.data;
        if (userData && userData.name) {
          setUsername(userData.name);
          setItemLevel(userData.item.level);
          setItemName(userData.item.name);
        } else {
          console.error("Failed to fetch user name from /users response.");
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (!username || stompClient) return;

    const socket = new SockJS("http://localhost:8080/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),
      onConnect: () => {
        console.log("Connected to WebSocket");

        client.subscribe("/topic/messages", (msg) => {
          setMessages((prevMessages) => [...prevMessages, msg.body]);
        });

        client.subscribe("/topic/activeUsers", (msg) => {
          setActiveUsers(JSON.parse(msg.body));
        });

        // 사용자 이름을 서버에 등록
        client.publish({
          destination: "/app/register",
          body: username,
        });

        // 채팅방 입장 메시지 전송
        client.publish({
          destination: "/app/chat",
          body: `${username}님이 채팅방에 입장하셨습니다.`,
        });
      },
      onDisconnect: () => {
        console.log("Disconnected from WebSocket");
        sendExitMessage();
      },
    });

    const sendExitMessage = () => {
      if (client.connected) {
        client.publish({
          destination: "/app/unregister",
          body: username,
        });
        client.publish({
          destination: "/app/chat",
          body: `${username}님이 채팅방을 나가셨습니다.`,
        });
      }
    };

    client.activate();
    setStompClient(client);

    // 브라우저 닫힘 감지 및 unregister 처리
    const handleBeforeUnload = () => {
      sendExitMessage();
      client.deactivate();
    };

    // 이벤트 리스너 등록
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      // 이벤트 리스너 제거
      window.removeEventListener("beforeunload", handleBeforeUnload);

      // 클라이언트 비활성화 처리
      sendExitMessage();
      client.deactivate();
    };
  }, [username]);

  const handleSendMessage = () => {
    if (!stompClient || !stompClient.connected) {
      console.error("STOMP client is not connected.");
      return;
    }

    stompClient.publish({
      destination: "/app/chat",
      body: `[Lv.${itemLevel} ${itemName}] ${username} : ${message}`,
    });

    setMessage("");
  };

  return (
    <div className="WebSocketChat">
      <header className="chat-header">
        <h1>실시간 채팅</h1>
        <div className="user-info">
          {username ? <p>닉네임: {username}</p> : <p>사용자 정보를 불러오는 중...</p>}
        </div>
      </header>

      <div className="chat-container">
        <div className="active-users">
          <h2>접속 중인 유저</h2>
          <ul>
            {activeUsers.map((user, index) => (
              <li key={index}>{user}</li>
            ))}
          </ul>
        </div>

        <div className="chat-section">
          <h2>채팅창</h2>
          <div className="messages">
            {messages.map((msg, index) => (
              <p key={index}>{msg}</p>
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              placeholder="메시지를 입력하세요"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={handleSendMessage}>전송</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebSocketChat;
