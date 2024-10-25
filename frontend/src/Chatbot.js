// frontend/src/Chatbot.js
import React, { useState } from 'react';
import axios from 'axios';
import './Chatbot.css';

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const sendMessage = async () => {
        if (input.trim() === '') return;

        const newMessages = [...messages, { text: input, user: true }];
        setMessages(newMessages);
        setInput('');

        try {
            let reply = '';
            const userInput = input.toLowerCase().trim();
            if (userInput === 'hi' || userInput === 'hello') {
                reply = "Welcome to Car Services and Car Products! How are you? I hope you're fine. We offer both services and products. What are you interested in today?";
            } else if (userInput === 'services') {
                reply = `We offer the following car services:\n1. Full Body Wrap\n2. Dashboard Wrap\n3. Car Rexine\n4. PPF Coating`;
            } else if (userInput === 'products') {
                reply = `We offer the following car products:\n1. LED Lights\n2. Key Covers\n3. Seat Covers\n4. Steering Covers`;
            } else if (userInput === 'full body wrap') {
                reply = `Our full body wrap service provides a complete protective and stylish wrap for your car, enhancing its appearance and safeguarding the original paint.`;
            } else if (userInput === 'dashboard wrap') {
                reply = `The dashboard wrap service covers your car's dashboard with high-quality materials, giving it a fresh, new look and added protection.`;
            } else if (userInput === 'car rexine') {
                reply = `Our car rexine service offers durable and aesthetically pleasing rexine covers for your car’s interior, ensuring comfort and style.`;
            } else if (userInput === 'ppf coating') {
                reply = `Paint Protection Film (PPF) coating service provides a transparent, durable layer that protects your car’s paint from scratches and environmental damage.`;
            } else if (userInput === 'led lights') {
                reply = `Our LED lights enhance your car's visibility and aesthetic appeal with bright, energy-efficient lighting options for both interior and exterior use.`;
            } else if (userInput === 'key covers') {
                reply = `Stylish and durable key covers protect your car keys from damage and wear while adding a personalized touch.`;
            } else if (userInput === 'seat covers') {
                reply = `Our seat covers offer comfort and protection for your car seats, available in various designs and materials to suit your preferences.`;
            } else if (userInput === 'steering covers') {
                reply = `Steering covers provide a better grip and a stylish look for your steering wheel, available in various textures and colors.`;
            } else {
                reply = "I'm sorry, I didn't understand that. Please choose either 'services' or 'products'.";
            }
            
            setMessages([...newMessages, { text: reply, user: false }]);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div>
            <div className="chatbot-icon" onClick={() => setIsOpen(!isOpen)} title="Chatbot">
                <img src="/chatbot-icon-removebg.png" alt="Chatbot Icon" />
            </div>
            {isOpen && (
                <div className="chatbot-container">
                    <div className="messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={msg.user ? 'user-message' : 'bot-message'}>
                                {msg.text}
                            </div>
                        ))}
                    </div>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Type your message..."
                    />
                    <button onClick={sendMessage}>Send</button>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
