import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "@/entities/User";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Truck, MapPin, Building2, Users, Shield, Globe, Phone, Mail } from "lucide-react";
import { motion } from "framer-motion";

const translations = {
  en: {
    welcome: "Welcome to Kwadaso Waste Collection",
    subtitle: "Sustainable waste management for our community",
    login: "Login",
    register: "Register",
    email: "Email Address",
    password: "Password",
    fullName: "Full Name",
    phoneNumber: "Phone Number",
    address: "Physical Address",
    userType: "I am a...",
    household: "Household",
    business: "Business",
    marketWoman: "Market Woman",
    wasteCollector: "Waste Collector",
    administrator: "Administrator",
    businessName: "Business Name",
    marketLocation: "Market Location",
    collectorId: "Collector ID",
    vehicleReg: "Vehicle Registration",
    language: "Preferred Language",
    english: "English",
    twi: "Twi",
    terms: "I agree to the terms and conditions",
    loginBtn: "Sign In",
    registerBtn: "Create Account",
    forgotPassword: "Forgot Password?",
    noAccount: "Don't have an account?",
    haveAccount: "Already have an account?",
    registerHere: "Register here",
    loginHere: "Login here"
  },
  tw: {
    welcome: "Akwaaba Kwadaso Nwura Boaboa",
    subtitle: "Nwura boaboa a ɛyɛ yiye ma yɛn mpɔtam hɔ",
    login: "Kɔ Mu",
    register: "Kyerɛw Wo Din",
    email: "Email Address",
    password: "Password",
    fullName: "Din Mua",
    phoneNumber: "Telefon Nɔma",
    address: "Baabi a Wote",
    userType: "Me yɛ...",
    household: "Ofie Wura",
    business: "Adwumawura",
    marketWoman: "Guaso Bea",
    wasteCollector: "Nwura Boaboani",
    administrator: "Ɔhwɛfo Panin",
    businessName: "Adwuma Din",
    marketLocation: "Guaso Baabi",
    collectorId: "Boaboani Nɔma",
    vehicleReg: "Kar Nɔma",
    language: "Kasa a Wopɛ",
    english: "Borɔfo Kasa",
    twi: "Twi Kasa",
    terms: "Me pene nhyehyɛe no so",
    loginBtn: "Kɔ Mu",
    registerBtn: "Yɛ Akawnt",
    forgotPassword: "Wo werɛ afi password?",
    noAccount: "Wonni akawnt?",
    haveAccount: "Wowɔ akawnt dada?",
    registerHere: "Kyerɛw wo din wɔ ha",
    loginHere: "Kɔ mu wɔ ha"
  }
};

export default function AuthPage() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  
  const [registerData, setRegisterData] = useState({
    full_name: '',
    email: '',
    password: '',
    phone_number: '',
    address: '',
    user_type: '',
    business_name: '',
    market_location: '',
    collector_id: '',
    vehicle_registration: '',
    preferred_language: 'en',
    terms_accepted: false
  });

  useEffect(() => {
    checkExistingAuth();
    const savedLang = localStorage.getItem('preferred_language') || 'en';
    setLanguage(savedLang);
  }, []);

  const checkExistingAuth = async () => {
    try {
      await User.me();
      navigate(createPageUrl("Dashboard"));
    } catch (error) {
      // User not authenticated, stay on auth page
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await User.login();
      navigate(createPageUrl("Dashboard"));
    } catch (error) {
      console.error("Login failed:", error);
    }
    setIsLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!registerData.terms_accepted) {
      alert(t.terms);
      return;
    }
    
    setIsLoading(true);
    try {
      const userData = { ...registerData };
      delete userData.terms_accepted;
      delete userData.password;
      
      await User.create(userData);
      await User.login();
      navigate(createPageUrl("Dashboard"));
    } catch (error) {
      console.error("Registration failed:", error);
    }
    setIsLoading(false);
  };

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    setRegisterData({ ...registerData, preferred_language: newLang });
    localStorage.setItem('preferred_language', newLang);
  };

  const t = translations[language];

  const userTypeIcons = {
    household: Users,
    business: Building2,
    market_woman: MapPin,
    waste_collector: Truck,
    administrator: Shield
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-yellow-50 flex items-center justify-center p-4">
      <style>{`
        .ghana-pattern {
          background-image: 
            linear-gradient(45deg, transparent 25%, rgba(245, 158, 11, 0.05) 25%),
            linear-gradient(-45deg, transparent 25%, rgba(245, 158, 11, 0.05) 25%),
            linear-gradient(45deg, rgba(245, 158, 11, 0.05) 75%, transparent 75%),
            linear-gradient(-45deg, rgba(245, 158, 11, 0.05) 75%, transparent 75%);
          background-size: 30px 30px;
          background-position: 0 0, 0 15px, 15px -15px, -15px 0px;
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-green-600 to-green-700 rounded-2xl flex items-center justify-center shadow-2xl mb-6">
            <Truck className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.welcome}</h1>
          <p className="text-gray-600">{t.subtitle}</p>
          
          <div className="flex justify-center mt-4">
            <div className="flex rounded-lg border border-gray-200 p-1 bg-white">
              <Button
                variant={language === 'en' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleLanguageChange('en')}
                className="text-xs"
              >
                <Globe className="w-3 h-3 mr-1" />
                EN
              </Button>
              <Button
                variant={language === 'tw' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleLanguageChange('tw')}
                className="text-xs"
              >
                <Globe className="w-3 h-3 mr-1" />
                TW
              </Button>
            </div>
          </div>
        </div>

        <Card className="shadow-2xl border-0 ghana-pattern">
          <CardHeader className="pb-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">{t.login}</TabsTrigger>
                <TabsTrigger value="register">{t.register}</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>

          <CardContent>
            <Tabs value={activeTab}>
              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">{t.email}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder={t.email}
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">{t.password}</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder={t.password}
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Loading..." : t.loginBtn}
                  </Button>
                  
                  <div className="text-center">
                    <Button variant="link" className="text-sm text-green-600">
                      {t.forgotPassword}
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="register" className="space-y-4">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="full_name">{t.fullName}</Label>
                      <Input
                        id="full_name"
                        placeholder={t.fullName}
                        value={registerData.full_name}
                        onChange={(e) => setRegisterData({ ...registerData, full_name: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="reg_email">{t.email}</Label>
                      <Input
                        id="reg_email"
                        type="email"
                        placeholder={t.email}
                        value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone_number">{t.phoneNumber}</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone_number"
                        placeholder="+233 XX XXX XXXX"
                        value={registerData.phone_number}
                        onChange={(e) => setRegisterData({ ...registerData, phone_number: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">{t.address}</Label>
                    <Input
                      id="address"
                      placeholder={t.address}
                      value={registerData.address}
                      onChange={(e) => setRegisterData({ ...registerData, address: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="user_type">{t.userType}</Label>
                    <Select
                      value={registerData.user_type}
                      onValueChange={(value) => setRegisterData({ ...registerData, user_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t.userType} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="household">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            {t.household}
                          </div>
                        </SelectItem>
                        <SelectItem value="business">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4" />
                            {t.business}
                          </div>
                        </SelectItem>
                        <SelectItem value="market_woman">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {t.marketWoman}
                          </div>
                        </SelectItem>
                        <SelectItem value="waste_collector">
                          <div className="flex items-center gap-2">
                            <Truck className="w-4 h-4" />
                            {t.wasteCollector}
                          </div>
                        </SelectItem>
                        <SelectItem value="administrator">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            {t.administrator}
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {registerData.user_type === 'business' && (
                    <div className="space-y-2">
                      <Label htmlFor="business_name">{t.businessName}</Label>
                      <Input
                        id="business_name"
                        placeholder={t.businessName}
                        value={registerData.business_name}
                        onChange={(e) => setRegisterData({ ...registerData, business_name: e.target.value })}
                      />
                    </div>
                  )}
                  
                  {registerData.user_type === 'market_woman' && (
                    <div className="space-y-2">
                      <Label htmlFor="market_location">{t.marketLocation}</Label>
                      <Input
                        id="market_location"
                        placeholder={t.marketLocation}
                        value={registerData.market_location}
                        onChange={(e) => setRegisterData({ ...registerData, market_location: e.target.value })}
                      />
                    </div>
                  )}
                  
                  {registerData.user_type === 'waste_collector' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="collector_id">{t.collectorId}</Label>
                        <Input
                          id="collector_id"
                          placeholder={t.collectorId}
                          value={registerData.collector_id}
                          onChange={(e) => setRegisterData({ ...registerData, collector_id: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="vehicle_registration">{t.vehicleReg}</Label>
                        <Input
                          id="vehicle_registration"
                          placeholder={t.vehicleReg}
                          value={registerData.vehicle_registration}
                          onChange={(e) => setRegisterData({ ...registerData, vehicle_registration: e.target.value })}
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={registerData.terms_accepted}
                      onCheckedChange={(checked) => setRegisterData({ ...registerData, terms_accepted: checked })}
                    />
                    <Label htmlFor="terms" className="text-sm">
                      {t.terms}
                    </Label>
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={isLoading || !registerData.terms_accepted}
                  >
                    {isLoading ? "Creating..." : t.registerBtn}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}