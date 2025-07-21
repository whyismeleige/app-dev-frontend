import React, { useEffect, useRef, useState } from "react";
import styles from "./index.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophoneLines,
  faPaperPlane,
  faFolderPlus,
  faChevronLeft,
  faChevronRight,
  faEllipsisVertical,
  faLocationArrow,
} from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";

const ChatGPTLikeComponent = () => {
  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [closingSidebar, setClosingSidebar] = useState(false);
  const [chatList, setChatList] = useState([]);
  const [currentChatIndex, setCurrentChatIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [renamingIndex, setRenamingIndex] = useState(null);
  const [typing, setTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { text: input, from: "user" };
    const newChatIfNeeded = currentChatIndex === null;

    let updatedChats = [...chatList];

    if (newChatIfNeeded) {
      const newChat = {
        name: input.slice(0, 30),
        messages: [userMessage],
      };
      updatedChats.push(newChat);
      setCurrentChatIndex(updatedChats.length - 1);
    } else if (updatedChats[currentChatIndex]) {
      updatedChats[currentChatIndex].messages.push(userMessage);
    }

    setChatList(updatedChats);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      const botResponse = { text: "AI response goes here.", from: "bot" };
      const updated = [...updatedChats];
      const index = newChatIfNeeded
        ? updatedChats.length - 1
        : currentChatIndex;

      if (updated[index]) {
        updated[index].messages.push(botResponse);
        setChatList(updated);
      }
      setTyping(false);
    }, 1000);
  };

  const toggleSidebar = () => {
    if (sidebarOpen) {
      setClosingSidebar(true);
      setTimeout(() => {
        setSidebarOpen(false);
        setClosingSidebar(false);
      }, 300);
    } else {
      setSidebarOpen(true);
    }
  };

  const handleSearch = (e) => setSearchQuery(e.target.value.toLowerCase());

  const handleRename = (i, newName) => {
    const updated = [...chatList];
    updated[i].name = newName;
    setChatList(updated);
  };

  const handleDelete = (i) => {
    const updated = chatList.filter((_, idx) => idx !== i);
    setChatList(updated);
    if (currentChatIndex === i) setCurrentChatIndex(null);
  };

  const filteredChats = chatList.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery)
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatList, typing]);

  const handleMicClick = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (!recognitionRef.current) {
      const SpeechRecognition = window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => prev + " " + transcript);
      };

      recognitionRef.current.onerror = () => setIsRecording(false);
      recognitionRef.current.onend = () => setIsRecording(false);
    }

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }

    setIsRecording(!isRecording);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.curvedBackground}></div>
      {(sidebarOpen || closingSidebar) && (
        <div
          className={clsx(
            styles.sidebar,
            sidebarOpen && styles.slideInLeft,
            closingSidebar && styles.slideOutLeft
          )}
        >
          <div className={styles.sidebarHeader}>
            <h2>ChatGPT</h2>
            <button className={styles.toggleBtn} onClick={toggleSidebar}>
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
          </div>

          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search chats"
            onChange={handleSearch}
          />

          <button
            className={styles.newChat}
            onClick={() => setCurrentChatIndex(null)}
          >
            + New Chat
          </button>

          <div className={styles.chatList}>
            {filteredChats.map((chat, i) => (
              <div key={i} className={styles.chatItem}>
                {renamingIndex === i ? (
                  <input
                    autoFocus
                    value={chat.name}
                    onChange={(e) => handleRename(i, e.target.value)}
                    onBlur={() => setRenamingIndex(null)}
                  />
                ) : (
                  <span
                    onClick={() => setCurrentChatIndex(i)}
                    className={styles.chatName}
                  >
                    {chat.name}
                  </span>
                )}
                <div className={styles.dots}>
                  <FontAwesomeIcon icon={faEllipsisVertical} />
                  <div className={styles.dropdown}>
                    <div onClick={() => setRenamingIndex(i)}>Rename</div>
                    <div onClick={() => handleDelete(i)}>Delete</div>
                    <div onClick={() => alert("Share: " + chat.name)}>
                      Share
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CHAT SECTION */}
      <div className={styles.chatSection}>
        {!sidebarOpen && (
          <button className={styles.toggleBtnOpen} onClick={toggleSidebar}>
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        )}

        <div className={styles.messages}>
          {currentChatIndex !== null &&
            chatList[currentChatIndex]?.messages?.map((msg, idx) => (
              <div
                key={idx}
                className={`${styles.message} ${styles[msg.from]}`}
              >
                <div className={styles.bubble}>{msg.text}</div>
              </div>
            ))}

          {typing && currentChatIndex !== null && (
            <div className={`${styles.message} ${styles.bot}`}>
              <div className={styles.bubble}>
                <span className={styles.typingDots}>
                  <span>.</span>
                  <span>.</span>
                  <span>.</span>
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form className={styles.inputArea} onSubmit={handleSend}>
          <div className={styles.inputWrapper}>
            <button
              type="button"
              className={styles.mediaBtn}
              onClick={() => document.getElementById("fileUpload").click()}
            >
              <FontAwesomeIcon icon={faFolderPlus} />
            </button>
            <input
              type="file"
              id="fileUpload"
              style={{ display: "none" }}
              onChange={(e) =>
                alert(`Selected file: ${e.target.files[0]?.name}`)
              }
            />

            <input
              type="text"
              placeholder="Send a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className={styles.input}
            />

            <button
              type="button"
              className={`${styles.micButton} ${
                isRecording ? styles.listening : ""
              }`}
              onClick={handleMicClick}
              title={isRecording ? "Stop recording" : "Start recording"}
            >
              <FontAwesomeIcon icon={faMicrophoneLines} />
            </button>

            <button type="submit" className={styles.sendBtn}>
              <FontAwesomeIcon icon={faLocationArrow} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatGPTLikeComponent;
