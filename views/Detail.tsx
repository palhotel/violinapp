import React from 'react';
import { ChevronLeft, Eye, Heart, Music2, FileText, PlayCircle } from 'lucide-react';
import { Song, ViewState } from '../types';

interface DetailViewProps {
  song: Song;
  onBack: () => void;
  onPlay: () => void;
}

const DetailView: React.FC<DetailViewProps> = ({ song, onBack, onPlay }) => {
  return (
    <div className="bg-white min-h-screen pb-safe-area flex flex-col">
      {/* Navbar */}
      <div className="sticky top-0 bg-white z-10 px-4 py-3 flex items-center gap-4 border-b border-gray-100">
        <button onClick={onBack} className="p-1 -ml-2 rounded-full active:bg-gray-100">
          <ChevronLeft size={28} className="text-slate-700" />
        </button>
        <h1 className="text-lg font-bold text-slate-800">曲谱详情</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {/* Hero Image */}
        <div className="relative aspect-square rounded-2xl overflow-hidden shadow-xl mb-6">
           <img src={song.coverUrl} alt={song.title} className="w-full h-full object-cover" />
           <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
           <div className="absolute bottom-4 left-4 text-white">
              <h1 className="text-2xl font-bold">{song.title}</h1>
              <p className="opacity-90">{song.subtitle}</p>
           </div>
        </div>

        {/* Info */}
        <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900 mb-1">{song.title} ({song.subtitle || '小提琴版'})</h2>
            <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
                <span className="bg-slate-100 px-2 py-0.5 rounded text-xs">{song.composer}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Eye size={12}/> {song.views}</span>
                <span className="flex items-center gap-1"><Heart size={12}/> {song.likes}</span>
            </div>
            
            <p className="text-sm text-slate-600 leading-relaxed">
              《{song.title}》{song.subtitle ? `（${song.subtitle}）` : ''} 是一首非常适合初学者和进阶练习的曲目。本谱包含了完整的指法标记和弓法提示，帮助你更好地掌握音准和情感表达。
            </p>
        </div>

        {/* Mock Preview Sheet */}
        <div className="border border-slate-200 rounded-lg p-2 bg-slate-50 mb-6 opacity-60">
            <div className="w-full h-32 flex items-center justify-center text-slate-400 text-xs">
                (预览乐谱)
            </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-20">
           <button className="flex items-center justify-center gap-2 py-3 rounded-lg bg-green-100 text-green-700 font-bold text-sm">
              <Music2 size={16} /> 免费五线谱
           </button>
           <button className="flex items-center justify-center gap-2 py-3 rounded-lg bg-green-100 text-green-700 font-bold text-sm">
              <FileText size={16} /> 免费PDF
           </button>
           <button className="flex items-center justify-center gap-2 py-3 rounded-lg bg-yellow-400/20 text-yellow-700 font-bold text-sm col-span-1">
               VIP 指法五线谱
           </button>
           <button className="flex items-center justify-center gap-2 py-3 rounded-lg bg-yellow-400/20 text-yellow-700 font-bold text-sm col-span-1">
               VIP 指法PDF
           </button>
           
           <button 
             onClick={onPlay}
             className="col-span-2 py-4 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 text-white font-bold text-lg shadow-lg shadow-rose-200 active:scale-95 transition-all flex items-center justify-center gap-2"
           >
               <PlayCircle fill="currentColor" className="text-white/20" />
               AI 指法陪练
           </button>
        </div>
      </div>
    </div>
  );
};

export default DetailView;
