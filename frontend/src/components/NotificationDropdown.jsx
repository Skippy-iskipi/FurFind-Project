import { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { formatTimeAgo } from '../utils/dateUtils';

const NotificationDropdown = () => {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef(null);

    const fetchNotifications = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/notifications', {
                credentials: 'include'
            });
            const data = await response.json();
            
            if (data.success) {
                const filteredNotifications = data.notifications.filter(
                    notification => notification.type !== 'message'
                );
                setNotifications(filteredNotifications);
                setUnreadCount(filteredNotifications.filter(n => !n.read).length);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/auth/notifications/${notificationId}/read`, {
                method: 'PATCH',
                credentials: 'include'
            });
            const data = await response.json();
            
            if (data.success) {
                setNotifications(notifications.map(n => 
                    n._id === notificationId ? { ...n, read: true } : n
                ));
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/notifications/mark-all-read', {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to mark notifications as read');
            }

            const data = await response.json();
            if (data.success) {
                setNotifications(notifications.map(notif => ({
                    ...notif,
                    read: true
                })));
                setUnreadCount(0);
            } else {
                throw new Error(data.message || 'Failed to mark notifications as read');
            }
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // Refresh every 30 seconds
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative"
            >
                <Bell className="text-[#7A62DC] w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50 max-h-[80vh] overflow-y-auto">
                    <div className="p-4 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Notifications</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-sm text-[#7A62DC] hover:text-[#6249c7] transition-colors"
                                >
                                    Mark all as read
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="divide-y">
                        {notifications.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">
                                No notifications
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification._id}
                                    className={`p-4 hover:bg-gray-50 cursor-pointer ${
                                        !notification.read ? 'bg-blue-50' : ''
                                    }`}
                                    onClick={() => markAsRead(notification._id)}
                                >
                                    <p className="text-sm text-gray-800">{notification.message}</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {formatTimeAgo(notification.createdAt)}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown; 