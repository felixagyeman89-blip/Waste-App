
import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { WastePickup } from "@/entities/WastePickup";
import { Payment } from "@/entities/Payment";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar, Clock, BellRing, Truck, CreditCard, BookOpen, // Added BellRing, removed MapPin
  Plus, TrendingUp, AlertCircle, CheckCircle, // Removed Users as it was unused
  Recycle, Leaf, DollarSign
} from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import ProfileCompletionBanner from "@/components/notifications/ProfileCompletionBanner";

const translations = {
  en: {
    welcome: "Welcome back",
    dashboard: "Dashboard",
    quickActions: "Quick Actions",
    schedulePickup: "Schedule Pickup",
    viewEducation: "Learn More",
    // trackCollection: "Track Collection", // Removed
    viewNotifications: "View Notifications", // Added
    recentActivity: "Recent Activity",
    upcomingPickups: "Upcoming Pickups",
    paymentStatus: "Payment Status",
    monthlyStats: "This Month",
    totalPickups: "Total Pickups",
    pendingPayments: "Pending Payments",
    completedJobs: "Completed",
    carbonSaved: "CO₂ Saved",
    noPickups: "No upcoming pickups",
    scheduleFirst: "Schedule your first pickup",
    viewAll: "View All",
    urgent: "Urgent",
    high: "High",
    medium: "Medium",
    low: "Low",
    scheduled: "Scheduled",
    inProgress: "In Progress",
    completed: "Completed",
    cancelled: "Cancelled"
  },
  tw: {
    welcome: "Akwaaba san",
    dashboard: "Bord Kɔkɔbɔ",
    quickActions: "Nnwuma Ntɛmntɛm",
    schedulePickup: "Hyehyɛ Gya",
    viewEducation: "Sua Pii",
    // trackCollection: "Hwɛ Boaboa", // Removed
    viewNotifications: "Hwɛ Nkaebɔ", // Added
    recentActivity: "Nnwuma a Aba Yi",
    upcomingPickups: "Gya a Ɛreba",
    paymentStatus: "Sika Tua Tebea",
    monthlyStats: "Bosome Yi",
    totalPickups: "Gya Nyinaa",
    pendingPayments: "Sika a Ɛda Hɔ",
    completedJobs: "Wie",
    carbonSaved: "CO₂ a Yɛakora",
    noPickups: "Gya biara nni hɔ",
    scheduleFirst: "Hyehyɛ wo gya a ɛdi kan",
    viewAll: "Hwɛ Nyinaa",
    urgent: "Ɛho Hia",
    high: "Sorosoro",
    medium: "Mfinimfini",
    low: "Ahobrɛase",
    scheduled: "Wɔahyehyɛ",
    inProgress: "Ɛrekɔ So",
    completed: "Awi",
    cancelled: "Wɔatwa"
  }
};

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [pickups, setPickups] = useState([]);
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState({
    totalPickups: 0,
    pendingPayments: 0,
    completedJobs: 0,
    carbonSaved: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
      setLanguage(userData.preferred_language || 'en');

      const userPickups = await WastePickup.filter({ customer_id: userData.id }, '-created_date', 10);
      setPickups(userPickups);

      const userPayments = await Payment.filter({ customer_id: userData.id }, '-created_date', 5);
      setPayments(userPayments);

      // Calculate stats
      const totalPickups = userPickups.length;
      const pendingPayments = userPayments.filter(p => p.status === 'pending').length;
      const completedJobs = userPickups.filter(p => p.status === 'completed').length;
      const carbonSaved = completedJobs * 2.3; // Estimated kg CO2 saved per pickup

      setStats({
        totalPickups,
        pendingPayments,
        completedJobs,
        carbonSaved: carbonSaved.toFixed(1)
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
    setIsLoading(false);
  };

  const getPriorityColor = (priority) => {
    const colors = {
      urgent: "bg-red-100 text-red-800",
      high: "bg-orange-100 text-orange-800",
      medium: "bg-yellow-100 text-yellow-800",
      low: "bg-green-100 text-green-800"
    };
    return colors[priority] || colors.medium;
  };

  const getStatusColor = (status) => {
    const colors = {
      scheduled: "bg-blue-100 text-blue-800",
      in_progress: "bg-purple-100 text-purple-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800"
    };
    return colors[status] || colors.scheduled;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const t = translations[language];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Profile Completion Banner */}
      <ProfileCompletionBanner user={user} language={language} />

      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {t.welcome}, {user?.full_name}!
            </h1>
            <p className="text-gray-600 mt-1">
              {user?.user_type?.replace('_', ' ')} • {format(new Date(), 'EEEE, MMMM do')}
            </p>
          </div>

          <div className="flex gap-3">
            <Link to={createPageUrl("Schedule")}>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                {t.schedulePickup}
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">
              {t.totalPickups}
            </CardTitle>
            <Calendar className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{stats.totalPickups}</div>
            <p className="text-xs text-blue-600 mt-1">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              {t.monthlyStats}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">
              {t.pendingPayments}
            </CardTitle>
            <CreditCard className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{stats.pendingPayments}</div>
            <p className="text-xs text-orange-600 mt-1">
              <AlertCircle className="inline h-3 w-3 mr-1" />
              Needs attention
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-700">
              {t.completedJobs}
            </CardTitle>
            <CheckCircle className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{stats.completedJobs}</div>
            <p className="text-xs text-green-600 mt-1">
              <Recycle className="inline h-3 w-3 mr-1" />
              This month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-emerald-700">
              {t.carbonSaved}
            </CardTitle>
            <Leaf className="h-5 w-5 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-900">{stats.carbonSaved}kg</div>
            <p className="text-xs text-emerald-600 mt-1">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              Environmental impact
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-green-600" />
              {t.quickActions}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link to={createPageUrl("Schedule")}>
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                  <Calendar className="h-6 w-6 text-green-600" />
                  <span>{t.schedulePickup}</span>
                </Button>
              </Link>

              {/* Replaced Tracking with Notifications */}
              <Link to={createPageUrl("Notifications")}>
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                  <BellRing className="h-6 w-6 text-blue-600" />
                  <span>{t.viewNotifications}</span>
                </Button>
              </Link>

              <Link to={createPageUrl("Education")}>
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                  <BookOpen className="h-6 w-6 text-purple-600" />
                  <span>{t.viewEducation}</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-green-600" />
                {t.upcomingPickups}
              </CardTitle>
              <Link to={createPageUrl("Schedule")}>
                <Button variant="ghost" size="sm">
                  {t.viewAll}
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {pickups.length === 0 ? (
                <div className="text-center py-8">
                  <Truck className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">{t.noPickups}</p>
                  <Link to={createPageUrl("Schedule")}>
                    <Button variant="outline" className="mt-2">
                      {t.scheduleFirst}
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {pickups.slice(0, 3).map((pickup) => (
                    <div key={pickup.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <div>
                          <p className="font-medium">{pickup.waste_type?.replace('_', ' ')}</p>
                          <p className="text-sm text-gray-500">
                            {format(new Date(pickup.scheduled_date), 'MMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(pickup.priority)}>
                          {t[pickup.priority]}
                        </Badge>
                        <Badge className={getStatusColor(pickup.status)}>
                          {t[pickup.status] || pickup.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                {t.paymentStatus}
              </CardTitle>
              <Link to={createPageUrl("Payments")}>
                <Button variant="ghost" size="sm">
                  {t.viewAll}
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {payments.length === 0 ? (
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No recent payments</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {payments.slice(0, 3).map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">GH₵ {payment.amount}</p>
                        <p className="text-sm text-gray-500">{payment.payment_method?.replace('_', ' ')}</p>
                      </div>
                      <Badge className={getStatusColor(payment.status)}>
                        {payment.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
