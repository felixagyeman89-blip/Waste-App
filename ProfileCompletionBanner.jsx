import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User as UserIcon, Settings, X, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

const translations = {
  en: {
    incompleteProfile: "Complete Your Profile",
    profileMessage: "Please complete your profile information to ensure the best waste collection service.",
    missingPhone: "Phone number is required for mobile money payments",
    missingAddress: "Address is needed for accurate pickup scheduling", 
    missingUserType: "User type helps us provide customized service",
    missingLocation: "Location helps collectors find you easily",
    completeProfile: "Complete Profile",
    dismiss: "Dismiss"
  },
  tw: {
    incompleteProfile: "Wie Wo Profail",
    profileMessage: "Yɛsrɛ wo wie wo profail nsɛm ma yɛnnya nwura boaboa ɔsom pa.",
    missingPhone: "Telefon nɔma ho hia ma mobile money sika tua",
    missingAddress: "Address ho hia ma gya ahyehyɛe a etu mpɔn",
    missingUserType: "Wo su ma yɛhu ɔsom a ɛfata wo",
    missingLocation: "Baabi a wowɔ boa boaboafo ma wohu wo ntɛm",
    completeProfile: "Wie Profail",
    dismiss: "Yi Fi"
  }
};

export default function ProfileCompletionBanner({ user, language = 'en', onDismiss }) {
  const [isDismissed, setIsDismissed] = useState(false);
  
  if (!user || isDismissed) return null;

  // Check what information is missing
  const missingFields = [];
  if (!user.phone_number) missingFields.push('phone');
  if (!user.address) missingFields.push('address');
  if (!user.user_type) missingFields.push('userType');
  if (!user.location || (user.location.lat === 0 && user.location.lng === 0)) {
    missingFields.push('location');
  }

  // Don't show if profile is complete
  if (missingFields.length === 0) return null;

  const t = translations[language];

  const handleDismiss = () => {
    setIsDismissed(true);
    if (onDismiss) onDismiss();
  };

  const getMissingFieldMessage = (field) => {
    const messages = {
      phone: t.missingPhone,
      address: t.missingAddress,
      userType: t.missingUserType,
      location: t.missingLocation
    };
    return messages[field];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            
            <div className="flex-1">
              <h3 className="font-semibold text-orange-900 mb-1">{t.incompleteProfile}</h3>
              <p className="text-orange-800 text-sm mb-3">{t.profileMessage}</p>
              
              <ul className="space-y-1 mb-4">
                {missingFields.map(field => (
                  <li key={field} className="text-sm text-orange-700 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-orange-400 rounded-full" />
                    {getMissingFieldMessage(field)}
                  </li>
                ))}
              </ul>
              
              <div className="flex items-center gap-3">
                <Link to={createPageUrl("Settings")}>
                  <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">
                    <Settings className="w-4 h-4 mr-2" />
                    {t.completeProfile}
                  </Button>
                </Link>
                <Button size="sm" variant="ghost" onClick={handleDismiss}>
                  {t.dismiss}
                </Button>
              </div>
            </div>
            
            <Button
              size="icon"
              variant="ghost"
              onClick={handleDismiss}
              className="text-orange-600 hover:bg-orange-100"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}