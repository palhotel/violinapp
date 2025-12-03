import React from 'react';
import { Home, Wrench, Headphones, Crown, User } from 'lucide-react';
import { ViewState } from '../types';

interface BottomNavProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, onNavigate }) => {
  const navItems = [
    { icon: Home, label: '主页', view: ViewState.HOME },
    { icon: Wrench, label: '工具', view: null }, // Placeholder
    { icon: Headphones, label: '客服', view: null, highlight: true },
    { icon: Crown, label: '会员', view: null },
    { icon: User, label: '我的', view: null },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe-area shadow-[0_-1px_6px_rgba(0,0,0,0.05)] z-50">
      <div className="flex justify-around items-end h-16 pb-2">
        {navItems.map((item, idx) => {
          const isActive = item.view === currentView;
          
          if (item.highlight) {
            return (
              <button key={idx} className="relative -top-5 flex flex-col items-center justify-center">
                 <div className="w-14 h-14 bg-rose-500 rounded-full flex items-center justify-center shadow-lg text-white mb-1">
                    <item.icon size={24} />
                 </div>
                 <span className="text-xs text-gray-500 font-medium">{item.label}</span>
              </button>
            )
          }

          return (
            <button 
              key={idx} 
              onClick={() => item.view && onNavigate(item.view)}
              className={`flex flex-col items-center justify-center w-full h-full ${isActive ? 'text-rose-500' : 'text-gray-400'}`}
            >
              <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] mt-1 font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
