import { useState, useEffect, useRef } from "react";
import styles from "./index.module.css";
import { FaPaperPlane } from "react-icons/fa6"; // Send icon

export default function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { text: input, sender: "user" }];
    newMessages.push({ text: `You said: ${input}`, sender: "bot" });

    setMessages(newMessages);
    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  const toggleChat = () => {
    if (isOpen) {
      setClosing(true);
      setTimeout(() => {
        setClosing(false);
        setIsOpen(false);
      }, 300); // fade out time
    } else {
      setIsOpen(true);
    }
  };

  return (
    <div className={styles.chatbotWrapper}>
      <button onClick={toggleChat} className={styles.toggleButton}>
        {isOpen ? "−" : "💬"}
      </button>

      <div
        className={`${styles.chatbotContainer} ${
          isOpen ? styles.show : styles.hide
        } ${closing ? styles.fadeOut : styles.fadeIn}`}
      >
        <div className={styles.chatWindow}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={
                msg.sender === "user" ? styles.userMessage : styles.botMessage
              }
            >
              {msg.text}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div className={styles.inputArea}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            className={styles.input}
            placeholder="Type your message..."
          />
          <button onClick={sendMessage} className={styles.sendButton}>
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </div>
  );
}
