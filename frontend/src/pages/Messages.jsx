import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';
import ConversationList from '../components/messages/ConversationList';
import ChatWindow from '../components/messages/ChatWindow';
import { ArrowLeft } from 'lucide-react';

const Messages = () => {
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        fetchConversations();
    }, []);

    const fetchConversations = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/api/auth/conversations', {
                withCredentials: true
            });
            console.log('Fetched conversations:', response.data);
            if (response.data.success) {
                setConversations(response.data.conversations || []);
            }
        } catch (error) {
            console.error('Error fetching conversations:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectConversation = async (conversation) => {
        console.log('Selected conversation:', conversation);
        setSelectedConversation(conversation);
        await fetchConversations();
    };

    const handleNewConversation = async (newConversation) => {
        console.log('New conversation started:', newConversation);
        setSelectedConversation(newConversation);
        await fetchConversations();
    };

    return (
        <div className="flex flex-col h-screen">
            <div className="bg-white border-b p-4 flex items-center">
                <button 
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Dashboard
                </button>
            </div>
            <div className="flex flex-1">
                <div className="w-1/3 border-r">
                    <ConversationList
                        conversations={conversations}
                        selectedConversation={selectedConversation}
                        onSelectConversation={handleSelectConversation}
                        onNewConversation={handleNewConversation}
                        loading={loading}
                    />
                </div>
                <div className="w-2/3">
                    {selectedConversation ? (
                        <ChatWindow
                            selectedConversation={selectedConversation}
                            currentUser={user}
                            onMessageSent={fetchConversations}
                        />
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-500">
                            Select a conversation to start messaging
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Messages; 