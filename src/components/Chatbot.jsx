import React, { useState, useEffect, useRef } from "react";
import Lottie from "react-lottie";
import sleepAnimation from "../assets/sleep.json";
import talkingAnimation from "../assets/talking.json";
import "../App.css";

const ChatBot = () => {
  const [input, setInput] = useState("");
  const [isBotResponding, setIsBotResponding] = useState(false);
  const [botMessage, setBotMessage] = useState("");
  const [listening, setListening] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false); // Track if Santa is speaking
  const audioRef = useRef(new Audio("/christmas-music.mp3"));

  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.continuous = false;
  recognition.lang = "en-US";

  useEffect(() => {
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5;

    audioRef.current.play().catch((error) => console.error("Music playback failed:", error));

    const loadVoices = () => {
      if (window.speechSynthesis.getVoices().length > 0) {
        window.speechSynthesis.getVoices(); // Preload voices
      }
    };

    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();
  }, []);

  const togglePlayPause = () => {
    if (isMusicPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((error) => console.error("Music playback failed:", error));
    }
    setIsMusicPlaying(!isMusicPlaying);
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
    setBotMessage("");

    try {
      const response = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userInput: input }),
      });

      if (!response.ok) throw new Error("Failed to fetch response");

      const data = await response.json();
      const botResponse = data.reply || "Santa is thinking hard...";

      setBotMessage(botResponse);
      playSantaVoice(botResponse); // Play Santa's voice with animation
    } catch (error) {
      console.error("Error:", error.message);
      setBotMessage("Oops! Santa is having trouble responding.");
      setIsBotResponding(false);
    }
  };

  const getSantaVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    const oldManVoice =
      voices.find((voice) => voice.name.includes("Google UK English Male")) ||
      voices.find((voice) => voice.lang === "en-US") ||
      voices[0];

    const utterance = new SpeechSynthesisUtterance();
    utterance.voice = oldManVoice;
    utterance.rate = 0.99;
    utterance.pitch = 0.2;
    utterance.volume = 0.6;
    return utterance;
  };

  const playSantaVoice = (text) => {
    const maxChunkLength = 150;
    const chunks = splitTextIntoChunks(text, maxChunkLength);

    let currentChunkIndex = 0;
    setIsSpeaking(true); // Santa starts speaking (animation to talking)

    const speakChunk = () => {
      if (currentChunkIndex < chunks.length) {
        const utterance = getSantaVoice();
        utterance.text = chunks[currentChunkIndex];

        window.speechSynthesis.speak(utterance);

        utterance.onend = () => {
          currentChunkIndex++;
          speakChunk(); // Speak the next chunk
        };

        utterance.onerror = (error) => {
          console.error("Speech Synthesis Error:", error);
          currentChunkIndex++;
          speakChunk();
        };
      } else {
        // All chunks spoken
        setIsSpeaking(false); // Santa finishes speaking (animation to sleep)
        setIsBotResponding(false);
      }
    };

    window.speechSynthesis.cancel(); // Clear any ongoing speech
    speakChunk();
  };

  const splitTextIntoChunks = (text, chunkSize) => {
    const regex = new RegExp(`.{1,${chunkSize}}(\\s|$)`, "g");
    return text.match(regex) || [text];
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: isSpeaking ? talkingAnimation : sleepAnimation,
    rendererSettings: { preserveAspectRatio: "xMidYMid slice" },
  };

  return (
    <div className="chat-container">
      {/* Music Toggle Icon */}
      <button
        onClick={togglePlayPause}
        className={`music-toggle ${!isMusicPlaying ? "muted" : ""}`}
      >
        {isMusicPlaying ? "🎧" : "🔇"}
      </button>

      <div className="animation-container flex justify-center items-center">
        <Lottie options={defaultOptions} height={400} width={400} />
      </div>

      <div className="messages mb-2">
        <div className="bot-message">{botMessage}</div>
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
