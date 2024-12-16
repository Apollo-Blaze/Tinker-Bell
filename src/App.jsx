import React from "react";
import ChatBot from "./components/Chatbot";
import "./App.css";

function App() {
  return (
    <div className="App flex flex-col min-h-screen">
      <nav className="navbar fixed top-0 left-0 right-0 z-50 text-white py-4">
        <div className="container mx-auto px-4 flex justify-start items-center ">
          <h1 className="navbar-heading text-xl font-bold flex">
             Santa Bot
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
