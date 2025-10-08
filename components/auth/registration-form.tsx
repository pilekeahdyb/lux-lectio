
"use client";

import { useState } from "react";
import { User, Calendar, Cross, Heart } from "lucide-react";

export interface RegistrationData {
  firstName: string;
  lastName: string;
  birthDate: string;
  baptismDate: string;
}


export default function RegistrationForm({ onRegister }: { onRegister: (data: RegistrationData) => void }) {
  const [form, setForm] = useState<RegistrationData>({
    firstName: "",
    lastName: "",
    birthDate: "",
    baptismDate: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (form.firstName && form.lastName && form.birthDate && form.baptismDate) {
      onRegister(form);
    }
  };

  return (
    <div className="w-full flex items-center justify-center">
      <div className="relative w-full max-w-[400px] bg-white/95 dark:bg-slate-900/95 rounded-2xl shadow-lg overflow-hidden">
        {/* Arrière-plan religieux avec overlay */}
        <div className="absolute inset-0 bg-[url('/images/religious-bg.jpg')] bg-cover bg-center opacity-10" />
        
        {/* Logo animé et titre */}
        <div className="relative pt-4 pb-2 px-4 text-center">
          <div className="relative w-16 h-16 mx-auto mb-2 group">
            <img
              src="/placeholder-logo.png"
              alt="Logo"
              className="w-full h-full object-contain animate-float group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-green-500/20 rounded-full blur-lg animate-pulse" />
          </div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Inscription
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">
            Les dates servent à vous souhaiter un joyeux anniversaire ou fête de baptême
          </p>
          <div className="flex justify-center gap-2 mt-2">
            <Heart className="w-3 h-3 text-red-500 animate-pulse" />
            <Cross className="w-3 h-3 text-green-500 animate-bounce" />
            <Heart className="w-3 h-3 text-red-500 animate-pulse" />
          </div>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="relative px-4 pb-4 space-y-3">
          <div className="space-y-3">
            <div className="relative">
              <label htmlFor="lastName" className="flex items-center gap-1.5 text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">
                <User className="w-3.5 h-3.5" />
                Nom
              </label>
              <input
                id="lastName"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                required
                placeholder="Votre nom"
                className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-green-400 dark:focus:ring-green-600 transition-all bg-white/50 dark:bg-slate-800/50"
              />
      </div>
            <div className="relative">
              <label htmlFor="firstName" className="flex items-center gap-1.5 text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">
                <User className="w-3.5 h-3.5" />
                Prénom
              </label>
              <input
                id="firstName"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                required
                placeholder="Votre prénom"
                className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-green-400 dark:focus:ring-green-600 transition-all bg-white/50 dark:bg-slate-800/50"
              />
            </div>

            <div className="relative">
              <label htmlFor="birthDate" className="flex items-center gap-1.5 text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">
                <Calendar className="w-3.5 h-3.5" />
                Date de naissance
              </label>
              <input
                id="birthDate"
                name="birthDate"
                value={form.birthDate}
                onChange={handleChange}
                required
                type="date"
                className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-green-400 dark:focus:ring-green-600 transition-all bg-white/50 dark:bg-slate-800/50"
              />
            </div>

            <div className="relative">
              <label htmlFor="baptismDate" className="flex items-center gap-1.5 text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">
                <Cross className="w-3.5 h-3.5" />
                Date de baptême
              </label>
              <input
                id="baptismDate"
                name="baptismDate"
                value={form.baptismDate}
                onChange={handleChange}
                required
                type="date"
                className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-green-400 dark:focus:ring-green-600 transition-all bg-white/50 dark:bg-slate-800/50"
              />
            </div>
          </div>

          {/* Bouton avec fond animé */}
          <div className="relative mt-4">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg blur animate-pulse" />
            <button
              type="submit"
              className="relative w-full py-2 text-sm bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-lg shadow-md hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200"
            >
              S'inscrire
            </button>
          </div>

          {submitted && (!form.firstName || !form.lastName || !form.birthDate || !form.baptismDate) && (
            <div className="text-red-500 text-xs text-center mt-2 animate-shake">
              Veuillez remplir tous les champs obligatoires.
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
