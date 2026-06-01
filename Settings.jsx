import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  User as UserIcon, Mail, Phone, MapPin, Building2, Users, Loader2, CheckCircle,
  Globe, Languages, Bell
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const translations = {
  en: {
    title: "Settings",
    subtitle: "Manage your profile and preferences",
    personalInfo: "Personal Information",
    fullName: "Full Name",
    email: "Email Address",
    phoneNumber: "Phone Number",
    locationSettings: "Location Settings",
    address: "Physical Address",
    updateLocation: "Update to Current Location",
    locating: "Fetching location...",
    accountSettings: "Account Settings",
    userType: "User Type",
    household: "Household",
    business: "Business",
    marketWoman: "Market Woman",
    language: "Preferred Language",
    english: "English",
    twi: "Twi",
    notificationPrefs: "Notification Preferences",
    emailNotifications: "Email Notifications",
    smsNotifications: "SMS Notifications",
    saveChanges: "Save Changes",
    saving: "Saving...",
    successMessage: "Profile updated successfully!",
    locationError: "Could not get location. Please enable location services in your browser."
  },
  tw: {
    title: "Nhyehyɛe",
    subtitle: "Hwɛ wo profail ne nea wopɛ so",
    personalInfo: "Ankorankoro Nsɛm",
    fullName: "Din Mua",
    email: "Email Address",
    phoneNumber: "Telefon Nɔma",
    locationSettings: "Baabi a Wowɔ Ho Nhyehyɛe",
    address: "Baabi a Wote",
    updateLocation: "Yɛ Foforo Kɔ Baabi a Wowɔ Seesei",
    locating: "Ɛrehwehwɛ baabi a wowɔ...",
    accountSettings: "Akawnt Ho Nhyehyɛe",
    userType: "Wo Su",
    household: "Ofie Wura",
    business: "Adwumawura",
    marketWoman: "Guaso Bea",
    language: "Kasa a Wopɛ",
    english: "Borɔfo Kasa",
    twi: "Twi Kasa",
    notificationPrefs: "Nkaebɔ a Wopɛ",
    emailNotifications: "Email Nkaebɔ",
    smsNotifications: "SMS Nkaebɔ",
    saveChanges: "Kora Nsakrae No",
    saving: "Ɛrekora...",
    successMessage: "Wɔayɛ wo profail foforo yiye!",
    locationError: "Yentumi nyaa baabi a wowɔ. Yɛsrɛ wo ma kwan ma yɛnhu baabi a wowɔ wɔ wo brausa no mu."
  }
};

export default function SettingsPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    phone_number: '',
    address: '',
    user_type: '',
    preferred_language: 'en',
    location: { lat: 0, lng: 0 }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await User.me();
        setUser(userData);
        setFormData({
          phone_number: userData.phone_number || '',
          address: userData.address || '',
          user_type: userData.user_type || '',
          preferred_language: userData.preferred_language || 'en',
          location: userData.location || { lat: 0, lng: 0 }
        });
        setLanguage(userData.preferred_language || 'en');
      } catch (error) {
        navigate('/auth');
      }
      setIsLoading(false);
    };
    loadUserData();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLocationUpdate = () => {
    setIsLocating(true);
    setSuccessMessage('');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData(prev => ({
            ...prev,
            location: { lat: latitude, lng: longitude }
          }));
          setIsLocating(false);
        },
        () => {
          alert(translations[language].locationError);
          setIsLocating(false);
        }
      );
    } else {
      alert(translations[language].locationError);
      setIsLocating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage('');
    try {
      await User.updateMyUserData(formData);
      setSuccessMessage(translations[language].successMessage);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 text-green-600 animate-spin" />
      </div>
    );
  }

  const t = translations[language];

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.title}</h1>
        <p className="text-gray-600 mb-8">{t.subtitle}</p>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><UserIcon />{t.personalInfo}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="full_name">{t.fullName}</Label>
                  <div className="relative mt-1">
                    <UserIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input id="full_name" value={user.full_name} readOnly className="pl-10 bg-gray-100" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">{t.email}</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input id="email" value={user.email} readOnly className="pl-10 bg-gray-100" />
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="phone_number">{t.phoneNumber}</Label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    id="phone_number" 
                    name="phone_number"
                    value={formData.phone_number} 
                    onChange={handleInputChange} 
                    className="pl-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><MapPin />{t.locationSettings}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="address">{t.address}</Label>
                <Input 
                  id="address"
                  name="address" 
                  value={formData.address} 
                  onChange={handleInputChange} 
                  className="mt-1"
                />
              </div>
              <div>
                <Label>GPS Coordinates</Label>
                <div className="flex items-center gap-4 mt-1">
                  <Input 
                    value={`Lat: ${formData.location.lat.toFixed(4)}, Lng: ${formData.location.lng.toFixed(4)}`} 
                    readOnly 
                    className="bg-gray-100"
                  />
                  <Button type="button" variant="outline" onClick={handleLocationUpdate} disabled={isLocating}>
                    {isLocating ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {t.locating}</>
                    ) : t.updateLocation}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><UserIcon />{t.accountSettings}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="user_type">{t.userType}</Label>
                  <Select name="user_type" value={formData.user_type} onValueChange={(val) => handleSelectChange('user_type', val)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="household"><div className="flex items-center gap-2"><Users className="w-4 h-4" /> {t.household}</div></SelectItem>
                      <SelectItem value="business"><div className="flex items-center gap-2"><Building2 className="w-4 h-4" /> {t.business}</div></SelectItem>
                      <SelectItem value="market_woman"><div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {t.marketWoman}</div></SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="language">{t.language}</Label>
                  <Select name="preferred_language" value={formData.preferred_language} onValueChange={(val) => handleSelectChange('preferred_language', val)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en"><div className="flex items-center gap-2"><Languages className="w-4 h-4" /> {t.english}</div></SelectItem>
                      <SelectItem value="tw"><div className="flex items-center gap-2"><Languages className="w-4 h-4" /> {t.twi}</div></SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex items-center justify-end gap-4">
            {successMessage && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span>{successMessage}</span>
              </motion.div>
            )}
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {t.saving}</>
              ) : t.saveChanges}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}