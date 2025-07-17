import { useState } from "react";
import styles from "./index.module.css";

export default function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false); // starts closed
  const [closing, setClosing] = useState(false);

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
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
