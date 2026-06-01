
import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Payment } from "@/entities/Payment";
import { WastePickup } from "@/entities/WastePickup";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  CreditCard, DollarSign, History, CheckCircle, XCircle, AlertTriangle,
  Loader2, ArrowLeft, Phone, Info, FileText, Smartphone
} from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import PaymentReceipt from "@/components/payments/PaymentReceipt";

const translations = {
  en: {
    payments: "Payments",
    managePayments: "Manage your payments and view history",
    backToDashboard: "Back to Dashboard",
    totalPaid: "Total Paid",
    amountPending: "Amount Pending",
    paymentHistory: "Payment History",
    pendingPayments: "Pending Payments",
    noHistory: "No payment history found.",
    noPending: "No pending payments. All clear!",
    payNow: "Pay Now",
    payAll: "Pay All Pending",
    receipt: "View Receipt",
    date: "Date",
    amount: "Amount",
    status: "Status",
    pickup: "For Pickup on",
    completed: "Completed",
    pending: "Pending",
    failed: "Failed",
    processing: "Processing",
    paymentModalTitle: "Pay with Paystack",
    paymentModalDesc: "Select your mobile money provider and enter your phone number.",
    momoProvider: "Mobile Money Provider",
    mtnMomo: "MTN Mobile Money",
    vodafoneCash: "Vodafone Cash",
    airteltigoMoney: "AirtelTigo Money",
    phoneNumber: "Phone Number",
    confirmPayment: "Confirm Payment",
    processingPayment: "Processing with Paystack...",
    paymentSuccessful: "Payment Successful!",
    paymentFailed: "Payment Failed",
    tryAgain: "Please try again or contact support."
  },
  tw: {
    payments: "Sika Tua",
    managePayments: "Hwɛ wo sika tua so na hwɛ abakɔsɛm",
    backToDashboard: "San Kɔ Dashboard",
    totalPaid: "Sika a Wɔatua Nyinaa",
    amountPending: "Sika a Ɛda Hɔ",
    paymentHistory: "Sika Tua Abakɔsɛm",
    pendingPayments: "Sika a Ɛda Hɔ a Wɔbɛtua",
    noHistory: "Sika tua abakɔsɛm biara nni hɔ.",
    noPending: "Sika a ɛda hɔ biara nni hɔ. Biribiara yɛ kama!",
    payNow: "Tua Sika Seesei",
    payAll: "Tua Nea Aka Nyinaa",
    receipt: "Hwɛ Kwinhoma",
    date: "Da",
    amount: "Sika Dodoɔ",
    status: "Tebea",
    pickup: "Gya Da",
    completed: "Awie",
    pending: "Ɛda Hɔ",
    failed: "Asɛe",
    processing: "Ɛreyɛ adwuma",
    paymentModalTitle: "Tua Sika Fri Paystack So",
    paymentModalDesc: "Yi wo mobile money provider na hyɛ wo telefon nɔma mu.",
    momoProvider: "Mobile Money Provider",
    mtnMomo: "MTN Mobile Money",
    vodafoneCash: "Vodafone Cash",
    airteltigoMoney: "AirtelTigo Money",
    phoneNumber: "Telefon Nɔma",
    confirmPayment: "Hyɛ Sika Tua Mu Den",
    processingPayment: "Ɛreyɛ adwuma wɔ Paystack so...",
    paymentSuccessful: "Sika tua ayɛ yiye!",
    paymentFailed: "Sika tua asɛe",
    tryAgain: "Yɛsrɛ wo bɔ mmɔden bio anaa frɛ mmoa."
  }
};

export default function PaymentsPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [language, setLanguage] = useState('en');
  const [payments, setPayments] = useState([]);
  const [pendingPickups, setPendingPickups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPickup, setSelectedPickup] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [channel, setChannel] = useState('');
  const [showReceipt, setShowReceipt] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [selectedPaymentPickup, setSelectedPaymentPickup] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const userData = await User.me();
      setUser(userData);
      setLanguage(userData.preferred_language || 'en');
      setPhoneNumber(userData.phone_number || '');

      const [userPayments, userPickups] = await Promise.all([
        Payment.filter({ customer_id: userData.id }, '-payment_date'),
        WastePickup.filter({ customer_id: userData.id, payment_status: 'pending' }, '-scheduled_date')
      ]);

      setPayments(userPayments);
      setPendingPickups(userPickups);
    } catch (error) {
      console.error("Error loading payment data:", error);
    }
    setIsLoading(false);
  };

  const handlePayNow = (pickup) => {
    setSelectedPickup(pickup);
    setChannel(''); // Reset channel selection
    setIsModalOpen(true);
  };

  const handleConfirmPayment = async () => {
    if (!selectedPickup || !channel) return;
    setIsProcessing(true);

    // Simulate Paystack API call
    await new Promise(resolve => setTimeout(resolve, 3000));

    try {
      // Simulate success
      const newPayment = await Payment.create({
        pickup_id: selectedPickup.id,
        customer_id: user.id,
        amount: selectedPickup.amount,
        provider: 'paystack',
        channel: channel,
        phone_number: phoneNumber,
        transaction_id: `PS_TXN_${Date.now()}`,
        status: 'completed',
        payment_date: new Date().toISOString()
      });

      await WastePickup.update(selectedPickup.id, { payment_status: 'paid' });

      setIsProcessing(false);
      setIsModalOpen(false);
      setSelectedPickup(null);
      await loadData(); // Refresh data

    } catch (error) {
      console.error("Failed to process payment:", error);
      setIsProcessing(false);
      // In a real app, handle failure state in the modal
    }
  };

  const handleViewReceipt = async (payment) => {
    try {
      // Find the associated pickup for this payment
      const pickupResult = await WastePickup.filter({ id: payment.pickup_id });
      if (pickupResult.length > 0) {
        setSelectedPayment(payment);
        setSelectedPaymentPickup(pickupResult[0]);
        setShowReceipt(true);
      } else {
        console.warn(`No pickup found for payment ID: ${payment.pickup_id}`);
        // Optionally show an error to the user
      }
    } catch (error) {
      console.error("Error loading pickup details for receipt:", error);
      // Optionally show an error to the user
    }
  };

  const stats = {
    totalPaid: payments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0),
    amountPending: pendingPickups.reduce((sum, p) => sum + p.amount, 0)
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />{t.completed}</Badge>;
      case 'pending':
        return <Badge variant="outline"><Loader2 className="w-3 h-3 mr-1 animate-spin" />{t.pending}</Badge>;
      case 'failed':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />{t.failed}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const t = translations[language];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 text-green-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t.payments}</h1>
            <p className="text-gray-600">{t.managePayments}</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{t.totalPaid}</CardTitle>
              <DollarSign className="w-4 h-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">GH₵ {stats.totalPaid.toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{t.amountPending}</CardTitle>
              <AlertTriangle className="w-4 h-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">GH₵ {stats.amountPending.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Payments */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{t.pendingPayments}</CardTitle>
          </CardHeader>
          <CardContent>
            {pendingPickups.length === 0 ? (
              <p className="text-gray-500 text-center py-4">{t.noPending}</p>
            ) : (
              <div className="space-y-4">
                {pendingPickups.map(pickup => (
                  <div key={pickup.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <div>
                      <p className="font-semibold">{t.pickup} {format(new Date(pickup.scheduled_date), 'MMM d, yyyy')}</p>
                      <p className="text-sm text-gray-600">{pickup.waste_type?.replace('_', ' ')} - GH₵ {pickup.amount.toFixed(2)}</p>
                    </div>
                    <Button onClick={() => handlePayNow(pickup)} className="mt-2 md:mt-0">
                      <CreditCard className="w-4 h-4 mr-2" />
                      {t.payNow}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          {pendingPickups.length > 1 && (
            <CardFooter>
              <Button variant="outline" className="w-full">{t.payAll}</Button>
            </CardFooter>
          )}
        </Card>

        {/* Payment History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              {t.paymentHistory}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {payments.length === 0 ? (
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">{t.noHistory}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {payments.map(payment => (
                  <div key={payment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {payment.status === 'completed'
                        ? <CheckCircle className="w-5 h-5 text-green-500" />
                        : <XCircle className="w-5 h-5 text-red-500" />
                      }
                      <div>
                        <p className="font-medium">GH₵ {payment.amount.toFixed(2)}</p>
                        <p className="text-sm text-gray-500">
                          {format(new Date(payment.payment_date), 'PPp')} • {payment.provider} ({payment.channel?.replace('_', ' ')})
                        </p>
                        <p className="text-xs text-gray-400">
                          Transaction: {payment.transaction_id}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(payment.status)}
                      {payment.status === 'completed' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewReceipt(payment)}
                        >
                          {t.receipt}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Payment Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.paymentModalTitle}</DialogTitle>
            <DialogDescription>{t.paymentModalDesc}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center bg-gray-100 p-4 rounded-lg">
              <Info className="w-8 h-8 text-gray-500 mr-4" />
              <div>
                <p className="font-semibold">{t.amount}: GH₵ {selectedPickup?.amount.toFixed(2)}</p>
                <p className="text-sm text-gray-600">{t.pickup} {selectedPickup && format(new Date(selectedPickup.scheduled_date), 'MMM d, yyyy')}</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="momo-provider">{t.momoProvider}</Label>
              <Select value={channel} onValueChange={setChannel}>
                <SelectTrigger id="momo-provider">
                  <SelectValue placeholder="Select a provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mtn_momo">{t.mtnMomo}</SelectItem>
                  <SelectItem value="vodafone_cash">{t.vodafoneCash}</SelectItem>
                  <SelectItem value="airteltigo_money">{t.airteltigoMoney}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone-number">{t.phoneNumber}</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="phone-number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+233 XX XXX XXXX"
                  className="pl-10"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleConfirmPayment}
              disabled={isProcessing || !phoneNumber || !channel}
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t.processingPayment}
                </>
              ) : t.confirmPayment}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Receipt Modal */}
      <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {t.receipt} - {selectedPayment?.transaction_id}
            </DialogTitle>
          </DialogHeader>

          {selectedPayment && selectedPaymentPickup && user && (
            <PaymentReceipt
              payment={selectedPayment}
              pickup={selectedPaymentPickup}
              customer={user}
              language={language}
              onClose={() => setShowReceipt(false)}
              onPrint={() => console.log('Print receipt')}
              onDownload={() => console.log('Download receipt')}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
