import React, { useState } from 'react';
import { Bell, CheckCircle2, RefreshCw, Shield, Globe, Coins, WifiOff } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Currency, Language } from '../../types';

interface HeaderProps {
  onOpenNotifications: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNotifications }) => {
  const {
    profile,
    t,
    language,
    setLanguage,
    currency,
    setCurrency,
    syncNow,
    notifications,
    setIsLocked,
    confirmAction,
  } = useApp();

  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false);

  const handleLock = () => {
    confirmAction({
      title: language === 'fr' ? 'Verrouiller l’application' : 'Lock Application',
      description:
        language === 'fr'
          ? 'Voulez-vous verrouiller l’application maintenant ? Vous devrez entrer votre code PIN pour accéder.'
          : 'Do you want to lock the application now? You will need your PIN to unlock.',
      variant: 'primary',
      confirmLabel: language === 'fr' ? 'Verrouiller' : 'Lock Now',
      onConfirm: () => setIsLocked(true),
    });
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('good_morning');
    if (hour < 18) return t('good_afternoon');
    return t('good_evening');
  };

  const syncStatus = profile.syncStatus;

  return (
    <header className="sticky top-0 z-30 bg-[#0c0f17]/90 backdrop-blur-md border-b border-white/10 px-2.5 sm:px-4 py-2.5 sm:py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
        {/* Left: Greeting & User Name */}
        <div className="flex items-center space-x-2.5 sm:space-x-3 shrink-0">
          <div className="relative">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
              {profile.name.charAt(0)}
            </div>
            {/* Sync status badge dot */}
            <div
              onClick={syncNow}
              title="Tap to sync local storage"
              className="absolute -bottom-0.5 -right-0.5 p-0.5 rounded-full bg-[#0c0f17] cursor-pointer"
            >
              {syncStatus === 'syncing' ? (
                <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              ) : syncStatus === 'synced' ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <WifiOff className="w-3.5 h-3.5 text-gray-400" />
              )}
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] sm:text-xs font-medium text-emerald-400 uppercase tracking-wider">
                {getGreeting()}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <h1 className="text-sm sm:text-base font-semibold text-white tracking-tight max-w-[110px] sm:max-w-none truncate">
              {profile.name.split(' ')[0]}
            </h1>
          </div>
        </div>

        {/* Right Actions: Lang, Currency, Lock, Notification Bell */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          {/* Language Toggle */}
          <div className="relative">
            <button
              onClick={() => {
                setShowLangMenu(!showLangMenu);
                setShowCurrencyMenu(false);
              }}
              className="flex items-center space-x-1 px-2 sm:px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white font-medium transition-colors"
              title="Switch English / French"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>{language.toUpperCase()}</span>
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-28 rounded-xl bg-[#141a29] border border-white/10 shadow-2xl py-1 z-50">
                {(['en', 'fr'] as Language[]).map(lang => (
                  <button
                    key={lang}
                    onClick={() => {
                      setLanguage(lang);
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs font-medium flex items-center justify-between ${
                      language === lang ? 'text-emerald-400 bg-white/5' : 'text-gray-300 hover:bg-white/5'
                    }`}
                  >
                    <span>{lang === 'en' ? 'English' : 'Français'}</span>
                    {language === lang && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Currency Toggle */}
          <div className="relative">
            <button
              onClick={() => {
                setShowCurrencyMenu(!showCurrencyMenu);
                setShowLangMenu(false);
              }}
              className="flex items-center space-x-1 px-2 sm:px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white font-medium transition-colors"
              title="Change Currency (XAF / EUR / USD)"
            >
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span>{currency}</span>
            </button>

            {showCurrencyMenu && (
              <div className="absolute right-0 mt-2 w-32 rounded-xl bg-[#141a29] border border-white/10 shadow-2xl py-1 z-50">
                {(['XAF', 'EUR', 'USD'] as Currency[]).map(curr => (
                  <button
                    key={curr}
                    onClick={() => {
                      setCurrency(curr);
                      setShowCurrencyMenu(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs font-medium flex items-center justify-between ${
                      currency === curr ? 'text-emerald-400 bg-white/5' : 'text-gray-300 hover:bg-white/5'
                    }`}
                  >
                    <span>{curr === 'XAF' ? 'XAF (FCFA)' : curr}</span>
                    {currency === curr && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Lock App */}
          <button
            onClick={handleLock}
            className="p-1.5 sm:p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-colors"
            title={t('lock_app_now')}
          >
            <Shield className="w-4 h-4 text-emerald-400" />
          </button>

          {/* Notification Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-1.5 sm:p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4 text-white" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
