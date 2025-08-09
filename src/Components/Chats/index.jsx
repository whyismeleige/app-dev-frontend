import { useEffect, useRef, useState } from "react";
import styles from "./index.module.css";
import { motion } from "framer-motion";
import { io } from "socket.io-client";
import {
  FaHashtag,
  FaMicrophone,
  FaPaperPlane,
  FaFolderPlus,
  FaPaperclip,
  FaRegUser,
} from "react-icons/fa";
import clsx from "clsx";

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL;
const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const socket = io(SOCKET_URL);

const timeFormat = (timeStamp) => {
  const date = new Date(timeStamp);
  const now = new Date();

  const timeString = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const imageDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  if (imageDate.getTime() === today.getTime()) return timeString;
  else if (imageDate.getTime() === yesterday.getTime())
    return `Yesterday, ${timeString}`;

  return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${date
    .getFullYear()
    .toString()
    .slice(-2)}, ${timeString}`;
};

const getServerData = async (userId) => {
  return fetch(`${SERVER_URL}/api/server/get-servers`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(userId),
  }).then((data) => data.json());
};

const joinChannel = (channelId, userId) => {
  socket.emit("joinChannel", { channelId, userId });
};

const userTyping = (channelId, userId) => {
  socket.emit("typing", { channelId, userId });
};

export default function LiveChats() {
  const [selectedServer, setSelectedServer] = useState({});
  const [selectedChannel, setSelectedChannel] = useState({});
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [servers, setServers] = useState([]);
  const [channels, setChannels] = useState([]);
  const [members, setMembers] = useState([]);
  const [typingUsersByChannel, setTypingUsersByChannel] = useState([]);
  const chatEndRef = useRef(null);

  const { _id, avatar } = JSON.parse(localStorage.getItem("userServerData"));

  useEffect(() => {
    const getUserData = async () => {
      const serversData = await getServerData({ userId: _id });
      console.log(serversData);
      setServers(serversData);
    };
    getUserData();

    socket.on("newMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("userTyping", ({ channelId, userId, userName }) => {
      setTypingUsersByChannel((prev) => {
        const channelTyping = prev[channelId] || [];
        console.log(channelTyping);
        if (channelTyping.some((u) => u.userId === userId)) return prev;

        return {
          ...prev,
          [channelId]: [...channelTyping, { userId, userName }],
        };
      });

      setTimeout(() => {
        setTypingUsersByChannel((prev) => ({
          ...prev,
          [channelId]: (prev[channelId] || []).filter(
            (u) => u.userId !== userId
          ),
        }));
      }, 3000);
    });

    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    return () => socket.off("userTyping");
  }, []);

  const sendMessage = () => {
    socket.emit("sendMessage", {
      channelId: selectedChannel.id,
      userId: _id,
      avatar,
      content: input,
    });
  };
  console.log(typingUsersByChannel);
  const getTypingText = () => {
    const typingUsers = typingUsersByChannel[selectedChannel] || [];
    switch (typingUsers.length) {
      case 0:
        return "";
      case 1:
        return `${typingUsers[0].userName} is typing...`;
      case 2:
        return `${typingUsers[0].userName} and ${typingUsers[1].userName} are typing...`;
      default:
        return `${typingUsers[0].userName}, ${typingUsers[1].userName}, and ${
          typingUsers.length - 2
        } others are typing...`;
    }
  };

  return (
    <div className={styles.discordContainer}>
      {/* Sidebar (Server List) */}
      <motion.div
        className={styles.sidebar}
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className={styles.logo}>💠</div>
        <div className={styles.serverList}>
          {servers.map((server, idx) => (
            <button
              onClick={() => {
                setSelectedServer({ id: server._id, name: server.name });
                setChannels(server.channels);
                setMembers(server.members);
              }}
              key={idx}
              className={clsx(
                styles.serverBtn,
                server.id === selectedServer.id
                  ? styles.selectedServerBtn
                  : null
              )}
              title={server.name}
            >
              {server.name[0]}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Channel List */}
      <motion.div
        className={styles.channelList}
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        {channels.map((channel, idx) => (
          <div key={idx}>
            <ul>
              <li
                className={
                  selectedChannel.id === channel._id ? styles.channelActive : ""
                }
                onClick={() => {
                  setSelectedChannel({ id: channel._id, name: channel.name });
                  joinChannel(channel._id, _id);
                  setMessages(channel.messages);
                }}
              >
                <FaHashtag className={styles.icon} />
                {channel.name}
              </li>
            </ul>
          </div>
        ))}
      </motion.div>
      {/* Chat Area */}
      <motion.div
        className={styles.chatArea}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        {/* Header */}
        <div className={styles.chatHeader}>
          <span># {selectedChannel.name} </span>
          <FaFolderPlus className={styles.icon} />
        </div>

        {/* Messages */}
        <div className={styles.chatMessages}>
          {messages.map((msg, i) => (
            <div
              key={i}
              className={clsx(
                styles.message,
                msg.authorId === _id ? styles.userMessage : null
              )}
            >
              <img className={styles.avatar} src={msg.avatar} />
              <div>
                <p>{`${
                  msg.authorId !== _id ? msg.authorName : "Me"
                } ${timeFormat(msg.timestamp)}`}</p>
                <p>{msg.content}</p>
              </div>
            </div>
          ))}
          <div className={styles.userTyping}>{getTypingText()}</div>
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        {selectedChannel.name && (
          <div className={styles.chatInput}>
            <FaMicrophone className={styles.icon} />
            <FaPaperclip className={styles.icon} />
            <input
              className={styles.inputField}
              value={input}
              onChange={(e) => {
                userTyping(selectedChannel.id, _id);
                setInput(e.target.value);
              }}
              placeholder={`Message #${selectedChannel.name}`}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <FaPaperPlane className={styles.sendIcon} onClick={sendMessage} />
          </div>
        )}
      </motion.div>
      <motion.div
        className={styles.membersList}
        intial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        {members.map((member, idx) => {
          return (
            <div key={idx}>
              <ul>
                <li className={styles.memberDiv}>
                  <FaRegUser />
                  {member.displayName}
                </li>
              </ul>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}