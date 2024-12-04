import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BiMessage } from 'react-icons/bi';

const MessageNotification = () => {
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchUnreadCount = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/message-notifications/unread-count', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success) {
                setUnreadCount(data.unreadCount);
            } else {
                console.error('Failed to fetch unread count:', data.message);
            }
        } catch (error) {
            console.error('Error fetching unread count:', error);
            // Set count to 0 on error
            setUnreadCount(0);
        }
    };

    useEffect(() => {
        fetchUnreadCount();
        
        // Set up polling every 30 seconds
        const interval = setInterval(fetchUnreadCount, 30000);
        
        return () => clearInterval(interval);
    }, []);

    return (
        <Link to="/messages" className="relative">
            <BiMessage className="text-2xl text-[#7A62DC] hover:text-[#6249c7]" />
            {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                </span>
            )}
        </Link>
    );
};

export default MessageNotification; 