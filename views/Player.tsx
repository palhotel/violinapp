import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Play, Pause, Settings, RefreshCw, Volume2, Rewind } from 'lucide-react';
import { Song, NoteData } from '../types';
import { audioService } from '../services/audioService';
import Fingerboard from '../components/Fingerboard';
import FallingNotes from '../components/FallingNotes';

interface PlayerProps {
  song: Song;
  onBack: () => void;
}

const Player: React.FC<PlayerProps> = ({ song, onBack }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  
  const requestRef = useRef<number>();
  const startTimeRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const playedNotesRef = useRef<Set<number>>(new Set());

  const duration = Math.max(...song.notes.map(n => n.time + n.duration)) + 2;

  // Animation Loop
  const animate = (time: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = time;
    const deltaTime = (time - lastTimeRef.current) / 1000;
    lastTimeRef.current = time;

    setCurrentTime(prevTime => {
      const newTime = prevTime + (deltaTime * playbackSpeed);
      
      // Check for notes to play
      song.notes.forEach((note, index) => {
        // Trigger sound slightly before visual hit or exactly on time
        if (newTime >= note.time && !playedNotesRef.current.has(index)) {
           // Play sound
           audioService.playNote(note.noteName, note.frequency || 440, note.duration / playbackSpeed);
           playedNotesRef.current.add(index);
        }
      });

      if (newTime >= duration) {
        setIsPlaying(false);
        return 0;
      }
      return newTime;
    });

    if (isPlaying) {
      requestRef.current = requestAnimationFrame(animate);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = performance.now();
      requestRef.current = requestAnimationFrame(animate);
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }
    return () => {
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, playbackSpeed]); // eslint-disable-line react-hooks/exhaustive-deps

  const togglePlay = () => {
    if (!isPlaying && currentTime >= duration - 0.5) {
        // Restart if at end
        setCurrentTime(0);
        playedNotesRef.current.clear();
    }
    setIsPlaying(!isPlaying);
  };

  const reset = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    playedNotesRef.current.clear();
  };

  // Determine active notes for visualizer
  const activeNotes = song.notes.filter(n => 
    currentTime >= n.time && currentTime < n.time + n.duration
  );

  return (
    <div className="bg-slate-800 h-screen flex flex-col overflow-hidden text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-slate-900 border-b border-slate-700 z-20">
        <button onClick={onBack} className="p-1">
          <ChevronLeft className="text-white" />
        </button>
        <div className="text-center">
            <h1 className="text-sm font-bold">{song.title}</h1>
            <p className="text-[10px] text-slate-400">{song.composer}</p>
        </div>
        <button className="p-1">
            <Settings size={20} className="text-slate-400" />
        </button>
      </header>

      {/* Main Visualizer Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left: Falling Notes (Rhythm) */}
        <div className="w-1/2 h-full p-2 border-r border-slate-700 bg-black/20">
           <div className="absolute top-2 left-2 z-10 bg-slate-800/80 px-2 py-1 rounded text-xs text-slate-400 font-mono">
             RHYTHM
           </div>
           <FallingNotes notes={song.notes} currentTime={currentTime} windowSize={3} />
        </div>

        {/* Right: Fingerboard (Intonation) */}
        <div className="w-1/2 h-full p-2 bg-[#222]">
           <div className="absolute top-2 right-2 z-10 bg-slate-800/80 px-2 py-1 rounded text-xs text-slate-400 font-mono">
             INTONATION
           </div>
           <Fingerboard activeNotes={activeNotes} />
        </div>
      </div>

      {/* Playback Controls */}
      <div className="h-48 bg-white text-slate-800 rounded-t-2xl shadow-2xl relative z-30 flex flex-col">
         {/* Progress Bar */}
         <div className="w-full h-1 bg-gray-200 cursor-pointer" onClick={(e) => {
             const rect = e.currentTarget.getBoundingClientRect();
             const pct = (e.clientX - rect.left) / rect.width;
             setCurrentTime(pct * duration);
             playedNotesRef.current.clear(); // Simply clear for demo, ideally only future notes
         }}>
            <div className="h-full bg-rose-500 relative transition-all duration-100 ease-linear" style={{ width: `${(currentTime / duration) * 100}%` }}>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-rose-500 rounded-full shadow"></div>
            </div>
         </div>

         {/* Sheet Music Strip (Static Mock) */}
         <div className="flex-1 overflow-hidden relative bg-slate-50 border-b border-gray-100">
             <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white to-transparent z-10"></div>
             <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent z-10"></div>
             
             {/* Scrolling container simulation */}
             <div 
                className="flex items-center h-full px-10 transition-transform duration-100 ease-linear"
                style={{ transform: `translateX(-${currentTime * 50}px)` }}
             >
                 {/* Mock Staves */}
                 <div className="flex relative items-center h-20 w-[2000px] bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Music_staff.svg/2560px-Music_staff.svg.png')] bg-repeat-x bg-contain opacity-50"></div>
                 {/* Mock Notes on Staff */}
                 {song.notes.map((n, i) => (
                    <div 
                        key={i} 
                        className="absolute w-4 h-4 rounded-full bg-black"
                        style={{ left: `${n.time * 50 + 40}px`, top: '40%' }} // Simplified position
                    >
                         <div className="w-0.5 h-8 bg-black absolute bottom-1 right-0"></div>
                    </div>
                 ))}
             </div>
             
             {/* Cursor */}
             <div className="absolute left-10 top-0 bottom-0 w-0.5 bg-rose-500 z-20"></div>
         </div>

         {/* Controls Row */}
         <div className="h-20 px-6 flex items-center justify-between">
             <div className="flex items-center gap-4">
                 <button onClick={reset}><RefreshCw size={20} className="text-slate-400" /></button>
                 <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                    <span>速度</span>
                    <input 
                        type="range" min="0.5" max="1.5" step="0.1" 
                        value={playbackSpeed}
                        onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                        className="w-16 accent-rose-500"
                    />
                    <span>{playbackSpeed}x</span>
                 </div>
             </div>

             <button 
                onClick={togglePlay}
                className="w-14 h-14 bg-rose-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-rose-200 active:scale-95 transition-transform"
             >
                {isPlaying ? <Pause fill="currentColor" /> : <Play fill="currentColor" className="ml-1" />}
             </button>

             <div className="flex items-center gap-4">
                <button><Volume2 size={20} className="text-slate-400" /></button>
                <button><Settings size={20} className="text-slate-400" /></button>
             </div>
         </div>
      </div>
    </div>
  );
};

export default Player;
