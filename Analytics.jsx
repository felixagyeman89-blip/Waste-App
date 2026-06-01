
import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { WastePickup } from "@/entities/WastePickup";
import { Payment } from "@/entities/Payment";
import { CollectorTracking } from "@/entities/CollectorTracking";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Area, AreaChart
} from "recharts";
import { 
  Users, Truck, DollarSign, Calendar, TrendingUp, AlertTriangle,
  CheckCircle, Clock, MapPin, FileText, Download, RefreshCw
} from "lucide-react";
import { motion } from "framer-motion";
import { format, subDays, startOfMonth, endOfMonth } from "date-fns";

const translations = {
  en: {
    title: "Analytics Dashboard",
    subtitle: "Overview of Kwadaso Waste Collection Operations",
    overview: "System Overview",
    totalUsers: "Total Users",
    activeCollectors: "Active Collectors", 
    totalRequests: "Total Requests",
    monthlyRevenue: "Monthly Revenue",
    requestTrends: "Request Trends",
    userGrowth: "User Growth",
    wasteTypeDistribution: "Waste Type Distribution",
    paymentStatus: "Payment Status",
    collectorPerformance: "Collector Performance",
    recentActivity: "Recent Activity",
    topPerformers: "Top Performers",
    alerts: "System Alerts",
    exportReport: "Export Report",
    refresh: "Refresh Data",
    last30Days: "Last 30 Days",
    thisMonth: "This Month",
    allTime: "All Time",
    completionRate: "Completion Rate",
    avgResponseTime: "Avg Response Time",
    customerSatisfaction: "Customer Rating"
  },
  tw: {
    title: "Nhwehwɛmu Dashboard",
    subtitle: "Kwadaso Nwura Boaboa Dwumadi Ho Mfonini",
    overview: "Nhyehyɛe Mua",
    totalUsers: "Nnipa Nyinaa",
    activeCollectors: "Boaboafo a Wɔyɛ Adwuma",
    totalRequests: "Abisade Nyinaa", 
    monthlyRevenue: "Bosome Sika",
    requestTrends: "Abisade Suban",
    userGrowth: "Nnipa Nkɔso",
    wasteTypeDistribution: "Nwura Ahorow Kyekyɛ",
    paymentStatus: "Sika Tua Tebea",
    collectorPerformance: "Boaboafo Adwumayɛ",
    recentActivity: "Nnwuma a Aba Yi",
    topPerformers: "Nnwumayɛfo Pa",
    alerts: "Kɔkɔbɔ Amanneɛ",
    exportReport: "Yi Amanneɛbɔ",
    refresh: "Yɛ Foforɔ",
    last30Days: "Nna 30 a Atwam",
    thisMonth: "Bosome Yi",
    allTime: "Bere Nyinaa",
    completionRate: "Awie Dodow",
    avgResponseTime: "Mmuae Bere Kɛse",
    customerSatisfaction: "Adetɔfo Anigyeɛ"
  }
};

export default function AnalyticsPage() {
  const [user, setUser] = useState(null);
  const [language, setLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30days');
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeCollectors: 0,
    totalRequests: 0,
    monthlyRevenue: 0,
    completionRate: 0,
    avgResponseTime: 0,
    customerRating: 0
  });
  const [chartData, setChartData] = useState({
    requestTrends: [],
    userGrowth: [],
    wasteTypes: [],
    paymentStatus: [],
    collectorPerformance: []
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    checkAdminAccess();
    loadAnalyticsData();
  }, [timeRange]);

  const checkAdminAccess = async () => {
    try {
      const userData = await User.me();
      if (userData.user_type !== 'administrator') {
        window.location.href = '/';
        return;
      }
      setUser(userData);
      setLanguage(userData.preferred_language || 'en');
    } catch (error) {
      window.location.href = '/';
    }
  };

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    try {
      const [allUsers, allPickups, allPayments, allTracking] = await Promise.all([
        User.list(),
        WastePickup.list(),
        Payment.list(), 
        CollectorTracking.list()
      ]);

      // Calculate basic stats
      const totalUsers = allUsers.length;
      const activeCollectors = allTracking.filter(t => t.status === 'available' || t.status === 'busy').length;
      const totalRequests = allPickups.length;
      
      const currentMonth = new Date();
      const monthStart = startOfMonth(currentMonth);
      const monthEnd = endOfMonth(currentMonth);
      
      const monthlyPayments = allPayments.filter(p => 
        p.status === 'completed' && 
        new Date(p.payment_date) >= monthStart && 
        new Date(p.payment_date) <= monthEnd
      );
      const monthlyRevenue = monthlyPayments.reduce((sum, p) => sum + p.amount, 0);

      const completedPickups = allPickups.filter(p => p.status === 'completed');
      const completionRate = (completedPickups.length / totalRequests * 100) || 0;

      // Calculate average response time (mock data)
      const avgResponseTime = 45; // minutes

      // Calculate customer rating
      const ratedPickups = completedPickups.filter(p => p.customer_rating);
      const avgRating = ratedPickups.length > 0 
        ? ratedPickups.reduce((sum, p) => sum + p.customer_rating, 0) / ratedPickups.length 
        : 0;

      setStats({
        totalUsers,
        activeCollectors,
        totalRequests,
        monthlyRevenue,
        completionRate: completionRate.toFixed(1),
        avgResponseTime,
        customerRating: avgRating.toFixed(1)
      });

      // Generate chart data
      generateChartData(allPickups, allUsers, allPayments);
      generateRecentActivity(allPickups, allUsers);
      generateAlerts(allPickups, allTracking);

    } catch (error) {
      console.error("Error loading analytics data:", error);
    }
    setIsLoading(false);
  };

  const generateChartData = (pickups, users, payments) => {
    // Request trends over time
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = subDays(new Date(), i);
      const dayPickups = pickups.filter(p => 
        format(new Date(p.created_date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      ).length;
      return {
        date: format(date, 'MMM dd'),
        requests: dayPickups
      };
    }).reverse();

    // User growth
    const userGrowth = users.reduce((acc, user) => {
      const month = format(new Date(user.created_date), 'MMM yyyy');
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});
    
    const userGrowthData = Object.entries(userGrowth).map(([month, count]) => ({
      month,
      users: count
    }));

    // Waste type distribution
    const wasteTypeCounts = pickups.reduce((acc, pickup) => {
      acc[pickup.waste_type] = (acc[pickup.waste_type] || 0) + 1;
      return acc;
    }, {});
    
    const wasteTypeData = Object.entries(wasteTypeCounts).map(([type, count]) => ({
      name: type?.replace('_', ' ') || 'Unknown',
      value: count
    }));

    // Payment status
    const paymentCounts = payments.reduce((acc, payment) => {
      acc[payment.status] = (acc[payment.status] || 0) + 1;
      return acc;
    }, {});
    
    const paymentData = Object.entries(paymentCounts).map(([status, count]) => ({
      name: status,
      value: count
    }));

    setChartData({
      requestTrends: last30Days,
      userGrowth: userGrowthData.slice(-12),
      wasteTypes: wasteTypeData,
      paymentStatus: paymentData,
      collectorPerformance: []
    });
  };

  const generateRecentActivity = (pickups, users) => {
    const recent = pickups
      .sort((a, b) => new Date(b.created_date) - new Date(a.created_date))
      .slice(0, 10)
      .map(pickup => ({
        id: pickup.id,
        type: 'pickup_request',
        description: `New ${pickup.waste_type?.replace('_', ' ')} pickup request`,
        user: users.find(u => u.id === pickup.customer_id)?.full_name || 'Unknown',
        time: pickup.created_date,
        status: pickup.status
      }));
    
    setRecentActivity(recent);
  };

  const generateAlerts = (pickups, tracking) => {
    const alerts = [];
    
    // Overdue pickups
    const overdue = pickups.filter(p => 
      p.status === 'scheduled' && 
      new Date(p.scheduled_date) < new Date()
    );
    
    if (overdue.length > 0) {
      alerts.push({
        type: 'warning',
        message: `${overdue.length} overdue pickup(s) requiring attention`,
        count: overdue.length
      });
    }

    // Pending payments
    const pendingPayments = pickups.filter(p => p.payment_status === 'pending');
    if (pendingPayments.length > 0) {
      alerts.push({
        type: 'info',
        message: `${pendingPayments.length} pending payment(s) to follow up`,
        count: pendingPayments.length
      });
    }

    setAlerts(alerts);
  };

  const exportReport = () => {
    // Create CSV report
    const reportData = {
      stats,
      generated_at: new Date().toISOString(),
      time_range: timeRange
    };
    
    const csvContent = `Report Generated: ${format(new Date(), 'PPpp')}\n\n` +
      `Total Users,${stats.totalUsers}\n` +
      `Active Collectors,${stats.activeCollectors}\n` +
      `Total Requests,${stats.totalRequests}\n` +
      `Monthly Revenue,${stats.monthlyRevenue}\n` +
      `Completion Rate,${stats.completionRate}%\n` +
      `Average Response Time,${stats.avgResponseTime} minutes\n` +
      `Customer Rating,${stats.customerRating}/5\n`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kwadaso-analytics-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const t = translations[language];
  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t.title}</h1>
            <p className="text-gray-600">{t.subtitle}</p>
          </div>
          <div className="flex gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30days">{t.last30Days}</SelectItem>
                <SelectItem value="thismonth">{t.thisMonth}</SelectItem>
                <SelectItem value="alltime">{t.allTime}</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={loadAnalyticsData}>
              <RefreshCw className="w-4 h-4 mr-2" />
              {t.refresh}
            </Button>
            <Button onClick={exportReport}>
              <Download className="w-4 h-4 mr-2" />
              {t.exportReport}
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{t.totalUsers}</CardTitle>
              <Users className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">Registered users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{t.activeCollectors}</CardTitle>
              <Truck className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeCollectors}</div>
              <p className="text-xs text-muted-foreground">Currently active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{t.totalRequests}</CardTitle>
              <Calendar className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRequests}</div>
              <p className="text-xs text-muted-foreground">{stats.completionRate}% completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{t.monthlyRevenue}</CardTitle>
              <DollarSign className="h-5 w-5 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">GH₵ {stats.monthlyRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Request Trends */}
          <Card>
            <CardHeader>
              <CardTitle>{t.requestTrends}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData.requestTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="requests" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* User Growth */}
          <Card>
            <CardHeader>
              <CardTitle>{t.userGrowth}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData.userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Waste Type Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>{t.wasteTypeDistribution}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData.wasteTypes}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.wasteTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Payment Status */}
          <Card>
            <CardHeader>
              <CardTitle>{t.paymentStatus}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData.paymentStatus}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>{t.recentActivity}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-medium">{activity.description}</p>
                        <p className="text-sm text-gray-500">by {activity.user}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={activity.status === 'completed' ? 'default' : 'secondary'}>
                        {activity.status}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {format(new Date(activity.time), 'MMM d, HH:mm')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>{t.alerts}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                    <p className="text-gray-500">All systems running smoothly!</p>
                  </div>
                ) : (
                  alerts.map((alert, index) => (
                    <div key={index} className={`p-3 rounded-lg border ${
                      alert.type === 'error' ? 'bg-red-50 border-red-200' : 
                      alert.type === 'info' ? 'bg-blue-50 border-blue-200' : // Added style for 'info' type
                      'bg-yellow-50 border-yellow-200' // Default for 'warning'
                    }`}>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className={`h-4 w-4 ${
                          alert.type === 'error' ? 'text-red-600' : 
                          alert.type === 'info' ? 'text-blue-600' : // Added color for 'info' icon
                          'text-yellow-600' // Default for 'warning' icon
                        }`} />
                        <p className="text-sm">{alert.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
