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
  const [activeUsers, setActiveUsers] = useState([]);

  useEffect(() => {
    // 로컬 스토리지에서 토큰 가져오기
    const accessToken = localStorage.getItem("access");

    if (!accessToken) {
      console.error("No access token found. Please log in.");
      return;
    }

    // GET /users 요청으로 사용자 정보 가져오기
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/users", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const userData = response.data.data;
        console.log(response);
        if (userData && userData.name) {
          setUsername(userData.name); // 사용자 이름 설정
          console.log(username);
        } else {
          console.error("Failed to fetch user name from /users response.");
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();

    // WebSocket 연결 설정
    const socket = new SockJS("http://localhost:8080/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),
      onConnect: () => {
        console.log("Connected to WebSocket");

        // 메시지 수신
        client.subscribe("/topic/messages", (msg) => {
          setMessages((prevMessages) => [...prevMessages, msg.body]);
        });

        // 동시 접속자 목록 수신
        client.subscribe("/topic/activeUsers", (msg) => {
          setActiveUsers(JSON.parse(msg.body));
        });

        // 사용자 이름을 서버에 등록
        if (username) {
          client.publish({
            destination: "/app/register",
            body: username,
          });
        }
      },
      onDisconnect: () => {
        console.log("Disconnected from WebSocket");
      },
    });

    client.activate();
    setStompClient(client);

    return () => client.deactivate();
  }, [username]); // username이 변경될 때 WebSocket 연결

  const handleSendMessage = () => {
    if (!stompClient || !stompClient.connected) {
      console.error("STOMP client is not connected.");
      return;
    }

    stompClient.publish({
      destination: "/app/chat",
      body: `${username}: ${message}`,
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
