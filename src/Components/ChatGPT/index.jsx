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
  faPlus,
  faPencil,
  faTrash,
  faShare,
  faSearch,
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
  const inputRef = useRef(null);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { text: input.trim(), from: "user" };
    const newChatIfNeeded = currentChatIndex === null;
    let updatedChats = [...chatList];

    if (newChatIfNeeded) {
      const newChat = {
        name: input.slice(0, 30) + (input.length > 30 ? "..." : ""),
        messages: [userMessage],
      };
      updatedChats.push(newChat);
      setCurrentChatIndex(updatedChats.length - 1);
    } else {
      updatedChats[currentChatIndex].messages.push(userMessage);
    }

    setChatList(updatedChats);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      const responses = [
        "I'd be happy to help you with that. Can you provide more details?",
        "That's an interesting question. Let me think about this...",
        "I understand what you're asking. Here's my perspective:",
        "Great question! This is something I can definitely help with.",
        "Thanks for asking. Let me break this down for you:",
      ];

      const botResponse = {
        text: responses[Math.floor(Math.random() * responses.length)],
        from: "bot",
      };

      const updated = [...updatedChats];
      const index = newChatIfNeeded
        ? updatedChats.length - 1
        : currentChatIndex;

      if (updated[index]) {
        updated[index].messages.push(botResponse);
        setChatList(updated);
      }
      setTyping(false);
    }, Math.random() * 1500 + 800);
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
    if (newName.trim()) {
      const updated = [...chatList];
      updated[i].name = newName.trim();
      setChatList(updated);
    }
    setRenamingIndex(null);
  };

  const handleDelete = (i) => {
    const updated = chatList.filter((_, idx) => idx !== i);
    setChatList(updated);
    if (currentChatIndex === i) {
      setCurrentChatIndex(updated.length ? 0 : null);
    } else if (currentChatIndex > i) {
      setCurrentChatIndex(currentChatIndex - 1);
    }
  };

  const handleNewChat = () => {
    setCurrentChatIndex(null);
    setInput("");
  };

  const handleChatSelect = (index) => {
    setCurrentChatIndex(index);
    setRenamingIndex(null);
  };

  const filteredChats = chatList.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery)
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatList, typing]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [currentChatIndex]);

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
        setInput((prev) => (prev + " " + transcript).trim());
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

  const getCurrentMessages = () =>
    currentChatIndex !== null && chatList[currentChatIndex]
      ? chatList[currentChatIndex].messages
      : [];

  return (
    <div className={styles.wrapper}>
      {/* SIDEBAR */}
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
            <button
              className={styles.toggleBtn}
              onClick={toggleSidebar}
              aria-label="Close sidebar"
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
          </div>

          <button className={styles.newChat} onClick={handleNewChat}>
            <FontAwesomeIcon icon={faPlus} /> New Chat
          </button>

          <div className={styles.searchContainer}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search chats"
              onChange={handleSearch}
              value={searchQuery}
            />
          </div>

          <div className={styles.chatList}>
            {filteredChats.map((chat, i) => {
              const originalIndex = chatList.findIndex((c) => c === chat);
              return (
                <div
                  key={originalIndex}
                  className={clsx(
                    styles.chatItem,
                    currentChatIndex === originalIndex && styles.active
                  )}
                >
                  {renamingIndex === originalIndex ? (
                    <input
                      autoFocus
                      value={chat.name}
                      onChange={(e) => {
                        const updated = [...chatList];
                        updated[originalIndex].name = e.target.value;
                        setChatList(updated);
                      }}
                      onBlur={() => handleRename(originalIndex, chat.name)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleRename(originalIndex, chat.name);
                        } else if (e.key === "Escape") {
                          setRenamingIndex(null);
                        }
                      }}
                      className={styles.renameInput}
                    />
                  ) : (
                    <>
                      <span
                        onClick={() => handleChatSelect(originalIndex)}
                        className={styles.chatName}
                      >
                        {chat.name}
                      </span>
                      <div className={styles.dots}>
                        <FontAwesomeIcon icon={faEllipsisVertical} />
                        <div className={styles.dropdown}>
                          <div onClick={() => setRenamingIndex(originalIndex)}>
                            <FontAwesomeIcon icon={faPencil} /> Rename
                          </div>
                          <div onClick={() => handleDelete(originalIndex)}>
                            <FontAwesomeIcon icon={faTrash} /> Delete
                          </div>
                          <div
                            onClick={() => alert("Share: " + chat.name)}
                          >
                            <FontAwesomeIcon icon={faShare} /> Share
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CHAT SECTION */}
      <div className={styles.chatSection}>
        {!sidebarOpen && (
          <button
            className={styles.toggleBtnOpen}
            onClick={toggleSidebar}
            aria-label="Open sidebar"
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        )}

        <div className={styles.messages}>
          {currentChatIndex === null && (
            <div className={styles.welcomeMessage}>
              <h1>Welcome</h1>
              <p>You can ask me anything...</p>
            </div>
          )}

          {getCurrentMessages().map((msg, idx) => (
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
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* INPUT AREA */}
        <form className={styles.inputArea} onSubmit={handleSend}>
          <div className={styles.inputWrapper}>
            <button
              type="button"
              className={styles.mediaBtn}
              onClick={() => document.getElementById("fileUpload").click()}
              aria-label="Attach file"
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
              ref={inputRef}
              type="text"
              placeholder="Send a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className={styles.input}
              disabled={typing}
            />

            <button
              type="button"
              className={`${styles.micButton} ${
                isRecording ? styles.listening : ""
              }`}
              onClick={handleMicClick}
              title={isRecording ? "Stop recording" : "Start recording"}
              aria-label={isRecording ? "Stop recording" : "Start recording"}
            >
              <FontAwesomeIcon icon={faMicrophoneLines} />
            </button>

            <button
              type="submit"
              className={styles.sendBtn}
              disabled={!input.trim() || typing}
              aria-label="Send message"
            >
              <FontAwesomeIcon icon={faLocationArrow} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatGPTLikeComponent;
