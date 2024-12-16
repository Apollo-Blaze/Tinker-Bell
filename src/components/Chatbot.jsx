import React, { useState } from "react";
import Lottie from "react-lottie";
import sleepAnimation from "../assets/sleep.json";
import talkingAnimation from "../assets/talking.json";
import "../App.css";

const ChatBot = () => {
  const [input, setInput] = useState("");
  const [isBotResponding, setIsBotResponding] = useState(false);
  const [typingMessage, setTypingMessage] = useState(""); // Message being typed out
  const [botMessage, setBotMessage] = useState(""); // Persisted final message

  const handleSend = () => {
    if (!input.trim()) return;

    setInput(""); // Clear the input field
    setIsBotResponding(true); // Start bot response animation
    setTypingMessage(""); // Clear any previous typing message

    const botResponses = [
      "That's lovely! Christmas really is magical.That's lovely! Christmas really is magical.That's lovely! Christmas really is magical.That's lovely! Christmas really is magical.That's lovely! Christmas really is magical.",
      "I hope Santa visits you this year!That's lovely! Christmas really is magical.That's lovely! Christmas really is magical.That's lovely! Christmas really is magical.That's lovely! Christmas really is magical.That's lovely! Christmas really is magical.",
      "Do you like Christmas carols?That's lovely! Christmas really is magical.That's lovely! Christmas really is magical.That's lovely! Christmas really is magical.That's lovely! Christmas really is magical.That's lovely! Christmas really is magical.",
      "The Christmas lights are so beautiful, aren't they?That's lovely! Christmas really is magical.That's lovely! Christmas really is magical.That's lovely! Christmas really is magical.That's lovely! Christmas really is magical.That's lovely! Christmas really is magical.That's lovely! Christmas really is magical.",
      "Merry Christmas!That's lovely! Christmas really is magical.That's lovely! Christmas really is magical.That's lovely! Christmas really is magical.That's lovely! Christmas really is magical.",
    ];
    const randomResponse =
      botResponses[Math.floor(Math.random() * botResponses.length)];

    let currentIndex = 0;

    const typeMessage = () => {
      if (currentIndex < randomResponse.length) {
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
    if (e.key === "Enter" && !isBotResponding) {
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
        <div className="bot-message">
          {isBotResponding ? typingMessage : botMessage}
        </div>
      </div>

      <div className="input-container flex justify-between items-center p-4">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full border rounded px-4 py-4 mr-2"
          disabled={isBotResponding} // Disable input while bot is typing
        />
        <button
          onClick={handleSend}
          className={`text-white px-4 py-2 ${isBotResponding ? "bg-gray-500 cursor-not-allowed" : "bg-green-600"}`}
          disabled={isBotResponding || !input.trim()} // Disable button if bot is typing or input is empty
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
