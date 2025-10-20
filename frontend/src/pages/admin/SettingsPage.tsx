import React from "react";
import { ProfileSettings } from "@/components/settings/ProfileSettings";
import { CompanyInfoSettings } from "@/components/settings/CompanyInfoSettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { SystemSettings } from "@/components/settings/SystemSettings";
import { BusinessSettings } from "@/components/settings/BusinessSettings";

const SettingsPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {" "}
        {/* Optional: 2-column layout */}
        <div className="space-y-6">
          <ProfileSettings />
          <NotificationSettings />
        </div>
        <div className="space-y-6">
          <CompanyInfoSettings />
          <SystemSettings />
          <BusinessSettings />
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
