import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Bell, CheckCircle2, Sparkles, AlertTriangle, Users, Zap } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MainTab } from '../../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, onClose }) => {
  const {
    t,
    language,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setMainTab,
    confirmAction,
  } = useApp();

  if (!isOpen) return null;

  const handleMarkAllRead = () => {
    confirmAction({
      title: language === 'fr' ? 'Marquer tout comme lu' : 'Mark All as Read',
      description:
        language === 'fr'
          ? 'Voulez-vous marquer toutes vos notifications comme lues ?'
          : 'Do you want to mark all your notifications as read?',
      variant: 'primary',
      confirmLabel: language === 'fr' ? 'Confirmer' : 'Confirm',
      onConfirm: () => {
        markAllNotificationsAsRead();
      },
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md rounded-3xl bg-[#141a29] border border-white/10 p-5 shadow-2xl max-h-[80vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">Notifications</h3>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
              >
                Mark all read
              </button>
              <button
                onClick={onClose}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {notifications.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-8">No notifications</p>
            ) : (
              notifications.map(item => {
                const title = language === 'fr' ? item.titleFr || item.title : item.title;
                const message = language === 'fr' ? item.messageFr || item.message : item.message;

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      markNotificationAsRead(item.id);
                      if (item.targetScreen) {
                        setMainTab(item.targetScreen as MainTab);
                        onClose();
                      }
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      !item.read
                        ? 'bg-white/10 border-emerald-500/50 text-white'
                        : 'bg-white/5 border-white/10 text-gray-400 opacity-70'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <span className="text-xs font-bold text-white">{title}</span>
                      <span className="text-[10px] text-gray-400">{item.date}</span>
                    </div>
                    <p className="text-xs leading-relaxed">{message}</p>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
