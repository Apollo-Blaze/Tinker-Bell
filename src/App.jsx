import React from "react";
import ChatBot from "./components/Chatbot";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>🎄 Christmas Chatbot 🎅</h1>
      </header>
      <main>
        <ChatBot />
      </main>
    </div>
  );
}

export default App;
