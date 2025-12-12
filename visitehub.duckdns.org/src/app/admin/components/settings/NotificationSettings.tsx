interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
}

interface NotificationSettingsProps {
  settings: NotificationSettings;
  onSettingsChange: (settings: NotificationSettings) => void;
}

export default function NotificationSettings({ settings, onSettingsChange }: NotificationSettingsProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Notification Preferences</h3>
        
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.email}
              onChange={(e) => onSettingsChange({ ...settings, email: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-3 text-sm text-gray-700">Email Notifications</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.push}
              onChange={(e) => onSettingsChange({ ...settings, push: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-3 text-sm text-gray-700">Push Notifications</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.sms}
              onChange={(e) => onSettingsChange({ ...settings, sms: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-3 text-sm text-gray-700">SMS Notifications</span>
          </label>
        </div>
      </div>
    </div>
  );
} 