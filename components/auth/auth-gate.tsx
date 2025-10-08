"use client";
import React, { useEffect, useState } from "react";
import RegistrationForm from "@/components/auth/registration-form";

interface RegistrationData {
  firstName: string;
  lastName: string;
  birthDate: string;
  birthPlace: string;
  baptismDate: string;
  status: string;
  email: string;
  phone?: string;
  communionDate?: string;
  confirmationDate?: string;
}

function getGreeting(date: Date) {
  const hour = date.getHours();
  if (hour < 12) return "Bonjour";
  if (hour < 18) return "Bon après-midi";
  return "Bonsoir";
}

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<RegistrationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("lux-user");
    if (saved) setUser(JSON.parse(saved));
    setLoading(false);
  }, []);

  const handleRegister = (data: RegistrationData) => {
    setUser(data);
    localStorage.setItem("lux-user", JSON.stringify(data));
  };

  if (loading) return null;

  if (!user) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-blue-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 animate-fade-in">
        <div className="w-full max-w-lg p-6 sm:p-10 rounded-3xl shadow-2xl bg-white/90 dark:bg-slate-900/90 border border-gray-200 dark:border-slate-700 animate-scale-in">
          <div className="flex flex-col items-center mb-6">
            <img src="/placeholder-logo.png" alt="Logo" className="w-20 h-20 mb-2 animate-float" />
            <h1 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-1 animate-fade-in">Lux Lectio</h1>
            <p className="text-sm text-gray-500 dark:text-gray-300 animate-fade-in">Compagnon liturgique</p>
          </div>
          <RegistrationForm onRegister={handleRegister} />
        </div>
      </div>
    );
  }

  // Passe l'utilisateur dans le contexte via children
  return <>{children}</>;
}
