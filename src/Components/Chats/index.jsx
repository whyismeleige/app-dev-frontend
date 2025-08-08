import { useEffect, useRef, useState } from "react";
import styles from "./index.module.css";
import { motion } from "framer-motion";
import {
  FaHashtag,
  FaMicrophone,
  FaPaperPlane,
  FaFolderPlus,
  FaPaperclip,
} from "react-icons/fa";

const channels = {
  General: ["News", "Chat"],
  BBA: ["BBA - It", "BBA - Ge", "BBA - En", "BBA - FM", "BBA - BA"],
  "B.Com": ["B.Com - Ge", "B.Com - Com", "B.Com - IT", "B.Com - IF", "B.Com - Pr", "B.Com - Ho"],
  "B.Sc": ["B.Sc - Ph", "B.Sc - St", "B.Sc - El", "B.Sc - Ds"],
  Alumni: ["Connect with Alumni"],
};

const initialMessages = {
  "News": [
    { user: "📰", text: "Stay tuned for updates!" }
  ],
  "Chat": [
    { user: "👤", text: "Hey, this is General Chats!" },
    { user: "👥", text: "Refrain from using inappropriate language" },
  ],
  "BBA - It": [],
  "BBA - Ge": [],
  "BBA - En": [],
  "BBA - FM": [],
  "BBA - BA": [],
  "B.Com - Ge": [],
  "B.Com - Com": [],
  "B.Com - IT": [],
  "B.Com - IF": [],
  "B.Com - Pr": [],
  "B.Com - Ho": [],
  "B.Sc - Ph": [],
  "B.Sc - St": [],
  "B.Sc - El": [],
  "B.Sc - Ds": [],
  "Connect with Alumni": [
    { user: "🎓", text: "Alumni chat opened!" }
  ],
};

export default function LiveChats() {
  const [selectedServer, setSelectedServer] = useState("General");
  const [selectedChannel, setSelectedChannel] = useState("Chat");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(initialMessages);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedChannel]);

  const sendMessage = () => {
    if (input.trim()) {
      setMessages((prev) => ({
        ...prev,
        [selectedChannel]: [...(prev[selectedChannel] || []), { user: "🧑", text: input }],
      }));
      setInput("");
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
          {Object.keys(channels).map((cat) => (
            <button
              key={cat}
              className={`${styles.serverBtn} ${
                selectedServer === cat ? styles.serverBtnActive : ""
              }`}
              title={cat}
              onClick={() => {
                setSelectedServer(cat);
                setSelectedChannel(channels[cat][0]); // Auto-select first channel
              }}
            >
              {cat[0]}
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
        <h3>{selectedServer}</h3>
        <ul>
          {channels[selectedServer].map((sub) => (
            <li
              key={sub}
              className={selectedChannel === sub ? styles.channelActive : ""}
              onClick={() => setSelectedChannel(sub)}
            >
              <FaHashtag className={styles.icon} />
              {sub}
            </li>
          ))}
        </ul>
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
          <span>#{selectedChannel}</span>
          <FaFolderPlus className={styles.icon} />
        </div>

        {/* Messages */}
        <div className={styles.chatMessages}>
          {messages[selectedChannel]?.map((msg, i) => (
            <div key={i} className={styles.message}>
              <span className={styles.avatar}>{msg.user}</span>
              <p>{msg.text}</p>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className={styles.chatInput}>
          <FaMicrophone className={styles.icon} />
          <FaPaperclip className={styles.icon} />
          <input
            className={styles.inputField}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Message #${selectedChannel}`}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <FaPaperPlane className={styles.sendIcon} onClick={sendMessage} />
        </div>
      </motion.div>
    </div>
  );
}