import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

const ChatWindow = ({ selectedConversation, currentUser, onMessageSent, accentColor = '#7A62DC' }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (selectedConversation?.user?._id) {
            fetchMessages();
        }
    }, [selectedConversation]);

    const fetchMessages = async () => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/auth/messages/${selectedConversation.user._id}`,
                { withCredentials: true }
            );
            if (response.data.success) {
                setMessages(response.data.messages || []);
                scrollToBottom();
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const response = await axios.post(
                'http://localhost:5000/api/auth/messages/send',
                {
                    recipientId: selectedConversation.user._id,
                    content: newMessage
                },
                { withCredentials: true }
            );

            if (response.data.success) {
                setNewMessage('');
                fetchMessages();
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const formatMessageTime = (timestamp) => {
        return format(new Date(timestamp), 'h:mm a');
    };

    if (!selectedConversation) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
                <p className="text-gray-500">Select a conversation to start messaging</p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col bg-white">
            {/* Header */}
            <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">
                    {selectedConversation.user.name}
                </h2>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {Array.isArray(messages) && messages.map((message) => (
                    <div
                        key={message._id}
                        className={`flex flex-col ${
                            message.sender._id === currentUser._id ? 'items-end' : 'items-start'
                        }`}
                    >
                        <div
                            className={`max-w-[70%] rounded-lg p-3 ${
                                message.sender._id === currentUser._id
                                    ? 'bg-[#7A62DC] text-white'
                                    : 'bg-gray-100'
                            }`}
                        >
                            <p>{message.content}</p>
                            <div className="flex items-center gap-1 mt-1 text-xs">
                                <span className={message.sender._id === currentUser._id ? 'text-gray-200' : 'text-gray-500'}>
                                    {formatMessageTime(message.createdAt)}
                                </span>
                                {message.sender._id === currentUser._id && (
                                    <span className="text-gray-200 text-xs">
                                        {message.read ? '• Read' : ''}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7A62DC]"
                    />
                    <button
                        type="submit"
                        className="w-32 px-4 py-2 bg-[#7A62DC] text-white rounded-lg hover:bg-[#6249c7] focus:outline-none focus:ring-2 focus:ring-[#7A62DC]"
                    >
                        Send
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatWindow; 