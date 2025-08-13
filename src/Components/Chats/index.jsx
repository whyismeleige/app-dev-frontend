// LiveChats.jsx
import { useEffect, useRef, useState } from "react";
import styles from "./index.module.css";
import { motion, AnimatePresence } from "framer-motion";
import { io } from "socket.io-client";
import {
  FaHashtag,
  FaMicrophone,
  FaPaperPlane,
  FaFolderPlus,
  FaPaperclip,
} from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import clsx from "clsx";

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL;
const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const socket = io(SOCKET_URL);

const getDetails = async (userId) => {
  return fetch(`${SERVER_URL}/api/server/get-user-details`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(userId),
  }).then((data) => data.json());
};

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
  const [showMembers, setShowMembers] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const chatEndRef = useRef(null);

  const { _id, avatar } = JSON.parse(localStorage.getItem("userServerData"));

  useEffect(() => {
    chatEndRef.current.scrollIntoView();
  }, [messages]);

  useEffect(() => {
    let mounted = true;

    const getUserData = async () => {
      if (!_id) return;
      try {
        const serversData = await getServerData({ userId: _id });
        if (mounted) setServers(serversData || []);
      } catch (err) {
        console.error("Failed to fetch servers:", err);
      }
    };
    getUserData();

    const handleNewMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    const handleUserTyping = ({ channelId, userId, userName }) => {
      setTypingUsersByChannel((prev) => {
        const channelTyping = prev[channelId] || [];
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
    return () => socket.off("userTyping");
  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;
    socket.emit("sendMessage", {
      channelId: selectedChannel.id,
      userId: _id,
      avatar,
      content: input,
    });
    setInput("");
  };

  const getTypingText = () => {
    const typingUsers = typingUsersByChannel[selectedChannel.id] || [];
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
      {/* Sidebar */}
      <motion.div
        className={styles.sidebar}
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className={styles.logo}>💠</div>
        <div className={styles.serverList}>
          <button
            onClick={() => console.log("DM Button Clicked")}
            className={clsx(styles.serverBtn, styles.dmBtn)}
            title="Direct Messages"
          >
            💬
          </button>

          {servers.map((server, idx) => (
            <ServerBtn
              selectServer={() => {
                setSelectedServer({ id: server._id, name: server.name });
                setChannels(server.channels || []);
                setMembers(server.members || []);
              }}
              server={server}
              selectedServer={selectedServer}
              key={idx}
            />
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
        <div className={styles.channelHeader}>
          <span># {selectedServer.name} </span>
          <FaFolderPlus className={styles.icon} />
        </div>
        {channels.map((channel, idx) => (
          <div key={channel._id || idx}>
            <ul>
              <li
                className={
                  selectedChannel.id === channel._id
                    ? styles.channelActive
                    : ""
                }
                onClick={() => {
                  setSelectedChannel({ id: channel._id, name: channel.name });
                  joinChannel(channel._id, _id);
                  setMessages(channel.messages || []);
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
          <span># {selectedChannel.name || "Select channel"}</span>

          <div className={styles.headerIcons}>
            <FaFolderPlus className={styles.icon} />
            <button
              className={styles.memberToggleBtn}
              onClick={() => setShowMembers((prev) => !prev)}
              title="Toggle Members List"
            >
              👥
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className={styles.chatMessages}>
          {messages.map((msg, i) => {
            const msgId = msg._id ?? msg.id ?? i;
            const isUser = msg.authorId === _id;
            return (
              <div
                key={msgId}
                className={clsx(
                  styles.message,
                  isUser ? styles.userMessage : null
                )}
              >
                <img
                  className={styles.avatar}
                  src={msg.avatar || msg.avatarUrl || ""}
                  alt="avatar"
                />

                <div>
                  <p>{`${isUser ? "Me" : msg.authorName || msg.username || "User"} ${timeFormat(msg.timestamp)}`}</p>
                  <p>{msg.content}</p>
                </div>

                <div
                  className={styles.messageMenu}
                  style={{
                    marginLeft: isUser ? 0 : "8px",
                    marginRight: isUser ? "8px" : 0,
                  }}
                >
                  <button
                    className={styles.menuButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === msgId ? null : msgId);
                    }}
                  >
                    <BsThreeDotsVertical />
                  </button>

                  {openMenuId === msgId && (
                    <div className={styles.menuDropdown}>
                      {!isUser && (
                        <button
                          onClick={() =>
                            console.log(
                              "Add Friend ->",
                              msg.authorId || msg.authorName
                            )
                          }
                        >
                          Add Friend
                        </button>
                      )}
                      <button
                        onClick={() =>
                          console.log(
                            "Report ->",
                            msg.authorId || msg.authorName
                          )
                        }
                      >
                        Report
                      </button>
                      <button
                        onClick={() =>
                          console.log(
                            "Block ->",
                            msg.authorId || msg.authorName
                          )
                        }
                      >
                        Block
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

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
                if (selectedChannel.id) userTyping(selectedChannel.id, _id);
                setInput(e.target.value);
              }}
              placeholder={`Message #${selectedChannel.name}`}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <FaPaperPlane
              className={styles.sendIcon}
              onClick={sendMessage}
            />
          </div>
        )}
      </motion.div>
      <motion.div
        className={styles.membersList}
        intial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <div className={styles.membersHeader}>
          <span># Members</span>
          <FaFolderPlus className={styles.icon} />
        </div>
        {members.map((member, idx) => {
          return <MemberWidget member={member} key={idx} />;
        })}
      </motion.div>
    </div>
  );
}

const ServerBtn = ({ selectServer, server, selectedServer }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className={styles.serverBtnContainer}>
      <button
        onClick={selectServer}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={clsx(
          styles.serverBtn,
          server.id === selectedServer.id ? styles.selectedServerBtn : null
        )}
      >
        {server.name[0]}
      </button>
      {isHovered && <div className={styles.serverTooltip}>{server.name}</div>}
    </div>
  );
};

const MemberWidget = ({ member }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [loading, isLoading] = useState(false);
  const [userData, setUserData] = useState({});

  const getData = async () => {
    const userId = member.userId;
    const data = await getDetails({ userId });
    setIsHovered(true);
    setUserData(data);
  };

  return (
    <div>
      <ul>
        <li
          className={styles.memberDiv}
          onMouseEnter={getData}
          onMouseLeave={() => setIsHovered(false)}
        >
          {isHovered && (
            <div className={styles.memberWidgetContainer}>
              <div className={styles.memberBasicDetails}>
                <img className={styles.memberAvatar} src={member.avatar} />
                <div>
                  <span className={styles.userName}>{userData.nickname}</span>
                  <span className={styles.userStatus}>{userData.status}</span>
                </div>
              </div>
              <span className={styles.memberId}>
                ID: {userData.email.substr(0, 11)}
              </span>
              <span className={styles.lastSeen}>
                Last Seen: {timeFormat(userData.lastSeen)}
              </span>
            </div>
          )}
          <img className={styles.avatar} src={member.avatar} />
          {member.displayName}
        </li>
      </ul>
    </div>
  );
};
