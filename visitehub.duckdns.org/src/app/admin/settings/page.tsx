'use client';

import { useState } from 'react';
import { SettingsTabs, GeneralSettings, NotificationSettings, SecuritySettings, DisplaySettings } from '../components';

interface Settings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  phoneNumber: string;
  address: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  security: {
    twoFactorAuth: boolean;
    sessionTimeout: number;
    passwordExpiry: number;
  };
  display: {
    theme: string;
    language: string;
    timezone: string;
  };
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<Settings>({
    siteName: 'VisiteHub',
    siteDescription: 'Your trusted partner in real estate',
    contactEmail: 'admin@visitehub.dz',
    phoneNumber: '+1 (555) 123-4567',
    address: '123 Main Street, City, State 12345',
    notifications: {
      email: true,
      push: false,
      sms: true
    },
    security: {
      twoFactorAuth: true,
      sessionTimeout: 30,
      passwordExpiry: 90
    },
    display: {
      theme: 'light',
      language: 'en',
      timezone: 'UTC'
    }
  });

  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    alert('Settings saved successfully!');
  };

  const updateSettings = (section: keyof Settings, key: string, value: unknown) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as Record<string, unknown>),
        [key]: value
      }
    }));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <GeneralSettings
            settings={{
              siteName: settings.siteName,
              siteDescription: settings.siteDescription,
              contactEmail: settings.contactEmail,
              phoneNumber: settings.phoneNumber,
              address: settings.address
            }}
            onSettingsChange={(generalSettings) => {
              setSettings({
                ...settings,
                ...generalSettings
              });
            }}
          />
        );
      case 'notifications':
        return (
          <NotificationSettings
            settings={settings.notifications}
            onSettingsChange={(notificationSettings) => {
              updateSettings('notifications', 'email', notificationSettings.email);
              updateSettings('notifications', 'push', notificationSettings.push);
              updateSettings('notifications', 'sms', notificationSettings.sms);
            }}
          />
        );
      case 'security':
        return (
          <SecuritySettings
            settings={settings.security}
            onSettingsChange={(securitySettings) => {
              updateSettings('security', 'twoFactorAuth', securitySettings.twoFactorAuth);
              updateSettings('security', 'sessionTimeout', securitySettings.sessionTimeout);
              updateSettings('security', 'passwordExpiry', securitySettings.passwordExpiry);
            }}
          />
        );
      case 'display':
        return (
          <DisplaySettings
            settings={settings.display}
            onSettingsChange={(displaySettings) => {
              updateSettings('display', 'theme', displaySettings.theme);
              updateSettings('display', 'language', displaySettings.language);
              updateSettings('display', 'timezone', displaySettings.timezone);
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your application settings and preferences</p>
      </div>

      {/* Tabs */}
      <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {renderTabContent()}
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
} 