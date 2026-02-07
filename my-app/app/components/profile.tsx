"use client";

 import { useState, useEffect, useCallback, useRef } from "react";

 const PROFILE_STORAGE_KEY = "pharmashe-profile";

 export interface ProfileData {
   heightCm: string;
   weightKg: string;
   underlyingConditions: string;
   concerns: string;
   savedAt: string;
 }

 const defaultProfile: ProfileData = {
   heightCm: "",
   weightKg: "",
   underlyingConditions: "",
   concerns: "",
   savedAt: "",
 };

 function parseNum(s: string): number {
   const n = parseFloat(s);
   return Number.isFinite(n) && n > 0 ? n : 0;
 }

 function computeBMI(heightCm: number, weightKg: number): number | null {
   if (heightCm <= 0 || weightKg <= 0) return null;
   const heightM = heightCm / 100;
   return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
 }

 function getBMICategory(bmi: number): string {
   if (bmi < 18.5) return "Underweight";
   if (bmi < 25) return "Normal";
   if (bmi < 30) return "Overweight";
   return "Obese";
 }

 function loadProfile(): ProfileData {
   if (typeof window === "undefined") return defaultProfile;
   try {
     const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
     if (!raw) return defaultProfile;
     const parsed = JSON.parse(raw) as Partial<ProfileData>;
     return {
       heightCm: parsed.heightCm ?? "",
       weightKg: parsed.weightKg ?? "",
       underlyingConditions: parsed.underlyingConditions ?? "",
       concerns: parsed.concerns ?? "",
       savedAt: parsed.savedAt ?? "",
     };
   } catch {
     return defaultProfile;
   }
 }

 function saveProfile(data: ProfileData): void {
   if (typeof window === "undefined") return;
   try {
     const toSave = { ...data, savedAt: new Date().toISOString() };
     localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(toSave));
   } catch (e) {
     console.error("Failed to save profile:", e);
   }
 }

 export default function Profile() {
   const [profile, setProfile] = useState<ProfileData>(defaultProfile);
   const [mounted, setMounted] = useState(false);
   const isFirstRender = useRef(true);

   useEffect(() => {
     setProfile(loadProfile());
     setMounted(true);
   }, []);

   useEffect(() => {
     if (isFirstRender.current) {
       isFirstRender.current = false;
       return;
     }
     saveProfile(profile);
   }, [profile]);

   const update = useCallback((updates: Partial<ProfileData>) => {
     setProfile((prev) => ({ ...prev, ...updates }));
   }, []);

   const handleClearProfile = useCallback(() => {
     if (typeof window === "undefined") return;
     if (!window.confirm("Clear all profile data? This cannot be undone.")) return;
     localStorage.removeItem(PROFILE_STORAGE_KEY);
     setProfile(defaultProfile);
   }, []);

   if (!mounted) {
     return (
       <div className="card">
         <p className="text-gray-800 dark:text-gray-300">Loading profile…</p>
       </div>
     );
   }

   const heightCm = parseNum(profile.heightCm);
   const weightKg = parseNum(profile.weightKg);
   const bmi = computeBMI(heightCm, weightKg);
   const bmiCategory = bmi !== null ? getBMICategory(bmi) : null;

   return (
     <div className="card max-w-2xl mx-auto">
       <h2 className="text-2xl font-bold mb-4 text-[rgb(163,75,103)]">My Profile</h2>
       <p className="text-gray-800 dark:text-gray-300 mb-6">
         Your information is stored only on this device and is used to personalize drug considerations.
         Clear it anytime using the button at the bottom.
       </p>

       <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
           <div>
             <label htmlFor="height" className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-1">
               Height (cm)
             </label>
             <input
               id="height"
               type="number"
               min="1"
               max="300"
               step="0.1"
               value={profile.heightCm}
               onChange={(e) => update({ heightCm: e.target.value })}
               placeholder="e.g. 165"
               className="w-full px-4 py-2 border border-[rgb(205,160,177)] rounded-lg
                          focus:outline-none focus:ring-2 focus:ring-[rgb(163,75,103)]
                          text-black dark:text-gray-100 dark:placeholder:text-gray-400 dark:placeholder:text-gray-500"
             />
           </div>
           <div>
             <label htmlFor="weight" className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-1">
               Weight (kg)
             </label>
             <input
               id="weight"
               type="number"
               min="1"
               max="500"
               step="0.1"
               value={profile.weightKg}
               onChange={(e) => update({ weightKg: e.target.value })}
               placeholder="e.g. 65"
               className="w-full px-4 py-2 border border-[rgb(205,160,177)] rounded-lg
                          focus:outline-none focus:ring-2 focus:ring-[rgb(163,75,103)]
                          text-black dark:text-gray-100 dark:placeholder:text-gray-400 dark:placeholder:text-gray-500"
             />
           </div>
         </div>

         {bmi !== null && (
           <div className="p-4 rounded-lg bg-[rgb(255,250,252)] dark:bg-gray-800 border border-[rgb(205,160,177)]">
             <h3 className="text-lg font-semibold text-[rgb(163,75,103)] mb-2">BMI Calculator</h3>
             <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
               {bmi} <span className="text-base font-normal text-gray-600 dark:text-gray-300">kg/m²</span>
             </p>
             {bmiCategory && (
               <p className="text-sm text-gray-800 dark:text-gray-300 mt-1">Category: {bmiCategory}</p>
             )}
             <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
               This is for reference only. Discuss weight and health goals with your provider.
             </p>
           </div>
         )}

         <div>
           <label htmlFor="conditions" className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-1">
             Underlying conditions
           </label>
           <textarea
             id="conditions"
             rows={3}
             value={profile.underlyingConditions}
             onChange={(e) => update({ underlyingConditions: e.target.value })}
             placeholder="e.g. hypertension, type 2 diabetes, anxiety"
             className="w-full px-4 py-2 border border-[rgb(205,160,177)] rounded-lg
                        focus:outline-none focus:ring-2 focus:ring-[rgb(163,75,103)]
                        text-black dark:text-gray-100 dark:placeholder:text-gray-400 dark:placeholder:text-gray-500"
           />
         </div>

         <div>
           <label htmlFor="concerns" className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-1">
             Health concerns or notes
           </label>
           <textarea
             id="concerns"
             rows={3}
             value={profile.concerns}
             onChange={(e) => update({ concerns: e.target.value })}
             placeholder="e.g. pregnancy plans, breastfeeding, drug sensitivities"
             className="w-full px-4 py-2 border border-[rgb(205,160,177)] rounded-lg
                        focus:outline-none focus:ring-2 focus:ring-[rgb(163,75,103)]
                        text-black dark:text-gray-100 dark:placeholder:text-gray-400 dark:placeholder:text-gray-500"
           />
         </div>

         <p className="text-sm text-gray-800 dark:text-gray-300">
           Data is saved automatically. It is only stored on this device and is not sent to any server
           unless you use the drug analysis feature with context.
         </p>

         <div className="pt-4 border-t border-[rgb(205,160,177)]">
           <button
             type="button"
             onClick={handleClearProfile}
             className="px-4 py-2 rounded-lg border border-red-300 text-red-700 hover:bg-red-50 dark:hover:bg-red-900 transition-colors"
           >
             Clear profile data
           </button>
         </div>
       </form>
     </div>
   );
 }
