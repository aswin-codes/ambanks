import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      text: "Welcome to AM Banks. How can I assist you today?",
      isUser: false,
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (text, isUser = false) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { text, isUser },
    ]);
  };

  const handleSendMessage = () => {
    if (newMessage) {
      addMessage(newMessage, true);
      scrollToBottom();

      axios
        .post("http://localhost:3000/chat", { message: newMessage })
        .then((response) => {
          const botResponse = response.data.response || "I'm sorry, but I can't assist you at the moment. Please call our customer care for further assistance.";
          addMessage(botResponse, false);
          scrollToBottom();
        })
        .catch((error) => {
          console.error("Error sending message:", error);
        });

      setNewMessage("");
    }
  };

  // Handle "Enter" key press in the input field
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-blue-500 w-full">
        <nav className="p-4">
          <h1 className="text-2xl font-semibold text-white">AM Banks Chat</h1>
        </nav>
      </div>
      <div className="flex-grow flex-1  overflow-auto flex flex-col bg-white">
        <div className="flex-grow overflow-y-auto">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`${
                message.isUser ? "ml-auto" : "mr-auto"
              } p-2`}
            >
              <div
                className={`${
                  message.isUser
                    ? "bg-blue-300 text-blue-900"
                    : "bg-blue-100 text-blue-900"
                } rounded-lg p-2 inline-block`}
              >
                {message.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef}></div>
        </div>
        <div className="flex p-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message here"
            className="flex-grow bg-blue-100 text-blue-900 p-2 rounded-l-lg focus:outline-none"
            onKeyPress={handleKeyPress}
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-700 focus:outline-none"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
