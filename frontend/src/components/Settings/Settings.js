import React, { useState } from 'react';
import { FormControl } from '@mui/material';
import { ThemeSelector, LanguageSelector, NotificationSettings, PrivacySettings, CustomizationSettings } from '../components';
import { SettingsContainer, SettingsSection } from '../styles';

const Settings = () => {
  const [settings, setSettings] = useState({
    theme: 'light',
    language: 'ar',
    notifications: true,
    emailNotifications: true
  });

  const updateSettings = (updates) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      ...updates
    }));
  };

  return (
    <SettingsContainer>
      {/* الإعدادات العامة */}
      <SettingsSection title="إعدادات عامة">
        <FormControl>
          {/* المظهر */}
          <ThemeSelector
            value={settings.theme}
            onChange={(theme) => updateSettings({ theme })}
            options={[
              { value: 'light', label: 'فاتح' },
              { value: 'dark', label: 'داكن' }
            ]}
          />

          {/* اللغة */}
          <LanguageSelector
            value={settings.language}
            onChange={(language) => updateSettings({ language })}
            options={[
              { value: 'ar', label: 'العربية' },
              { value: 'en', label: 'English' }
            ]}
          />
        </FormControl>
      </SettingsSection>

      {/* إعدادات الإشعارات */}
      <SettingsSection title="الإشعارات">
        <NotificationSettings
          settings={settings}
          onUpdate={updateSettings}
        />
      </SettingsSection>

      {/* إعدادات الخصوصية */}
      <SettingsSection title="الخصوصية والأمان">
        <PrivacySettings />
      </SettingsSection>

      {/* تخصيص الواجهة */}
      <SettingsSection title="تخصيص الواجهة">
        <CustomizationSettings />
      </SettingsSection>
    </SettingsContainer>
  );
};

export default Settings; 