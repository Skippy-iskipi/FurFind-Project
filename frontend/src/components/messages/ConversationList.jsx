import { useState } from 'react';
import axios from 'axios';
import { Search, Plus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const ConversationList = ({ conversations = [], selectedConversation, onSelectConversation, onNewConversation, loading }) => {
    const [showNewMessageModal, setShowNewMessageModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);

    const handleUserSearch = async (query) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        try {
            setSearchLoading(true);
            const response = await axios.get(`http://localhost:5000/api/auth/users/search?query=${query}`, {
                withCredentials: true
            });
            if (response.data.success) {
                const existingUserIds = conversations.map(conv => conv.user?._id);
                const filteredUsers = response.data.users.filter(
                    user => !existingUserIds.includes(user._id)
                );
                setSearchResults(filteredUsers);
            } else {
                setSearchResults([]);
            }
        } catch (error) {
            console.error('Error searching users:', error);
            setSearchResults([]);
        } finally {
            setSearchLoading(false);
        }
    };

    const handleStartConversation = async (user) => {
        try {
            const newConversation = {
                user: {
                    _id: user._id,
                    name: user.name,
                    profilePicture: user.profilePicture
                }
            };
            
            onNewConversation(newConversation);
            setShowNewMessageModal(false);
            setSearchQuery('');
            setSearchResults([]);
        } catch (error) {
            console.error('Error starting conversation:', error);
            alert('Failed to start conversation. Please try again.');
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Messages</h2>
                    <button
                        onClick={() => setShowNewMessageModal(true)}
                        className="p-2 text-[#7A62DC] hover:bg-[#7A62DC] hover:text-white rounded-full transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                {loading ? (
                    <div className="flex justify-center items-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7A62DC]"></div>
                    </div>
                ) : conversations.length > 0 ? (
                    conversations.map((conversation) => (
                        <div
                            key={conversation?.user?._id}
                            className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                                selectedConversation?.user?._id === conversation?.user?._id
                                    ? 'bg-blue-50'
                                    : ''
                            }`}
                            onClick={() => onSelectConversation(conversation)}
                        >
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <img
                                        src={conversation.user?.profilePicture || '/default-avatar.png'}
                                        alt={conversation.user?.name}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    {conversation.unread && (
                                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center">
                                        <h3 className={`font-medium ${conversation.unread ? 'text-black' : 'text-gray-700'}`}>
                                            {conversation.user?.name}
                                        </h3>
                                        {conversation.lastMessage && (
                                            <span className="text-xs text-gray-400">
                                                {formatDistanceToNow(new Date(conversation.lastMessage.createdAt), { addSuffix: true })}
                                            </span>
                                        )}
                                    </div>
                                    {conversation.lastMessage && (
                                        <p className={`text-sm truncate ${
                                            conversation.unread ? 'font-medium text-black' : 'text-gray-500'
                                        }`}>
                                            {conversation.lastMessage.content}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-4 text-center">
                        <p className="text-gray-500 mb-4">No conversations yet</p>
                        <button
                            onClick={() => setShowNewMessageModal(true)}
                            className="bg-[#7A62DC] text-white px-4 py-2 rounded-md hover:bg-[#6249c7] transition-colors"
                        >
                            Start a Conversation
                        </button>
                    </div>
                )}
            </div>

            {showNewMessageModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">New Message</h3>
                            <button
                                onClick={() => {
                                    setShowNewMessageModal(false);
                                    setSearchQuery('');
                                    setSearchResults([]);
                                }}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                &times;
                            </button>
                        </div>
                        
                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    handleUserSearch(e.target.value);
                                }}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#7A62DC]"
                            />
                        </div>

                        <div className="max-h-60 overflow-y-auto">
                            {searchLoading ? (
                                <div className="flex justify-center items-center py-4">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#7A62DC]"></div>
                                </div>
                            ) : searchResults.length > 0 ? (
                                searchResults.map((user) => (
                                    <div
                                        key={user._id}
                                        onClick={() => handleStartConversation(user)}
                                        className="flex items-center gap-3 p-2 hover:bg-gray-100 cursor-pointer rounded-lg"
                                    >
                                        <img
                                            src={user.profilePicture || '/default-avatar.png'}
                                            alt={user.name}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <div>
                                            <h3 className="font-medium">{user.name}</h3>
                                            <p className="text-sm text-gray-500">{user.role}</p>
                                        </div>
                                    </div>
                                ))
                            ) : searchQuery ? (
                                <p className="text-center text-gray-500 py-4">No users found</p>
                            ) : null}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ConversationList; 