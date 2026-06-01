
import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { WastePickup } from "@/entities/WastePickup";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import {
  Calendar as CalendarIcon, Clock, MapPin, Trash2, AlertCircle,
  Recycle, Zap, Shield, Package, Plus, ArrowLeft
} from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { SendEmail } from "@/integrations/Core";
import { Notification } from "@/entities/Notification";
import { createPageUrl } from "@/utils";

const translations = {
  en: {
    schedulePickup: "Schedule Waste Pickup",
    backToDashboard: "Back to Dashboard",
    wasteType: "Waste Type",
    organic: "Organic Waste",
    recyclable: "Recyclable Materials",
    electronic: "Electronic Waste",
    hazardous: "Hazardous Materials",
    general: "General Waste",
    pickupDate: "Pickup Date",
    timeSlot: "Preferred Time",
    morning: "Morning (8AM - 12PM)",
    afternoon: "Afternoon (12PM - 4PM)",
    evening: "Evening (4PM - 8PM)",
    priority: "Priority Level",
    urgent: "Urgent",
    high: "High",
    medium: "Medium",
    low: "Low",
    estimatedWeight: "Estimated Weight (kg)",
    address: "Pickup Address",
    instructions: "Special Instructions",
    scheduleBtn: "Schedule Pickup",
    currentPickups: "Your Scheduled Pickups",
    noPickups: "No pickups scheduled",
    pricing: "Estimated Cost",
    basicRate: "Basic Rate: GH₵ 5.00",
    perKg: "Per kg: GH₵ 2.00",
    urgentFee: "Urgent Fee: +50%",
    emailSubject: "Your Kwadaso Waste Pickup is Scheduled!",
    emailBody: `
Hi {fullName},

This is a confirmation that your waste pickup has been successfully scheduled.

Here are the details:
- Waste Type: {wasteType}
- Scheduled Date: {scheduledDate}
- Time Slot: {timeSlot}
- Pickup Address: {pickupAddress}
- Estimated Cost: GH₵ {estimatedCost}

Our collector will arrive at the scheduled time. You can track the status of your pickup in the "Track Collection" section of the app.

Thank you for helping keep Kwadaso clean!

Best regards,
The Kwadaso Waste Collection Team
`,
    adminEmailSubject: "New Waste Pickup Scheduled: #{pickupId}",
    adminEmailBody: `
A new waste pickup request has been scheduled.

**Request Details:**
- **Customer Name:** {fullName}
- **Customer Email:** {email}
- **Waste Type:** {wasteType}
- **Scheduled Date:** {scheduledDate}
- **Time Slot:** {timeSlot}
- **Pickup Address:** {pickupAddress}
- **Priority:** {priority}
- **Estimated Cost:** GH₵ {estimatedCost}

Please assign a collector via the admin dashboard.
`,
    smsMessage: "Kwadaso Waste: Your {wasteType} pickup is scheduled for {scheduledDate} at {timeSlot}. Address: {pickupAddress}. Track at kwadaso.app"
  },
  tw: {
    schedulePickup: "Hyehyɛ Nwura Gya",
    backToDashboard: "San Kɔ Dashboard",
    wasteType: "Nwura Sɛso",
    organic: "Nwura a Ɛyɛ Amoa",
    recyclable: "Nneɛma a Yɛyɛ Bio",
    electronic: "Elektronik Nwura",
    hazardous: "Nwura Bɔne",
    general: "Nwura Ankasa",
    pickupDate: "Gya Da",
    timeSlot: "Bere a Wopɛ",
    morning: "Anɔpa (8AM - 12PM)",
    afternoon: "Owigyinaeɛ (12PM - 4PM)",
    evening: "Anwummerɛ (4PM - 8PM)",
    priority: "Ɛho Hia Dodoɔ",
    urgent: "Ɛho Hia",
    high: "Sorosoro",
    medium: "Mfinimfini",
    low: "Ahobrɛase",
    estimatedWeight: "Duru a Wosusuw (kg)",
    address: "Gya Beaeɛ",
    instructions: "Akwankyerɛ Foforɔ",
    scheduleBtn: "Hyehyɛ Gya",
    currentPickups: "Wo Gya a Wɔahyehyɛ",
    noPickups: "Gya biara nni hɔ",
    pricing: "Ka a Wosusuw",
    basicRate: "Ntease Ka: GH₵ 5.00",
    perKg: "Biara kg: GH₵ 2.00",
    urgentFee: "Ɛho Hia Ka: +50%",
    emailSubject: "Wo Kwadaso Nwura Gya Ahyɛhyɛdeɛ Ayɛ Yie!",
    emailBody: `
Hello {fullName},

Yɛde too dwa sɛ wo nwura gya ahyɛhyɛdeɛ no ayɛ yie.

Nnoɔma no ho nsɛm nie:
- Nwura Sɛso: {wasteType}
- Gya Da: {scheduledDate}
- Bere a Wɔbɛba: {timeSlot}
- Gya Beaeɛ: {pickupAddress}
- Ka a Wɔsusuw: GH₵ {estimatedCost}

Yɛn boaboani bɛduru hɔ wɔ bere a yɛahyehyɛ no mu. Wobetumi ahwɛ wo gya no tebea wɔ "Hwɛ Kwan So" fa no mu wɔ app no so.

Yɛda wo ase sɛ woboa ma Kwadaso yɛ kronkron!

Nkyia,
Kwadaso Nwura Boaboa Kuw no
`,
    adminEmailSubject: "Wɔahyehyɛ Nwura Gya Foforɔ: #{pickupId}",
    adminEmailBody: `
Wɔahyehyɛ nwura gya foforɔ.

**Abisadeɛ Ho Nsɛm:**
- **Adetɔfo Din:** {fullName}
- **Adetɔfo Email:** {email}
- **Nwura Sɛso:** {wasteType}
- **Gya Da:** {scheduledDate}
- **Bere a Wɔbɛba:** {timeSlot}
- **Gya Beaeɛ:** {pickupAddress}
- **Ɛho Hia Dodoɔ:** {priority}
- **Ka a Wosusuw:** GH₵ {estimatedCost}

Yɛsrɛ wo, fa obi ma no wɔ admin dashboard no so.
`,
    smsMessage: "Kwadaso Nwura: Wo {wasteType} gya ahyehyɛ {scheduledDate} wɔ {timeSlot}. Beaeɛ: {pickupAddress}. Hwɛ wɔ kwadaso.app"
  }
};

export default function SchedulePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [language, setLanguage] = useState('en');
  const [pickups, setPickups] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [formData, setFormData] = useState({
    waste_type: '',
    scheduled_date: '',
    scheduled_time: '',
    priority: 'medium',
    estimated_weight: '',
    pickup_address: '',
    special_instructions: ''
  });

  useEffect(() => {
    loadUserData();
    loadPickups();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
      setLanguage(userData.preferred_language || 'en');
      setFormData(prev => ({
        ...prev,
        pickup_address: userData.address || ''
      }));
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const loadPickups = async () => {
    try {
      const userData = await User.me();
      const userPickups = await WastePickup.filter(
        { customer_id: userData.id },
        '-created_date',
        20
      );
      setPickups(userPickups);
    } catch (error) {
      console.error("Error loading pickups:", error);
    }
  };

  const calculateEstimatedCost = () => {
    const baseRate = 5.00;
    const perKgRate = 2.00;
    const weight = parseFloat(formData.estimated_weight) || 0;
    let total = baseRate + (weight * perKgRate);

    if (formData.priority === 'urgent') {
      total *= 1.5;
    }

    return total.toFixed(2);
  };

  const t = translations[language]; // Define t here to be available for handleSubmit and JSX

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const estimatedCost = calculateEstimatedCost();
      const pickupData = {
        ...formData,
        customer_id: user.id,
        scheduled_date: format(selectedDate, 'yyyy-MM-dd'),
        pickup_location: user.location,
        amount: parseFloat(estimatedCost)
      };

      const newPickup = await WastePickup.create(pickupData);
      
      // Create a notification for admins
      await Notification.create({
        title: "New Pickup Scheduled",
        message: `A new ${t[pickupData.waste_type] || pickupData.waste_type} pickup request has been scheduled by ${user.full_name}.`,
        type: "new_pickup",
        recipient_user_type: "administrator",
        link_to: createPageUrl("UserManagement") 
      });

      // Send confirmation email to USER
      const userEmailBody = t.emailBody
        .replace('{fullName}', user.full_name)
        .replace('{wasteType}', t[pickupData.waste_type] || pickupData.waste_type) // Translate waste type
        .replace('{scheduledDate}', format(selectedDate, 'PPP'))
        .replace('{timeSlot}', t[pickupData.scheduled_time] || pickupData.scheduled_time) // Translate time slot
        .replace('{pickupAddress}', pickupData.pickup_address)
        .replace('{estimatedCost}', estimatedCost);

      await SendEmail({
        to: user.email,
        from_name: "Kwadaso Waste Collection",
        subject: t.emailSubject,
        body: userEmailBody
      });

      // TODO: Send SMS notification when SMS integration becomes available
      // if (user.phone_number) { // Ensure user has a phone number
      //   const smsMessage = t.smsMessage
      //     .replace('{wasteType}', t[pickupData.waste_type] || pickupData.waste_type)
      //     .replace('{scheduledDate}', format(selectedDate, 'MMM d')) // Short date format for SMS
      //     .replace('{timeSlot}', t[pickupData.scheduled_time] || pickupData.scheduled_time)
      //     .replace('{pickupAddress}', pickupData.pickup_address);
          
      //   // Assuming SendSMS is an integration function similar to SendEmail
      //   // await SendSMS({
      //   //   to: user.phone_number,
      //   //   message: smsMessage
      //   // });
      // }

      // Send notification email to ADMINS
      const admins = await User.filter({ user_type: 'administrator' });
      if (admins.length > 0) {
        const adminEmailSubject = t.adminEmailSubject.replace('{pickupId}', newPickup.id);
        const adminEmailBody = t.adminEmailBody
          .replace('{fullName}', user.full_name)
          .replace('{email}', user.email)
          .replace('{wasteType}', t[pickupData.waste_type] || pickupData.waste_type)
          .replace('{scheduledDate}', format(selectedDate, 'PPP'))
          .replace('{timeSlot}', t[pickupData.scheduled_time] || pickupData.scheduled_time)
          .replace('{pickupAddress}', pickupData.pickup_address)
          .replace('{priority}', t[pickupData.priority] || pickupData.priority)
          .replace('{estimatedCost}', estimatedCost);

        for (const admin of admins) {
          await SendEmail({
            to: admin.email,
            from_name: "Kwadaso Waste System Notification",
            subject: adminEmailSubject,
            body: adminEmailBody
          });
        }
      }

      // Reset form
      setFormData({
        waste_type: '',
        scheduled_date: '',
        scheduled_time: '',
        priority: 'medium',
        estimated_weight: '',
        pickup_address: user.address || '',
        special_instructions: ''
      });

      // Reload pickups
      await loadPickups();

    } catch (error) {
      console.error("Error scheduling pickup:", error);
      // Optionally, show a user-friendly error message
    }
    setIsLoading(false);
  };

  const getWasteTypeIcon = (type) => {
    const icons = {
      organic: Recycle,
      recyclable: Package,
      electronic: Zap,
      hazardous: Shield,
      general: Trash2
    };
    return icons[type] || Trash2;
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

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {t.backToDashboard}
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">{t.schedulePickup}</h1>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Scheduling Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-green-600" />
                {t.schedulePickup}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>{t.wasteType}</Label>
                    <Select
                      value={formData.waste_type}
                      onValueChange={(value) => setFormData({ ...formData, waste_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t.wasteType} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="organic">
                          <div className="flex items-center gap-2">
                            <Recycle className="w-4 h-4" />
                            {t.organic}
                          </div>
                        </SelectItem>
                        <SelectItem value="recyclable">
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4" />
                            {t.recyclable}
                          </div>
                        </SelectItem>
                        <SelectItem value="electronic">
                          <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4" />
                            {t.electronic}
                          </div>
                        </SelectItem>
                        <SelectItem value="hazardous">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            {t.hazardous}
                          </div>
                        </SelectItem>
                        <SelectItem value="general">
                          <div className="flex items-center gap-2">
                            <Trash2 className="w-4 h-4" />
                            {t.general}
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>{t.priority}</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value) => setFormData({ ...formData, priority: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">{t.low}</SelectItem>
                        <SelectItem value="medium">{t.medium}</SelectItem>
                        <SelectItem value="high">{t.high}</SelectItem>
                        <SelectItem value="urgent">{t.urgent}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>{t.pickupDate}</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>{t.timeSlot}</Label>
                    <Select
                      value={formData.scheduled_time}
                      onValueChange={(value) => setFormData({ ...formData, scheduled_time: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t.timeSlot} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">{t.morning}</SelectItem>
                        <SelectItem value="afternoon">{t.afternoon}</SelectItem>
                        <SelectItem value="evening">{t.evening}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{t.estimatedWeight}</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.estimated_weight}
                    onChange={(e) => setFormData({ ...formData, estimated_weight: e.target.value })}
                    placeholder="Enter weight in kg"
                  />
                </div>

                <div className="space-y-2">
                  <Label>{t.address}</Label>
                  <Input
                    value={formData.pickup_address}
                    onChange={(e) => setFormData({ ...formData, pickup_address: e.target.value })}
                    placeholder={t.address}
                  />
                </div>

                <div className="space-y-2">
                  <Label>{t.instructions}</Label>
                  <Textarea
                    value={formData.special_instructions}
                    onChange={(e) => setFormData({ ...formData, special_instructions: e.target.value })}
                    placeholder="Any special handling requirements..."
                    rows={3}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={isLoading || !formData.waste_type || !formData.scheduled_time}
                >
                  {isLoading ? "Scheduling..." : t.scheduleBtn}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pricing Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t.pricing}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">{t.basicRate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">{t.perKg}</span>
                </div>
                {formData.priority === 'urgent' && (
                  <div className="flex justify-between text-orange-600">
                    <span className="text-sm">{t.urgentFee}</span>
                  </div>
                )}
                <hr />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Estimated Total:</span>
                  <span className="text-green-600">GH₵ {calculateEstimatedCost()}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Pickups */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t.currentPickups}</CardTitle>
              </CardHeader>
              <CardContent>
                {pickups.length === 0 ? (
                  <div className="text-center py-6">
                    <Trash2 className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">{t.noPickups}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pickups.slice(0, 5).map((pickup) => {
                      const IconComponent = getWasteTypeIcon(pickup.waste_type);
                      return (
                        <div key={pickup.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <IconComponent className="h-5 w-5 text-gray-600" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{t[pickup.waste_type] || pickup.waste_type?.replace('_', ' ')}</p>
                            <p className="text-xs text-gray-500">
                              {format(new Date(pickup.scheduled_date), 'MMM d')}
                            </p>
                          </div>
                          <Badge className={getPriorityColor(pickup.priority)}>
                            {t[pickup.priority]}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
