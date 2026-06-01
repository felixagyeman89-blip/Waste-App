
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/entities/User";
import { Notification } from "@/entities/Notification"; // Added Notification entity
import { 
  Menu, X, Home, Calendar, Bell, CreditCard, BookOpen, 
  Settings, LogOut, Truck, BarChart3, Users, BellRing,
  Globe, ChevronDown, CheckCheck // Added CheckCheck icon
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel, // Added
  DropdownMenuSeparator // Added
} from "@/components/ui/dropdown-menu";

const translations = {
  en: {
    dashboard: "Dashboard",
    schedule: "Schedule Pickup",
    notifications: "Notifications",
    payments: "Payments",
    education: "Learn More",
    settings: "Settings",
    logout: "Logout",
    admin: "Admin Panel",
    collectors: "Collectors",
    analytics: "Analytics",
    users: "Users",
    language: "Language",
    english: "English",
    twi: "Twi"
  },
  tw: {
    dashboard: "Bord Kɔkɔbɔ",
    schedule: "Hyehyɛ Nnwuma",
    notifications: "Amanneɛbɔ",
    payments: "Sika Tua",
    education: "Sua Pii",
    settings: "Nhyehyɛe",
    logout: "Fi Adi",
    admin: "Admin Board",
    collectors: "Nnwumayɛfo",
    analytics: "Nhwehwɛmu",
    users: "Nnipa",
    language: "Kasa",
    english: "Borɔfo Kasa",
    twi: "Twi Kasa"
  }
};

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState('en');
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      try {
        const userData = await User.me();
        setUser(userData);
        const savedLang = userData.preferred_language || localStorage.getItem('preferred_language') || 'en';
        setLanguage(savedLang);
        await fetchNotifications(userData); // Initial fetch
      } catch (error) {
        if (!location.pathname.includes('auth') && location.pathname !== '/') {
          navigate(createPageUrl("Auth"));
        }
      }
      setIsLoading(false);
    };

    initialize();
    
    // Set up an interval to fetch notifications periodically
    let intervalId;
    if (user) {
        intervalId = setInterval(() => {
            fetchNotifications(user);
        }, 30000); // every 30 seconds
    }

    return () => {
        if (intervalId) {
            clearInterval(intervalId);
        }
    };
  }, [user?.id, location.pathname, navigate]);

  const fetchNotifications = async (userData) => {
    try {
      // Try to get unread notifications, with fallback if entity doesn't exist
      const unreadNotifications = await Notification.filter(
        { 
          is_read: false,
          recipient_user_type: userData.user_type === 'administrator' ? 'administrator' : 
                              userData.user_type === 'waste_collector' ? 'waste_collector' : 'all'
        }, 
        '-created_date', 
        10
      );
      setNotifications(unreadNotifications || []);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      // Set empty array on error to prevent UI issues
      setNotifications([]);
    }
  };

  const handleLanguageChange = async (newLang) => {
    setLanguage(newLang);
    localStorage.setItem('preferred_language', newLang);
    if (user) {
      try {
        await User.updateMyUserData({ preferred_language: newLang });
      } catch (error) {
        console.error("Failed to update user language preference:", error);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await User.logout();
      navigate(createPageUrl("Auth"));
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };
  
  const handleMarkNotificationsAsRead = async () => {
    if (notifications.length === 0) return;
    
    // Collect all notification IDs to be marked as read
    const idsToUpdate = notifications.map(n => n.id);
    
    // Optimistically update UI
    setNotifications([]); 

    // Send update requests
    try {
        // In a real scenario, you'd ideally have a bulk update method for performance.
        // For now, we iterate and update individually.
        for (const id of idsToUpdate) {
            await Notification.update(id, { is_read: true });
        }
    } catch (error) {
        console.error("Failed to mark notifications as read:", error);
        // If bulk update fails, you might want to re-fetch to reflect actual state
        fetchNotifications(user); 
    }
  };

  const getNavigationItems = () => {
    const t = translations[language];
    const baseItems = [
      {
        title: t.dashboard,
        url: createPageUrl("Dashboard"),
        icon: Home,
      },
      {
        title: t.schedule,
        url: createPageUrl("Schedule"),
        icon: Calendar,
      },
      {
        title: t.notifications,
        url: createPageUrl("Notifications"),
        icon: BellRing,
      },
      {
        title: t.payments,
        url: createPageUrl("Payments"),
        icon: CreditCard,
      },
      {
        title: t.education,
        url: createPageUrl("Education"),
        icon: BookOpen,
      },
      {
        title: t.settings,
        url: createPageUrl("Settings"),
        icon: Settings,
      }
    ];

    if (user?.user_type === 'administrator') {
      baseItems.push(
        {
          title: t.analytics,
          url: createPageUrl("Analytics"),
          icon: BarChart3,
        },
        {
          title: t.users,
          url: createPageUrl("UserManagement"),
          icon: Users,
        }
      );
    }

    if (user?.user_type === 'waste_collector') {
      baseItems.push({
        title: t.collectors,
        url: createPageUrl("CollectorDashboard"),
        icon: Truck,
      });
    }

    return baseItems;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // Only render children directly if not authenticated and trying to access a non-auth/non-root page.
  // Otherwise, the layout will render the auth page redirect or the full layout.
  if (!user && !location.pathname.includes('auth') && location.pathname !== '/') {
    // If we're not loading and user is null, and not on auth page, it means redirection should handle it.
    // This case should ideally not be hit if `initialize` correctly navigates.
    // However, if `children` is an independent route, it might still need to render.
    // This condition might be problematic if it prevents showing content *while* redirecting.
    // Given the `navigate` call in `initialize`, this `if` block is mostly for safety.
    return <div>{children}</div>;
  }

  const t = translations[language];
  const unreadCount = notifications.length;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-green-50 to-emerald-100">
        <style>{`
          :root {
            --primary-green: #16a34a;
            --secondary-gold: #f59e0b;
            --accent-red: #dc2626;
            --neutral-dark: #1f2937;
            --neutral-light: #f9fafb;
            --success: #10b981;
            --warning: #f59e0b;
            --error: #ef4444;
          }
          
          .sidebar-active {
            background: linear-gradient(135deg, var(--primary-green) 0%, #15803d 100%);
            color: white;
          }
          
          .ghana-pattern {
            background-image: 
              linear-gradient(45deg, transparent 25%, rgba(245, 158, 11, 0.1) 25%),
              linear-gradient(-45deg, transparent 25%, rgba(245, 158, 11, 0.1) 25%),
              linear-gradient(45deg, rgba(245, 158, 11, 0.1) 75%, transparent 75%),
              linear-gradient(-45deg, rgba(245, 158, 11, 0.1) 75%, transparent 75%);
            background-size: 20px 20px;
            background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
          }
        `}</style>

        <Sidebar className="border-r border-green-200 bg-white">
          <SidebarHeader className="border-b border-green-200 p-4 ghana-pattern">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-lg">Kwadaso</h2>
                <p className="text-xs text-green-700 font-medium">Waste Collection</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-2">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-green-700 uppercase tracking-wider px-2 py-2">
                {t.dashboard}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {getNavigationItems().map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`hover:bg-green-50 hover:text-green-700 transition-all duration-200 rounded-lg mb-1 ${
                          location.pathname === item.url ? 'sidebar-active shadow-lg' : ''
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-3 py-3 relative">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.title}</span>
                          {item.title === t.notifications && unreadCount > 0 && (
                            <Badge variant="destructive" className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs">
                              {unreadCount}
                            </Badge>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-green-200 p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    {language === 'en' ? t.english : t.twi}
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => handleLanguageChange('en')}>
                  {t.english}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLanguageChange('tw')}>
                  {t.twi}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Simplified user info for sidebar footer, main display in header */}
            <div className="flex items-center gap-3 mt-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-700 font-semibold text-sm">
                  {user?.full_name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm truncate">
                  {user?.full_name || 'User'}
                </p>
                <p className="text-xs text-green-600 truncate capitalize">
                  {user?.user_type?.replace('_', ' ')}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-600"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white/80 backdrop-blur-sm border-b border-green-200/80 px-4 sm:px-6 py-3 sticky top-0 z-30">
            <div className="flex items-center justify-between gap-4">
              <SidebarTrigger className="md:hidden hover:bg-green-50 p-2 rounded-lg transition-colors duration-200" />
              <div className="hidden md:block">
                 <h1 className="text-xl font-bold text-gray-800 capitalize">{currentPageName?.replace(/([A-Z])/g, ' $1').trim()}</h1>
              </div>

              <div className="flex items-center gap-4 ml-auto">
                 <DropdownMenu onOpenChange={(open) => open && handleMarkNotificationsAsRead()}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <Bell className="w-5 h-5" />
                      {unreadCount > 0 && (
                        <Badge variant="destructive" className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs">
                          {unreadCount}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {notifications.length > 0 ? (
                      notifications.map(n => (
                        <DropdownMenuItem key={n.id} asChild>
                          <Link to={n.link_to || createPageUrl("Notifications")} className="cursor-pointer">
                            <div className="flex flex-col">
                              <span className="font-semibold text-base">{n.title}</span>
                              <p className="text-sm text-gray-500 whitespace-normal">{n.message}</p>
                            </div>
                          </Link>
                        </DropdownMenuItem>
                      ))
                    ) : (
                      <div className="p-4 text-center text-sm text-gray-500">
                         <CheckCheck className="w-6 h-6 mx-auto mb-2 text-green-500" />
                         You're all caught up!
                      </div>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className="hidden md:flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-700 font-semibold text-sm">
                        {user?.full_name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">
                        {user?.full_name || 'User'}
                      </p>
                      <p className="text-xs text-green-600 truncate capitalize">
                        {user?.user_type?.replace('_', ' ')}
                      </p>
                    </div>
                </div>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-auto p-4 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
