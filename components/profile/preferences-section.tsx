'use client';

import { Bell, Globe, Moon, Sun } from 'lucide-react';
import type { Preferences, ThemePreference } from '@/hooks/page/use-profile';

interface PreferencesSectionProps {
  preferences: Preferences;
  setPreferences: React.Dispatch<React.SetStateAction<Preferences>>;
}

export function PreferencesSection({ preferences, setPreferences }: PreferencesSectionProps) {
  const handleNotificationToggle = (key: keyof Preferences['notifications']) => {
    setPreferences((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key],
      },
    }));
  };

  const handleThemeChange = (theme: ThemePreference) => {
    setPreferences((prev) => ({ ...prev, theme }));
  };

  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
      <div className="flex items-center gap-2 mb-4">
        <Bell className="w-5 h-5 text-muted-foreground" />
        <h2 className="text-xl font-bold text-card-foreground">Preferences</h2>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-card-foreground mb-3">Notifications</h3>
          <div className="space-y-3">
            {Object.entries(preferences.notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <label className="text-sm text-muted-foreground capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <button
                  type="button"
                  onClick={() =>
                    handleNotificationToggle(key as keyof Preferences['notifications'])
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                    value ? 'bg-primary' : 'bg-muted'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-card transition-transform shadow-sm ${
                      value ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <h3 className="font-semibold text-card-foreground mb-3">Theme</h3>
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => handleThemeChange('light')}
              className={`p-3 border-2 rounded-lg transition-all cursor-pointer ${
                preferences.theme === 'light'
                  ? 'border-primary bg-accent'
                  : 'border-border hover:border-muted-foreground/30'
              }`}
            >
              <Sun className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
              <p className="text-xs font-medium text-card-foreground">Light</p>
            </button>
            <button
              type="button"
              onClick={() => handleThemeChange('dark')}
              className={`p-3 border-2 rounded-lg transition-all cursor-pointer ${
                preferences.theme === 'dark'
                  ? 'border-primary bg-accent'
                  : 'border-border hover:border-muted-foreground/30'
              }`}
            >
              <Moon className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
              <p className="text-xs font-medium text-card-foreground">Dark</p>
            </button>
            <button
              type="button"
              onClick={() => handleThemeChange('system')}
              className={`p-3 border-2 rounded-lg transition-all cursor-pointer ${
                preferences.theme === 'system'
                  ? 'border-primary bg-accent'
                  : 'border-border hover:border-muted-foreground/30'
              }`}
            >
              <Globe className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
              <p className="text-xs font-medium text-card-foreground">System</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
