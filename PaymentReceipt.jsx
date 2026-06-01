
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle, Download, Printer, Calendar, CreditCard, 
  MapPin, Truck, Hash, User
} from "lucide-react";
import { format } from "date-fns";

const translations = {
  en: {
    receiptTitle: "Payment Receipt",
    paymentSuccessful: "Payment Successful",
    transactionDetails: "Transaction Details",
    serviceDetails: "Service Details",
    customerInfo: "Customer Information",
    transactionId: "Transaction ID",
    paymentDate: "Payment Date",
    paymentProvider: "Paid Via",
    paymentChannel: "Channel",
    amount: "Amount Paid",
    status: "Status",
    phoneNumber: "Phone Number",
    pickupDate: "Pickup Date",
    wasteType: "Waste Type",
    pickupAddress: "Pickup Address",
    customerName: "Customer Name",
    customerEmail: "Email",
    subtotal: "Subtotal",
    taxes: "Service Fee",
    total: "Total Amount",
    printReceipt: "Print Receipt",
    downloadPdf: "Download PDF",
    thankYou: "Thank you for using Kwadaso Waste Collection!",
    contactInfo: "For support, call: +233 24 123 4567",
    mtnMomo: "MTN Mobile Money",
    airteltigoMoney: "AirtelTigo Money",
    vodafoneCash: "Vodafone Cash",
    cash: "Cash Payment"
  },
  tw: {
    receiptTitle: "Sika Tua Kwinhoma",
    paymentSuccessful: "Sika Tua Ayɛ Yiye",
    transactionDetails: "Dwumadie Ho Nsɛm",
    serviceDetails: "Ɔsom Ho Nsɛm",
    customerInfo: "Adetɔfo Ho Nsɛm",
    transactionId: "Dwumadie Nɔma",
    paymentDate: "Sika Tua Da",
    paymentProvider: "Wɔnam so tuaa",
    paymentChannel: "Kwan a Wɔfaa so",
    amount: "Sika a Wɔatua",
    status: "Tebea",
    phoneNumber: "Telefon Nɔma",
    pickupDate: "Gya Da",
    wasteType: "Nwura Sɛso",
    pickupAddress: "Gya Beaeɛ",
    customerName: "Adetɔfo Din",
    customerEmail: "Email",
    subtotal: "Sika Nyinaa",
    taxes: "Ɔsom Ka",
    total: "Sika Dodow Nyinaa",
    printReceipt: "Tintim Kwinhoma",
    downloadPdf: "Yi PDF",
    thankYou: "Yɛda wo ase sɛ wode Kwadaso Nwura Boaboa!",
    contactInfo: "Mmoa ho, frɛ: +233 24 123 4567",
    mtnMomo: "MTN Mobile Money",
    airteltigoMoney: "AirtelTigo Money",
    vodafoneCash: "Vodafone Cash",
    cash: "Sika a Wɔde Kasa"
  }
};

export default function PaymentReceipt({ 
  payment, 
  pickup, 
  customer, 
  language = 'en', 
  onClose,
  onPrint,
  onDownload 
}) {
  const t = translations[language];

  const getChannelName = (channel) => {
    const channels = {
      mtn_momo: t.mtnMomo,
      airteltigo_money: t.airteltigoMoney,
      vodafone_cash: t.vodafoneCash,
      cash: t.cash
    };
    return channels[channel] || channel;
  };

  const formatAmount = (amount) => {
    return `GH₵ ${parseFloat(amount).toFixed(2)}`;
  };

  const handlePrint = () => {
    window.print();
    if (onPrint) onPrint();
  };

  const handleDownload = () => {
    // In a real app, this would generate and download a PDF
    const receiptData = {
      payment,
      pickup,
      customer,
      generatedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(receiptData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `receipt_${payment.transaction_id}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    if (onDownload) onDownload();
  };

  if (!payment || !pickup || !customer) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">Unable to load receipt data</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white">
      {/* Print Styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .receipt-content, .receipt-content * { visibility: visible; }
          .receipt-content { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="receipt-content">
        {/* Header */}
        <div className="text-center border-b-2 border-green-600 pb-6 mb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
              <Truck className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Kwadaso</h1>
              <p className="text-sm text-green-600 font-medium">Waste Collection Service</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-2 mb-2">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <h2 className="text-xl font-semibold text-green-600">{t.paymentSuccessful}</h2>
          </div>
          
          <Badge className="bg-green-100 text-green-800 text-sm px-3 py-1">
            Receipt #{payment.transaction_id}
          </Badge>
        </div>

        {/* Transaction Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Hash className="w-5 h-5" />
              {t.transactionDetails}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{t.transactionId}:</span>
                  <span className="font-mono text-sm">{payment.transaction_id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{t.paymentDate}:</span>
                  <span>{format(new Date(payment.payment_date), 'PPp')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{t.status}:</span>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {t.paymentSuccessful}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-3">
                 <div className="flex justify-between items-center">
                  <span className="text-gray-600">{t.paymentProvider}:</span>
                  <span className="capitalize">{payment.provider}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{t.paymentChannel}:</span>
                  <span>{getChannelName(payment.channel)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-semibold">{t.amount}:</span>
                  <span className="font-bold text-lg text-green-600">
                    {formatAmount(payment.amount)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Service Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Truck className="w-5 h-5" />
              {t.serviceDetails}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">{t.pickupDate}:</span>
              <span>{format(new Date(pickup.scheduled_date), 'PPP')}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">{t.wasteType}:</span>
              <Badge variant="outline" className="capitalize">
                {pickup.waste_type?.replace('_', ' ')}
              </Badge>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-gray-600">{t.pickupAddress}:</span>
              <span className="text-right max-w-xs">{pickup.pickup_address}</span>
            </div>
            {pickup.estimated_weight && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Estimated Weight:</span>
                <span>{pickup.estimated_weight} kg</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Customer Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="w-5 h-5" />
              {t.customerInfo}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">{t.customerName}:</span>
              <span>{customer.full_name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">{t.customerEmail}:</span>
              <span>{customer.email}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-gray-600">Address:</span>
              <span className="text-right max-w-xs">{customer.address}</span>
            </div>
          </CardContent>
        </Card>

        {/* Amount Breakdown */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">{t.subtotal}:</span>
                <span>{formatAmount(payment.amount * 0.95)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">{t.taxes}:</span>
                <span>{formatAmount(payment.amount * 0.05)}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center font-bold text-lg">
                <span>{t.total}:</span>
                <span className="text-green-600">{formatAmount(payment.amount)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center space-y-4 border-t pt-6 text-gray-600">
          <p className="font-medium">{t.thankYou}</p>
          <p className="text-sm">{t.contactInfo}</p>
          <p className="text-xs">
            Generated on {format(new Date(), 'PPpp')}
          </p>
        </div>

        {/* Action Buttons - Hidden in Print */}
        <div className="no-print flex gap-3 justify-center mt-8 pt-6 border-t">
          <Button onClick={handlePrint} variant="outline">
            <Printer className="w-4 h-4 mr-2" />
            {t.printReceipt}
          </Button>
          <Button onClick={handleDownload} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            {t.downloadPdf}
          </Button>
          {onClose && (
            <Button onClick={onClose} variant="secondary">
              Close
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
