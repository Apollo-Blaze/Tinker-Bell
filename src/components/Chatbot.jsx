import React, { useState, useEffect, useRef } from "react";
import Lottie from "react-lottie";
import sleepAnimation from "../assets/sleep.json";
import talkingAnimation from "../assets/talking.json";
import "../App.css";

const ChatBot = () => {
  const [input, setInput] = useState("");
  const [isBotResponding, setIsBotResponding] = useState(false);
  const [typingMessage, setTypingMessage] = useState("");
  const [botMessage, setBotMessage] = useState("");
  const [listening, setListening] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(true);
  const audioRef = useRef(new Audio("/christmas-music.mp3")); // Use relative path for public assets

  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.continuous = false;
  recognition.lang = "en-US";

  // Load background music on component mount
  useEffect(() => {
    audioRef.current.loop = true; // Set the music to loop
    audioRef.current.volume = 0.5; // Adjust volume (0 = mute, 1 = full volume)

    // Start playing music initially
    audioRef.current.play().catch((error) => console.error("Music playback failed:", error));
  }, []);

  // Toggle music between playing and muted
  const togglePlayPause = () => {
    if (isMusicPlaying) {
      audioRef.current.pause(); // Pause music
    } else {
      audioRef.current.play().catch((error) => console.error("Music playback failed:", error)); // Play music
    }
    setIsMusicPlaying(!isMusicPlaying); // Toggle music state
  };

  const startListening = () => {
    setListening(true);
    recognition.start();

    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      setInput(speechToText);
      setListening(false);
    };

    recognition.onerror = (error) => {
      console.error("Speech Recognition Error:", error);
      setListening(false);
    };

    recognition.onend = () => setListening(false);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    setInput("");
    setIsBotResponding(true);
    setTypingMessage("");

    try {
      const response = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userInput: input }),
      });

      if (!response.ok) throw new Error("Failed to fetch response");

      const data = await response.json();
      const botResponse = data.reply || "Santa is thinking hard...";

      let currentIndex = 0;
      const utterance = getSantaVoice();  // Get the old man voice here

      // Typing and Speaking Simultaneously
      const typingInterval = setInterval(() => {
        if (currentIndex < botResponse.length) {
          const currentText = botResponse.substring(0, currentIndex + 1);
          setTypingMessage(currentText);

          // Update speech text progressively
          utterance.text = currentText;
          window.speechSynthesis.cancel();
          window.speechSynthesis.speak(utterance);

          currentIndex++;
        } else {
          clearInterval(typingInterval);
          setBotMessage(botResponse);
          setTypingMessage("");
          setIsBotResponding(false);
        }
      }, 50);
    } catch (error) {
      console.error("Error:", error.message);
      setBotMessage("Oops! Santa is having trouble responding.");
      setIsBotResponding(false);
    }
  };

  const getSantaVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    
    // Find a voice that matches the 'old man' description (low pitch, slow rate)
    const oldManVoice = voices.find((voice) => voice.name.includes("Google UK English Male")) ||
                        voices.find((voice) => voice.lang === "en-US") ||
                        voices[0];

    // Adjust the voice properties for an 'old man' sound
    const utterance = new SpeechSynthesisUtterance();
    utterance.voice = oldManVoice;  // Use the selected voice
    utterance.rate = 0.99;  // Slow speech rate
    utterance.pitch = 0.2;  // Lower pitch for an older voice
    utterance.volume = 0.6;  // Slightly lower volume for a deeper voice

    return utterance;
  };

  useEffect(() => {
    window.speechSynthesis.onvoiceschanged = () => {};
  }, []);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: isBotResponding ? talkingAnimation : sleepAnimation,
    rendererSettings: { preserveAspectRatio: "xMidYMid slice" },
  };

  return (
    <div className="chat-container">
      {/* Music Toggle Icon */}
      <button
        onClick={togglePlayPause}
        className={`music-toggle ${!isMusicPlaying ? "muted" : ""}`}
      >
        {isMusicPlaying ? "🎧" : "🔇"} {/* Music playing or muted icon */}
      </button>

      <div className="animation-container flex justify-center items-center">
        <Lottie options={defaultOptions} height={400} width={400} />
      </div>

      <div className="messages mb-2">
        <div className="bot-message">
          {isBotResponding ? typingMessage : botMessage}
        </div>
      </div>

      <div className="input-container flex flex-col justify-between items-center p-4 bg-yellow-500 rounded-2xl">
        <label htmlFor="input" className="text-left text-xl mb-2 text-black font-bold">
          Ask Santa...
        </label>
        <div className="flex items-center w-full">
          <input
            id="input"
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full border rounded-2xl px-4 py-4 mb-2"
            disabled={isBotResponding}
          />
          <button
            onClick={startListening}
            className="bg-blue-500 text-white px-4 py-2 rounded-2xl ml-2"
            disabled={listening || isBotResponding}
          >
            {listening ? "Listening..." : "🎤"}
          </button>
        </div>
        <button
          onClick={handleSend}
          className={`text-white px-4 py-2 ${isBotResponding ? "bg-gray-500 cursor-not-allowed" : "bg-green-600"}`}
          disabled={isBotResponding || !input.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
