import React, { useState, useEffect, useRef } from "react";
import Lottie from "react-lottie";
import sleepAnimation from "../assets/sleep.json";
import talkingAnimation from "../assets/talking.json";
import "../App.css";

const ChatBot = () => {
  const [input, setInput] = useState("");
  const [isBotResponding, setIsBotResponding] = useState(false);
  const [typingMessage, setTypingMessage] = useState(""); // Message being typed out
  const [botMessage, setBotMessage] = useState(""); // Persisted final message
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [typingMessage, botMessage]);

  const handleSend = () => {
    if (!input.trim()) return;

    setInput(""); // Clear the input field
    setIsBotResponding(true); // Start bot response animation
    setTypingMessage(""); // Clear any previous typing message

    const botResponses = [
      "That's lovely! Christmas really is magical.",
      "I hope Santa visits you this year!",
      "Do you like Christmas carols?",
      "The Christmas lights are so beautiful, aren't they?",
      "Merry Christmas!",
    ];
    const randomResponse =
      botResponses[Math.floor(Math.random() * botResponses.length)];

    let currentIndex = 0;

    const typeMessage = () => {
      if (currentIndex < randomResponse.length) {
        // Use substring to prevent undefined issues
        setTypingMessage(randomResponse.substring(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setBotMessage(randomResponse); // Set the final bot message
        setTypingMessage(""); // Clear the typing message
        setIsBotResponding(false); // Stop bot response animation
      }
    };

    // Start typing effect
    const typingInterval = setInterval(typeMessage, 100);

    // Cleanup interval if component unmounts
    return () => clearInterval(typingInterval);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: isBotResponding ? talkingAnimation : sleepAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="chat-container">
      <div className="animation-container flex justify-center items-center">
        <Lottie options={defaultOptions} height={400} width={400} />
      </div>

      <div className="messages">
        {/* Show typing message if bot is responding, otherwise show the last message */}
        <div className="bot-message">
          {isBotResponding ? typingMessage : botMessage}
        </div>
        <div ref={messagesEndRef} />
      </div>

      <div className="input-container flex justify-between items-center p-4">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full border rounded px-3 py-2 mr-2"
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBot;