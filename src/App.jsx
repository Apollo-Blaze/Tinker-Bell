import React from "react";
import ChatBot from "./components/Chatbot";
import "./App.css";

function App() {
  return (
    <div className="App flex flex-col min-h-screen">
      <nav className="navbar fixed top-0 left-0 right-0 z-50 bg-blue-500 text-white py-4 shadow-lg">
        <div className="container mx-auto px-4 flex justify-center items-center">
          <h1 className="navbar-heading text-xl font-bold flex items-center">
            <span className="mr-2">🎄</span>
            Christmas Chatbot
            <span className="ml-2">🎅</span>
          </h1>
        </div>
      </nav>

      <main className="flex-grow flex items-center justify-center"> {/* Add padding to account for fixed navbar */}
        <div className="container mx-auto px-4 flex justify-center items-center">
          <ChatBot />
        </div>
      </main>
    </div>
  );
}

export default App;
