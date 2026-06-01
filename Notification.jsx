import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Notification } from "@/entities/Notification";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bell, BellRing, CheckCircle, AlertCircle, Info, Calendar,
  Trash2, Undo2, RefreshCw, Settings, Filter
} from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const translations = {
  en: {
    notifications: "Notifications",
    manageNotifications: "Stay updated with your waste collection activities",
    allNotifications: "All",
    unread: "Unread",
    read: "Read",
    markAllRead: "Mark All as Read",
    markAsRead: "Mark as Read",
    markAsUnread: "Mark as Unread",
    delete: "Delete",
    refresh: "Refresh",
    noNotifications: "No notifications found",
    noUnread: "No unread notifications",
    noRead: "No read notifications",
    newPickup: "New Pickup Request",
    paymentReceived: "Payment Received",
    userRegistered: "New User Registered",
    systemUpdate: "System Update",
    just_now: "Just now",
    minutes_ago: "minutes ago",
    hours_ago: "hours ago",
    days_ago: "days ago",
    weeks_ago: "weeks ago",
    errorLoading: "Unable to load notifications. Please try again later."
  },
  tw: {
    notifications: "Amanneɛbɔ",
    manageNotifications: "Hwɛ wo nwura boaboa dwumadi ho nsɛm",
    allNotifications: "Nyinaa",
    unread: "Wɔnkenkanee",
    read: "Wɔakenkan",
    markAllRead: "Ma Nyinaa Ayɛ Akenkan",
    markAsRead: "Ma Ayɛ Akenkan",
    markAsUnread: "Ma Ayɛ Wɔnkenkanee",
    delete: "Yi Fi",
    refresh: "Yɛ Foforɔ",
    noNotifications: "Amanneɛbɔ biara nni hɔ",
    noUnread: "Amanneɛbɔ a wɔnkenkanee biara nni hɔ",
    noRead: "Amanneɛbɔ a wɔakenkan biara nni hɔ",
    newPickup: "Gya Foforɔ Abisadeɛ",
    paymentReceived: "Wɔanya Sika",
    userRegistered: "Ɔbarima/Ɔbea Foforɔ Abɛhyɛ",
    systemUpdate: "Nhyehyɛe Foforɔ",
    just_now: "Seesei ara",
    minutes_ago: "simma a atwam",
    hours_ago: "nnɔnhwerew a atwam",
    days_ago: "nna a atwam",
    weeks_ago: "nnawɔtwe a atwam",
    errorLoading: "Yɛntumi nnya amanneɛbɔ no. Yɛsrɛ wo bɔ mmɔden bio."
  }
};

export default function NotificationsPage() {
  const [user, setUser] = useState(null);
  const [language, setLanguage] = useState('en');
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    initializeUser();
  }, []);

  useEffect(() => {
    filterNotifications();
  }, [notifications, activeTab]);

  const initializeUser = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
      setLanguage(userData.preferred_language || 'en');
      await loadNotifications(userData);
    } catch (error) {
      console.error("Error loading user data:", error);
      setLoadError(true);
    }
  };

  const loadNotifications = async (userData = user) => {
    if (!userData) return;
    
    setIsLoading(true);
    setLoadError(false);
    try {
      // Try to load notifications with error handling
      const userNotifications = await Notification.list('-created_date', 50);
      
      // Filter based on user type
      const filteredNotifications = userNotifications.filter(notification => {
        if (userData.user_type === 'administrator') {
          return ['administrator', 'all'].includes(notification.recipient_user_type);
        } else if (userData.user_type === 'waste_collector') {
          return ['waste_collector', 'all'].includes(notification.recipient_user_type);
        } else {
          return notification.recipient_user_type === 'all';
        }
      });
      
      setNotifications(filteredNotifications);
    } catch (error) {
      console.error("Error loading notifications:", error);
      setNotifications([]);
      setLoadError(true);
    }
    setIsLoading(false);
  };

  const refreshNotifications = async () => {
    setIsRefreshing(true);
    await loadNotifications();
    setIsRefreshing(false);
  };

  const filterNotifications = () => {
    let filtered = notifications;
    
    if (activeTab === 'unread') {
      filtered = notifications.filter(n => !n.is_read);
    } else if (activeTab === 'read') {
      filtered = notifications.filter(n => n.is_read);
    }
    
    setFilteredNotifications(filtered);
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await Notification.update(notificationId, { is_read: true });
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleMarkAsUnread = async (notificationId) => {
    try {
      await Notification.update(notificationId, { is_read: false });
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, is_read: false } : n)
      );
    } catch (error) {
      console.error("Error marking notification as unread:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.is_read);
      for (const notification of unreadNotifications) {
        await Notification.update(notification.id, { is_read: true });
      }
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return t.just_now;
    if (diffInMinutes < 60) return `${diffInMinutes} ${t.minutes_ago}`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} ${t.hours_ago}`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)} ${t.days_ago}`;
    return `${Math.floor(diffInMinutes / 10080)} ${t.weeks_ago}`;
  };

  const getNotificationIcon = (type) => {
    const icons = {
      new_pickup: Calendar,
      payment_received: CheckCircle,
      user_registered: Info,
      system_update: Settings
    };
    return icons[type] || Bell;
  };

  const getNotificationColor = (type) => {
    const colors = {
      new_pickup: "text-blue-600",
      payment_received: "text-green-600", 
      user_registered: "text-purple-600",
      system_update: "text-orange-600"
    };
    return colors[type] || "text-gray-600";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const t = translations[language];
  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.notifications}</h1>
            <p className="text-gray-600">{t.manageNotifications}</p>
          </div>
          <div className="flex gap-3">
            {unreadCount > 0 && (
              <Button 
                variant="outline" 
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                {t.markAllRead}
              </Button>
            )}
            <Button
              variant="outline"
              onClick={refreshNotifications}
              disabled={isRefreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {t.refresh}
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BellRing className="h-5 w-5 text-green-600" />
                {t.notifications}
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {unreadCount}
                  </Badge>
                )}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {loadError ? (
              <div className="text-center py-12">
                <AlertCircle className="h-16 w-16 text-red-300 mx-auto mb-4" />
                <p className="text-red-500 mb-4">{t.errorLoading}</p>
                <Button onClick={refreshNotifications} variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {t.refresh}
                </Button>
              </div>
            ) : (
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="all" className="flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    {t.allNotifications}
                    <Badge variant="secondary" className="ml-1">{notifications.length}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="unread" className="flex items-center gap-2">
                    <BellRing className="w-4 h-4" />
                    {t.unread}
                    {unreadCount > 0 && (
                      <Badge variant="destructive" className="ml-1">{unreadCount}</Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="read" className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    {t.read}
                    <Badge variant="secondary" className="ml-1">{notifications.length - unreadCount}</Badge>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                  <NotificationList 
                    notifications={filteredNotifications}
                    onMarkAsRead={handleMarkAsRead}
                    onMarkAsUnread={handleMarkAsUnread}
                    getTimeAgo={getTimeAgo}
                    getNotificationIcon={getNotificationIcon}
                    getNotificationColor={getNotificationColor}
                    translations={t}
                    emptyMessage={t.noNotifications}
                  />
                </TabsContent>

                <TabsContent value="unread">
                  <NotificationList 
                    notifications={filteredNotifications}
                    onMarkAsRead={handleMarkAsRead}
                    onMarkAsUnread={handleMarkAsUnread}
                    getTimeAgo={getTimeAgo}
                    getNotificationIcon={getNotificationIcon}
                    getNotificationColor={getNotificationColor}
                    translations={t}
                    emptyMessage={t.noUnread}
                  />
                </TabsContent>

                <TabsContent value="read">
                  <NotificationList 
                    notifications={filteredNotifications}
                    onMarkAsRead={handleMarkAsRead}
                    onMarkAsUnread={handleMarkAsUnread}
                    getTimeAgo={getTimeAgo}
                    getNotificationIcon={getNotificationIcon}
                    getNotificationColor={getNotificationColor}
                    translations={t}
                    emptyMessage={t.noRead}
                  />
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function NotificationList({ 
  notifications, 
  onMarkAsRead, 
  onMarkAsUnread, 
  getTimeAgo, 
  getNotificationIcon, 
  getNotificationColor,
  translations: t,
  emptyMessage 
}) {
  if (notifications.length === 0) {
    return (
      <div className="text-center py-12">
        <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notifications.map((notification) => {
        const IconComponent = getNotificationIcon(notification.type);
        const iconColor = getNotificationColor(notification.type);
        
        return (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`p-4 border rounded-lg transition-all ${
              notification.is_read 
                ? 'bg-gray-50 border-gray-200' 
                : 'bg-blue-50 border-blue-200 shadow-sm'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-full ${
                  notification.is_read ? 'bg-gray-200' : 'bg-blue-100'
                }`}>
                  <IconComponent className={`w-4 h-4 ${iconColor}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className={`font-semibold ${
                        notification.is_read ? 'text-gray-700' : 'text-gray-900'
                      }`}>
                        {notification.title}
                      </h3>
                      <p className={`text-sm mt-1 ${
                        notification.is_read ? 'text-gray-500' : 'text-gray-700'
                      }`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {getTimeAgo(notification.created_date)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!notification.is_read ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onMarkAsRead(notification.id)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    {t.markAsRead}
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onMarkAsUnread(notification.id)}
                    className="text-gray-600 hover:text-gray-700"
                  >
                    <Undo2 className="w-4 h-4" />
                  </Button>
                )}
                
                {notification.link_to && (
                  <Link to={notification.link_to}>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}