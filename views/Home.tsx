import React from 'react';
import { Search, Menu, Eye, Heart } from 'lucide-react';
import { CATEGORIES, MOCK_SONGS } from '../constants';
import { Song, ViewState } from '../types';

interface HomeViewProps {
  onSelectSong: (song: Song) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ onSelectSong }) => {
  return (
    <div className="h-full overflow-y-auto bg-gray-50 pb-20 no-scrollbar">
      {/* Header */}
      <header className="sticky top-0 bg-white/90 backdrop-blur-md z-40 px-4 py-3 shadow-sm flex items-center justify-between">
        <div className="flex items-end gap-3">
          <h1 className="text-2xl font-bold text-blue-600">曲谱</h1>
          <span className="text-base text-slate-500 font-medium">课堂</span>
          <span className="text-base text-slate-500 font-medium">商城</span>
        </div>
        <div className="flex gap-3 text-slate-600">
          <Search size={24} />
          <Menu size={24} />
        </div>
      </header>

      {/* Categories Grid */}
      <section className="p-4">
        <div className="flex items-center justify-between mb-2">
            <h2 className="font-bold text-slate-800">合集、专辑</h2>
            <span className="text-gray-400 text-xs">...</span>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {CATEGORIES.map((cat) => (
            <div key={cat.id} className="flex flex-col items-center gap-1 group cursor-pointer">
              <div className={`w-16 h-16 rounded-xl ${cat.color} shadow-lg shadow-gray-200 flex items-center justify-center text-white text-xs font-bold transition-transform group-active:scale-95`}>
                {cat.name.substring(0, 2)}
              </div>
              <span className="text-xs text-slate-600">{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Lists */}
      <section className="mt-2">
        <div className="px-4 py-2 flex items-center justify-between bg-gradient-to-r from-blue-50 to-white">
           <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2">
             <span className="w-1 h-5 bg-blue-500 rounded-full"></span>
             华语精选
           </h2>
           <span className="text-gray-400 text-xs">...</span>
        </div>
        
        <div className="px-4 space-y-3 mt-2">
          {MOCK_SONGS.slice(0, 2).map((song) => (
             <div 
                key={song.id} 
                onClick={() => onSelectSong(song)}
                className="bg-white rounded-xl p-3 flex gap-3 shadow-sm border border-slate-100 active:bg-slate-50 transition-colors"
            >
                <img src={song.coverUrl} alt={song.title} className="w-16 h-16 rounded-lg object-cover bg-slate-200" />
                <div className="flex-1 flex flex-col justify-between">
                   <div>
                       <h3 className="font-bold text-slate-800 text-sm line-clamp-1">{song.title}</h3>
                       <p className="text-xs text-slate-400 mt-0.5">{song.composer}</p>
                   </div>
                   <div className="flex justify-between items-end">
                       <div className="flex gap-3 text-[10px] text-slate-400">
                          <span className="flex items-center gap-1"><Eye size={10} /> {song.views}</span>
                          <span className="flex items-center gap-1"><Heart size={10} /> {song.likes}</span>
                       </div>
                       <div className="flex gap-1">
                           <span className="px-1.5 py-0.5 bg-orange-100 text-orange-600 rounded text-[10px]">指法</span>
                           <span className="px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded text-[10px]">伴奏</span>
                       </div>
                   </div>
                </div>
             </div>
          ))}
        </div>
      </section>

      <section className="mt-6 mb-10">
        <div className="px-4 py-2 flex items-center justify-between bg-gradient-to-r from-purple-50 to-white">
           <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2">
             <span className="w-1 h-5 bg-purple-500 rounded-full"></span>
             欧美经典
           </h2>
           <span className="text-gray-400 text-xs">...</span>
        </div>
        <div className="px-4 mt-2 grid grid-cols-2 gap-3">
             {MOCK_SONGS.slice(2, 4).map(song => (
                <div key={song.id} onClick={() => onSelectSong(song)} className="bg-white p-2 rounded-xl shadow-sm border border-slate-100 active:scale-95 transition-transform">
                    <div className="relative aspect-square rounded-lg overflow-hidden mb-2">
                        <img src={song.coverUrl} className="w-full h-full object-cover" />
                        <div className="absolute bottom-0 right-0 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded-tl-md">
                           {song.difficulty}级
                        </div>
                    </div>
                    <h3 className="font-bold text-sm text-slate-800 line-clamp-1">{song.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-1">{song.composer}</p>
                </div>
             ))}
        </div>
      </section>
    </div>
  );
};

export default HomeView;