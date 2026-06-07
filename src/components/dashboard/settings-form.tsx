"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateUserAlias, regenerateAlias } from "@/actions/users";
import { getAvatarUrl } from "@/lib/aliases";
import { AlertCircle, CheckCircle, Loader2, RotateCw } from "lucide-react";

interface SettingsFormProps {
  profile: {
    alias: string;
    avatarSeed: string;
    createdAt: Date;
  };
}

export default function SettingsForm({ profile }: SettingsFormProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [newAlias, setNewAlias] = useState(profile.alias);
  const [bio, setBio] = useState("");

  const handleAliasChange = async () => {
    if (newAlias === profile.alias) {
      setMessage({ type: "error", text: "Please enter a different alias" });
      return;
    }

    setLoading(true);
    try {
      const result = await updateUserAlias(newAlias);
      if (result.success) {
        setMessage({ type: "success", text: result.message });
      } else {
        setMessage({ type: "error", text: result.message });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    setLoading(true);
    try {
      const result = await regenerateAlias();
      if (result.success) {
        setNewAlias(result.alias || profile.alias);
        setMessage({ type: "success", text: "New alias generated!" });
      } else {
        setMessage({ type: "error", text: result.message });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {message && (
        <div
          className={`p-4 rounded-lg border flex gap-3 ${
            message.type === "success"
              ? "bg-green-500/10 border-green-500/20"
              : "bg-red-500/10 border-red-500/20"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          )}
          <p
            className={`text-sm ${
              message.type === "success" ? "text-green-200" : "text-red-200"
            }`}
          >
            {message.text}
          </p>
        </div>
      )}

      {/* Avatar Section */}
      <div>
        <h3 className="font-semibold mb-4">Your Anonymous Avatar</h3>
        <div className="flex items-center gap-4">
          <img
            src={getAvatarUrl(profile.avatarSeed)}
            alt={profile.alias}
            className="w-20 h-20 rounded-full"
          />
          <div>
            <p className="text-sm text-gray-400">
              Your unique anonymous avatar is automatically generated and never changes.
            </p>
          </div>
        </div>
      </div>

      {/* Alias Section */}
      <div className="border-t border-gray-800 pt-8">
        <h3 className="font-semibold mb-4">Change Your Alias</h3>
        <p className="text-sm text-gray-400 mb-4">
          You can change your alias once every 24 hours
        </p>
        <div className="space-y-3">
          <Input
            value={newAlias}
            onChange={(e) => setNewAlias(e.target.value)}
            placeholder="Your new alias"
            className="bg-gray-900 border-gray-800"
            disabled={loading}
          />
          <div className="flex gap-3">
            <Button
              onClick={handleAliasChange}
              disabled={loading || newAlias === profile.alias}
              className="bg-white text-black hover:bg-gray-100"
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Alias
            </Button>
            <Button
              onClick={handleRegenerate}
              disabled={loading}
              variant="outline"
              className="border-gray-700 text-white hover:bg-gray-900"
            >
              <RotateCw className="w-4 h-4 mr-2" />
              Generate Random
            </Button>
          </div>
        </div>
      </div>

      {/* Account Info */}
      <div className="border-t border-gray-800 pt-8">
        <h3 className="font-semibold mb-4">Account Information</h3>
        <div className="space-y-2 text-sm text-gray-400">
          <p>Current Alias: <span className="text-white font-medium">{profile.alias}</span></p>
          <p>
            Account Created:{" "}
            <span className="text-white font-medium">
              {new Date(profile.createdAt).toLocaleDateString()}
            </span>
          </p>
          <p className="text-xs">Your email is securely stored and never displayed</p>
        </div>
      </div>
    </div>
  );
}