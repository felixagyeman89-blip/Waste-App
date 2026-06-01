
import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { WastePickup } from "@/entities/WastePickup";
import { Payment } from "@/entities/Payment";
import { SendEmail } from "@/integrations/Core"; // Added SendEmail import
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Added Textarea import
import { Label } from "@/components/ui/label"; // Added Label import
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, Search, Filter, Eye, Edit, Trash2, UserCheck, UserX,
  Calendar, DollarSign, MapPin, Phone, Mail, Building2, SquarePen, // Added SquarePen icon
  MoreVertical, CheckCircle, AlertCircle, Clock, Send, XCircle, Loader2 // Added Send, XCircle, and Loader2 icons
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import { format } from "date-fns";

const translations = {
  en: {
    title: "User Management",
    subtitle: "Manage all users and their requests",
    searchUsers: "Search users...",
    allUsers: "All Users",
    households: "Households",
    businesses: "Businesses", 
    marketWomen: "Market Women",
    collectors: "Collectors",
    administrators: "Administrators",
    activeUsers: "Active Users",
    totalRequests: "Total Requests",
    totalRevenue: "Total Revenue",
    userDetails: "User Details",
    userRequests: "User Requests",
    requestHistory: "Request History",
    paymentHistory: "Payment History",
    contact: "Contact Info",
    address: "Address",
    joinDate: "Join Date",
    lastActive: "Last Active",
    status: "Status",
    actions: "Actions",
    viewDetails: "View Details",
    editUser: "Edit User",
    deactivateUser: "Deactivate User",
    activateUser: "Activate User",
    deleteUser: "Delete User",
    noUsers: "No users found",
    noRequests: "No requests found",
    requestDate: "Request Date",
    wasteType: "Waste Type",
    amount: "Amount",
    paymentStatus: "Payment Status",
    pending: "Pending",
    completed: "Completed",
    failed: "Failed",
    scheduled: "Scheduled",
    inProgress: "In Progress",
    cancelled: "Cancelled",
    verified: "Verified",
    unverified: "Unverified",
    cancelPickup: "Cancel Pickup",
    reschedulePickup: "Reschedule Pickup",
    sendEmail: "Send Email",
    emailSubject: "Email Subject",
    emailMessage: "Email Message",
    cancel: "Cancel",
    send: "Send",
    emailSent: "Email sent successfully!",
    pickupCancelled: "Pickup cancelled successfully!",
    pickupRescheduled: "Pickup rescheduled successfully!",
    selectNewDate: "Select New Date",
    newPickupDate: "New Pickup Date",
    cancellationReason: "Cancellation Reason",
    reschedulingReason: "Rescheduling Reason",
    defaultCancelSubject: "Your Waste Pickup has been Cancelled",
    defaultCancelMessage: `Dear {customerName},

We regret to inform you that your waste pickup scheduled for {pickupDate} has been cancelled.

Reason: {reason}

Please feel free to schedule a new pickup at your convenience through the Kwadaso app.

We apologize for any inconvenience caused.

Best regards,
Kwadaso Waste Collection Team`,
    defaultRescheduleSubject: "Your Waste Pickup has been Rescheduled",
    defaultRescheduleMessage: `Dear {customerName},

Your waste pickup originally scheduled for {originalDate} has been rescheduled to {newDate}.

Reason: {reason}

Please make sure to have your waste ready for collection on the new date.

Thank you for your understanding.

Best regards,
Kwadaso Waste Collection Team`,
    managepickups: "Manage Pickups"
  },
  tw: {
    title: "Nnipa Sohwɛ", 
    subtitle: "Hwɛ nnipa nyinaa ne wɔn abisade so",
    searchUsers: "Hwehwɛ nnipa...",
    allUsers: "Nnipa Nyinaa",
    households: "Afie Nkurɔfo",
    businesses: "Adwumawuranom",
    marketWomen: "Guaso Mmea",
    collectors: "Boaboafo",
    administrators: "Ɔhwɛfo Nkurɔfo",
    activeUsers: "Nnipa a Wɔyɛ Adwuma",
    totalRequests: "Abisade Nyinaa",
    totalRevenue: "Sika Nyinaa",
    userDetails: "Ɔbarima/Ɔbea Ho Nsɛm",
    userRequests: "Ne Abisade",
    requestHistory: "Abisade Abakɔsɛm",
    paymentHistory: "Sika Tua Abakɔsɛm",
    contact: "Nkitaho",
    address: "Baabi a Ɔte",
    joinDate: "Da a Ɔbaa",
    lastActive: "Da a Ɔyɛɛ Adwuma Akyiri",
    status: "Tebea",
    actions: "Nneɛma",
    viewDetails: "Hwɛ Nsɛm",
    editUser: "Sesa",
    deactivateUser: "Gyae",
    activateUser: "Ma Ɔnyɛ Adwuma",
    deleteUser: "Yi Fi",
    noUsers: "Nnipa biara nni hɔ",
    noRequests: "Abisade biara nni hɔ",
    requestDate: "Abisade Da",
    wasteType: "Nwura Sɛso",
    amount: "Sika Dodoɔ",
    paymentStatus: "Sika Tua Tebea",
    pending: "Ɛda Hɔ",
    completed: "Awie",
    failed: "Asɛe",
    scheduled: "Wɔahyehyɛ",
    inProgress: "Ɛrekɔ So",
    cancelled: "Wɔatwa",
    verified: "Wɔahyɛ Mu Den",
    unverified: "Wɔnhyɛɛ Mu Den",
    cancelPickup: "Twa Gya",
    reschedulePickup: "Sesa Gya Da",
    sendEmail: "Soma Email",
    emailSubject: "Email Asɛmti",
    emailMessage: "Email Nkrasɛm",
    cancel: "Twa",
    send: "Soma",
    emailSent: "Email akɔ yiye!",
    pickupCancelled: "Wɔatwa gya no yiye!",
    pickupRescheduled: "Wɔasesa gya da no yiye!",
    selectNewDate: "Yi da foforɔ",
    newPickupDate: "Gya Da Foforɔ",
    cancellationReason: "Nti a Wɔtwa",
    reschedulingReason: "Nti a Wɔsesa Da",
    defaultCancelSubject: "Wo Nwura Gya Wɔatwa",
    defaultCancelMessage: `Wo din ne {customerName},

Yɛde awerɛhow ka kyerɛ wo sɛ wo nwura gya a na ɛwɔ {pickupDate} no, wɔatwa.

Nti: {reason}

Yɛsrɛ wo hyehyɛ gya foforɔ wɔ Kwadaso app no so.

Yɛpa wo kyɛw.

Nkyia,
Kwadaso Nwura Boaboa Kuw`,
    defaultRescheduleSubject: "Wɔasesa Wo Nwura Gya Da",
    defaultRescheduleMessage: `Wo din ne {customerName},

Wo nwura gya a na ɛwɔ {originalDate} no, wɔasesa akɔ {newDate}.

Nti: {reason}

Yɛsrɛ wo siesie wo nwura ma da foforɔ no.

Yɛda wo ase.

Nkyia,
Kwadaso Nwura Boaboa Kuw`,
    managepickups: "Hwɛ Gya Ho"
  }
};

export default function UserManagementPage() {
  const [user, setUser] = useState(null);
  const [language, setLanguage] = useState('en');
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userRequests, setUserRequests] = useState([]);
  const [userPayments, setUserPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [selectedPickup, setSelectedPickup] = useState(null);
  const [emailType, setEmailType] = useState('cancel'); // 'cancel' or 'reschedule'
  const [emailData, setEmailData] = useState({
    subject: '',
    message: '',
    reason: '',
    newDate: ''
  });
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  useEffect(() => {
    checkAdminAccess();
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchTerm, activeFilter, users]);

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

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const allUsers = await User.list();
      setUsers(allUsers);
      setFilteredUsers(allUsers);
    } catch (error) {
      console.error("Error loading users:", error);
    }
    setIsLoading(false);
  };

  const filterUsers = () => {
    let filtered = users;

    if (activeFilter !== 'all') {
      filtered = filtered.filter(u => u.user_type === activeFilter);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(u => 
        u.full_name?.toLowerCase().includes(term) ||
        u.email?.toLowerCase().includes(term) ||
        u.phone_number?.includes(term) ||
        u.address?.toLowerCase().includes(term)
      );
    }

    setFilteredUsers(filtered);
  };

  const loadUserDetails = async (selectedUserId) => {
    try {
      const [requests, payments] = await Promise.all([
        WastePickup.filter({ customer_id: selectedUserId }, '-created_date'),
        Payment.filter({ customer_id: selectedUserId }, '-payment_date')
      ]);
      
      setUserRequests(requests);
      setUserPayments(payments);
    } catch (error) {
      console.error("Error loading user details:", error);
    }
  };

  const handleUserClick = async (clickedUser) => {
    setSelectedUser(clickedUser);
    setIsModalOpen(true);
    await loadUserDetails(clickedUser.id);
  };

  const getUserTypeStats = () => {
    const stats = users.reduce((acc, user) => {
      acc[user.user_type] = (acc[user.user_type] || 0) + 1;
      return acc;
    }, {});
    
    return {
      total: users.length,
      household: stats.household || 0,
      business: stats.business || 0,
      market_woman: stats.market_woman || 0,
      waste_collector: stats.waste_collector || 0,
      administrator: stats.administrator || 0
    };
  };

  const getStatusBadge = (status) => {
    const t = translations[language]; // Ensure t is available here
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />{t.completed}</Badge>;
      case 'pending':
        return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />{t.pending}</Badge>;
      case 'failed':
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />{t.failed}</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800">{t.inProgress}</Badge>;
      case 'scheduled':
        return <Badge className="bg-orange-100 text-orange-800">{t.scheduled}</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />{t.cancelled}</Badge>;
      case 'rescheduled':
        return <Badge className="bg-purple-100 text-purple-800"><Calendar className="w-3 h-3 mr-1" />{t.pickupRescheduled}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleCancelPickup = (pickup, customer) => {
    setSelectedPickup({ ...pickup, customer });
    setEmailType('cancel');
    setEmailData({
      subject: translations[language].defaultCancelSubject,
      message: translations[language].defaultCancelMessage,
      reason: '',
      newDate: ''
    });
    setEmailModalOpen(true);
  };

  const handleReschedulePickup = (pickup, customer) => {
    setSelectedPickup({ ...pickup, customer });
    setEmailType('reschedule');
    setEmailData({
      subject: translations[language].defaultRescheduleSubject,
      message: translations[language].defaultRescheduleMessage,
      reason: '',
      newDate: ''
    });
    setEmailModalOpen(true);
  };

  const handleSendEmail = async () => {
    if (!selectedPickup || !emailData.reason || (emailType === 'reschedule' && !emailData.newDate)) {
      alert("Please fill in all required fields.");
      return;
    }
    
    setIsSendingEmail(true);
    
    try {
      // Replace placeholders in email message
      let processedMessage = emailData.message
        .replace(/{customerName}/g, selectedPickup.customer.full_name || '')
        .replace(/{pickupDate}/g, selectedPickup.scheduled_date ? format(new Date(selectedPickup.scheduled_date), 'PPP') : '')
        .replace(/{originalDate}/g, selectedPickup.scheduled_date ? format(new Date(selectedPickup.scheduled_date), 'PPP') : '')
        .replace(/{newDate}/g, emailData.newDate ? format(new Date(emailData.newDate), 'PPP') : '')
        .replace(/{reason}/g, emailData.reason);

      // Send email to customer
      await SendEmail({
        to: selectedPickup.customer.email,
        from_name: "Kwadaso Waste Collection",
        subject: emailData.subject,
        body: processedMessage
      });

      // Update pickup status
      if (emailType === 'cancel') {
        await WastePickup.update(selectedPickup.id, {
          status: 'cancelled',
          completion_notes: `Cancelled by admin. Reason: ${emailData.reason}`
        });
        alert(translations[language].pickupCancelled);
      } else if (emailType === 'reschedule' && emailData.newDate) {
        await WastePickup.update(selectedPickup.id, {
          scheduled_date: emailData.newDate,
          status: 'rescheduled',
          completion_notes: `Rescheduled by admin from ${format(new Date(selectedPickup.scheduled_date), 'PPP')} to ${format(new Date(emailData.newDate), 'PPP')}. Reason: ${emailData.reason}`
        });
        alert(translations[language].pickupRescheduled);
      }
      
      // Refresh data in the modal
      if (selectedUser) {
        await loadUserDetails(selectedUser.id);
      }
      
      alert(translations[language].emailSent);
      
      setEmailModalOpen(false);
      setSelectedPickup(null);
      setEmailData({subject: '', message: '', reason: '', newDate: ''}); // Clear form
      
    } catch (error) {
      console.error("Failed to send email or update pickup:", error);
      alert("Failed to perform action and send email. Please try again.");
    }
    
    setIsSendingEmail(false);
  };


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const t = translations[language];
  const stats = getUserTypeStats();

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.title}</h1>
          <p className="text-gray-600">{t.subtitle}</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <p className="text-sm text-gray-600">{t.allUsers}</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-green-600">{stats.household}</div>
              <p className="text-sm text-gray-600">{t.households}</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-purple-600">{stats.business}</div>
              <p className="text-sm text-gray-600">{t.businesses}</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-pink-600">{stats.market_woman}</div>
              <p className="text-sm text-gray-600">{t.marketWomen}</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-orange-600">{stats.waste_collector}</div>
              <p className="text-sm text-gray-600">{t.collectors}</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-red-600">{stats.administrator}</div>
              <p className="text-sm text-gray-600">{t.administrators}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={t.searchUsers}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={activeFilter} onValueChange={setActiveFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.allUsers}</SelectItem>
                  <SelectItem value="household">{t.households}</SelectItem>
                  <SelectItem value="business">{t.businesses}</SelectItem>
                  <SelectItem value="market_woman">{t.marketWomen}</SelectItem>
                  <SelectItem value="waste_collector">{t.collectors}</SelectItem>
                  <SelectItem value="administrator">{t.administrators}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {activeFilter === 'all' ? t.allUsers : t[activeFilter] || activeFilter}
              <Badge variant="secondary">{filteredUsers.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">{t.noUsers}</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>{t.actions}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((currentUser) => (
                    <TableRow key={currentUser.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{currentUser.full_name}</p>
                          <p className="text-sm text-gray-500">{currentUser.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {currentUser.user_type?.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {currentUser.phone_number}
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" />
                            {currentUser.address?.substring(0, 20)}...
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={currentUser.is_verified ? 
                          "bg-green-100 text-green-800" : 
                          "bg-red-100 text-red-800"
                        }>
                          {currentUser.is_verified ? t.verified : t.unverified}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(currentUser.created_date), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleUserClick(currentUser)}>
                              <Eye className="h-4 w-4 mr-2" />
                              {t.viewDetails}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              {t.editUser}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              {currentUser.is_verified ? (
                                <>
                                  <UserX className="h-4 w-4 mr-2" />
                                  {t.deactivateUser}
                                </>
                              ) : (
                                <>
                                  <UserCheck className="h-4 w-4 mr-2" />
                                  {t.activateUser}
                                </>
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* User Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-4xl">
          {selectedUser && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {selectedUser.full_name}
                </DialogTitle>
                <DialogDescription>
                  {selectedUser.user_type?.replace('_', ' ')} • Member since {format(new Date(selectedUser.created_date), 'MMMM yyyy')}
                </DialogDescription>
              </DialogHeader>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">{t.userDetails}</TabsTrigger>
                  <TabsTrigger value="requests">{t.requestHistory}</TabsTrigger>
                  <TabsTrigger value="payments">{t.paymentHistory}</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="mt-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span>{selectedUser.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span>{selectedUser.phone_number}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span>{selectedUser.address}</span>
                      </div>
                      {selectedUser.business_name && (
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-gray-500" />
                          <span>{selectedUser.business_name}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-4">
                      <div>
                        <span className="text-sm text-gray-500">Status: </span>
                        <Badge className={selectedUser.is_verified ? 
                          "bg-green-100 text-green-800" : 
                          "bg-red-100 text-red-800"
                        }>
                          {selectedUser.is_verified ? t.verified : t.unverified}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Subscription: </span>
                        <Badge variant="outline">{selectedUser.subscription_type}</Badge>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Language: </span>
                        <span>{selectedUser.preferred_language === 'tw' ? 'Twi' : 'English'}</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="requests" className="mt-4">
                  {userRequests.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">{t.noRequests}</p>
                  ) : (
                    <div className="space-y-4 max-h-80 overflow-y-auto">
                      {userRequests.map(request => (
                        <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <p className="font-medium">{request.waste_type?.replace('_', ' ')}</p>
                            <p className="text-sm text-gray-500">
                              {format(new Date(request.scheduled_date), 'MMM d, yyyy')} • GH₵ {request.amount}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(request.status)}
                            {getStatusBadge(request.payment_status)}
                            
                            {/* Admin Actions for Active Pickups */}
                            {(request.status === 'scheduled' || request.status === 'in_progress') && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuItem onClick={() => handleCancelPickup(request, selectedUser)}>
                                    <XCircle className="h-4 w-4 mr-2 text-red-500" />
                                    {t.cancelPickup}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleReschedulePickup(request, selectedUser)}>
                                    <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                                    {t.reschedulePickup}
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="payments" className="mt-4">
                  {userPayments.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No payments found</p>
                  ) : (
                    <div className="space-y-4 max-h-80 overflow-y-auto">
                      {userPayments.map(payment => (
                        <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <p className="font-medium">GH₵ {payment.amount}</p>
                            <p className="text-sm text-gray-500">
                              {format(new Date(payment.payment_date), 'MMM d, yyyy HH:mm')}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(payment.status)}
                            <Badge variant="outline">{payment.payment_method?.replace('_', ' ')}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Email Modal for Pickup Actions */}
      <Dialog open={emailModalOpen} onOpenChange={setEmailModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              {emailType === 'cancel' ? t.cancelPickup : t.reschedulePickup}
            </DialogTitle>
            <DialogDescription>
              {t.sendEmail} to {selectedPickup?.customer?.full_name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Reason Input */}
            <div className="space-y-2">
              <Label htmlFor="reason">
                {emailType === 'cancel' ? t.cancellationReason : t.reschedulingReason} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="reason"
                value={emailData.reason}
                onChange={(e) => setEmailData({...emailData, reason: e.target.value})}
                placeholder="Enter reason..."
                required
              />
            </div>

            {/* New Date Input (for rescheduling only) */}
            {emailType === 'reschedule' && (
              <div className="space-y-2">
                <Label htmlFor="newDate">{t.newPickupDate} <span className="text-red-500">*</span></Label>
                <Input
                  id="newDate"
                  type="date"
                  value={emailData.newDate}
                  onChange={(e) => setEmailData({...emailData, newDate: e.target.value})}
                  min={new Date().toISOString().split('T')[0]} // Set min date to today
                  required
                />
              </div>
            )}

            {/* Email Subject */}
            <div className="space-y-2">
              <Label htmlFor="subject">{t.emailSubject}</Label>
              <Input
                id="subject"
                value={emailData.subject}
                onChange={(e) => setEmailData({...emailData, subject: e.target.value})}
              />
            </div>

            {/* Email Message */}
            <div className="space-y-2">
              <Label htmlFor="message">{t.emailMessage}</Label>
              <Textarea
                id="message"
                value={emailData.message}
                onChange={(e) => setEmailData({...emailData, message: e.target.value})}
                rows={8}
                className="resize-none"
              />
              <p className="text-xs text-gray-500">
                Available placeholders: {'{customerName}, {pickupDate}, {reason}'}
                {emailType === 'reschedule' && ', {originalDate}, {newDate}'}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEmailModalOpen(false)}>
              {t.cancel}
            </Button>
            <Button 
              onClick={handleSendEmail}
              disabled={isSendingEmail || !emailData.reason || (emailType === 'reschedule' && !emailData.newDate)}
            >
              {isSendingEmail ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  {t.send}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
