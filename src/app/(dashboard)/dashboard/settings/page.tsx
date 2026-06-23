"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Shield, Key, Moon, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/hooks/useAuth";
import { useUserProfile } from "@/lib/hooks/useUserProfile";
import { updateUserProfile } from "@/lib/db/repositories/user.repository";
import { cn } from "@/lib/utils";

type Tab = "profile" | "preferences" | "security" | "api_keys";

export default function SettingsPage() {
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();
  
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [displayName, setDisplayName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [isSavingKey, setIsSavingKey] = useState(false);
  const [keySaveSuccess, setKeySaveSuccess] = useState(false);

  useEffect(() => {
    if (profile?.displayName) {
      setDisplayName(profile.displayName);
    } else if (user?.displayName) {
      setDisplayName(user.displayName);
    }
    if (profile?.geminiApiKey) {
      setGeminiApiKey(profile.geminiApiKey);
    }
  }, [profile, user]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await updateUserProfile(user.uid, { displayName });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to update profile", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSavingKey(true);
    setKeySaveSuccess(false);
    try {
      await updateUserProfile(user.uid, { geminiApiKey: geminiApiKey.trim() || null });
      setKeySaveSuccess(true);
      setTimeout(() => setKeySaveSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to save API key", error);
    } finally {
      setIsSavingKey(false);
    }
  };

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: "profile", label: "Profile", icon: User },
    { id: "preferences", label: "Preferences", icon: Moon },
    { id: "security", label: "Security", icon: Shield },
    { id: "api_keys", label: "API Keys", icon: Key },
  ];

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold text-white mb-1">Settings</h1>
        <p className="text-sm text-zinc-500 mb-8">Manage your account preferences and application settings.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.3 }}
          className="md:col-span-1 space-y-1"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                activeTab === tab.id
                  ? "bg-white/[0.06] text-white"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.02]"
              )}
            >
              <tab.icon className={cn("w-4 h-4", activeTab === tab.id ? "text-indigo-400" : "")} />
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Content Area */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="md:col-span-3 min-h-[400px]"
        >
          <AnimatePresence mode="wait">
            {activeTab === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] space-y-6"
              >
                <div>
                  <h2 className="text-lg font-semibold text-zinc-200">Profile Information</h2>
                  <p className="text-sm text-zinc-500 mt-1">Update your account's public facing details.</p>
                </div>
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300">Display Name</label>
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 text-zinc-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                      disabled={profileLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300">Email Address</label>
                    <input
                      type="email"
                      value={profile?.email || user?.email || ""}
                      className="w-full bg-white/[0.02] border border-white/[0.04] rounded-lg px-4 py-2.5 text-zinc-500 focus:outline-none transition-colors cursor-not-allowed"
                      disabled
                    />
                    <p className="text-xs text-zinc-600 mt-1.5">Email addresses cannot be changed directly.</p>
                  </div>
                </div>
                <div className="pt-4 flex items-center gap-4 border-t border-white/[0.06]">
                  <Button 
                    onClick={handleSaveProfile} 
                    disabled={isSaving || profileLoading}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white border-0 min-w-32 glow-brand-sm"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
                  </Button>
                  {saveSuccess && (
                    <motion.span 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-sm text-emerald-400 flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" /> Profile updated
                    </motion.span>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "preferences" && (
              <motion.div
                key="preferences"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] space-y-6"
              >
                <div>
                  <h2 className="text-lg font-semibold text-zinc-200">Application Preferences</h2>
                  <p className="text-sm text-zinc-500 mt-1">Customize how RepoLens looks and feels.</p>
                </div>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-white/[0.04] bg-white/[0.01] flex items-center justify-between">
                    <div>
                      <p className="font-medium text-zinc-300">Dark Theme</p>
                      <p className="text-sm text-zinc-500">RepoLens currently operates in a permanent dark mode.</p>
                    </div>
                    <div className="w-10 h-6 bg-indigo-500 rounded-full flex items-center p-1 justify-end cursor-not-allowed opacity-80">
                      <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "security" && (
              <motion.div
                key="security"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] space-y-6"
              >
                <div>
                  <h2 className="text-lg font-semibold text-zinc-200">Security & Authentication</h2>
                  <p className="text-sm text-zinc-500 mt-1">Manage your account security and connected providers.</p>
                </div>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-white/[0.04] bg-white/[0.01] flex items-center justify-between">
                    <div>
                      <p className="font-medium text-zinc-300 capitalize">{profile?.providerId || "OAuth"} Connected</p>
                      <p className="text-sm text-zinc-500">You are securely signed in via {profile?.providerId}.</p>
                    </div>
                    <Badge variant="outline" className="text-emerald-400 border-emerald-400/20 bg-emerald-400/10">Active</Badge>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "api_keys" && (
              <motion.div
                key="api_keys"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] space-y-6"
              >
                <div>
                  <h2 className="text-lg font-semibold text-zinc-200">API Keys (BYOK)</h2>
                  <p className="text-sm text-zinc-500 mt-1">Bring Your Own Key to bypass analysis limits and use your own credits.</p>
                </div>
                <form onSubmit={handleSaveApiKey} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300">Google Gemini API Key</label>
                    <input
                      type="password"
                      autoComplete="new-password"
                      placeholder="AIzaSyB..."
                      value={geminiApiKey}
                      onChange={(e) => setGeminiApiKey(e.target.value)}
                      disabled={profileLoading}
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 text-zinc-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-colors"
                    />
                    <p className="text-xs text-zinc-500 mt-1.5">Your personal key will be securely saved and used for your analyses.</p>
                  </div>
                  <div className="pt-4 flex items-center gap-4 border-t border-white/[0.06]">
                    <Button 
                      type="submit" 
                      disabled={isSavingKey || profileLoading}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white border-0 min-w-32 glow-brand-sm"
                    >
                      {isSavingKey ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save API Key"}
                    </Button>
                    {keySaveSuccess && (
                      <motion.span 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-sm text-emerald-400 flex items-center gap-1.5"
                      >
                        <Check className="w-4 h-4" /> API Key saved
                      </motion.span>
                    )}
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
