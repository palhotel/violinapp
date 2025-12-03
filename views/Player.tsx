import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Play, Pause, Settings, RefreshCw, Volume2, Repeat, Timer, Music, Activity } from 'lucide-react';
import { Song } from '../types';
import { audioService } from '../services/audioService';
import Fingerboard from '../components/Fingerboard';
import FallingNotes from '../components/FallingNotes';

interface PlayerProps {
  song: Song;
  onBack: () => void;
}

const Player: React.FC<PlayerProps> = ({ song, onBack }) => {
  // Playback State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  
  // Practice Features State
  const [loopStart, setLoopStart] = useState<number | null>(null);
  const [loopEnd, setLoopEnd] = useState<number | null>(null);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdownValue, setCountdownValue] = useState(3);
  const [viewMode, setViewMode] = useState<'fingerboard' | 'rhythm'>('fingerboard');
  const [metronomeEnabled, setMetronomeEnabled] = useState(false);

  // Refs for loop
  const requestRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const playedNotesRef = useRef<Set<number>>(new Set());
  const songDuration = Math.max(...song.notes.map(n => n.time + n.duration)) + 2;

  // --- Animation Loop ---
  const animate = (time: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = time;
    const deltaTime = (time - lastTimeRef.current) / 1000;
    lastTimeRef.current = time;

    setCurrentTime(prevTime => {
      let newTime = prevTime + (deltaTime * playbackSpeed);

      // Loop Logic
      if (loopEnd !== null && loopStart !== null && newTime >= loopEnd) {
        newTime = loopStart;
        // Reset played notes for the loop section
        // We only clear notes that are AFTER the loop start to avoid re-triggering past notes if we were doing complex logic,
        // but simple clear is fine for this demo.
        playedNotesRef.current.clear();
      }

      // Check for notes to play
      song.notes.forEach((note, index) => {
        // Simple overlap check: if note start is passed and we haven't played it yet
        if (newTime >= note.time && !playedNotesRef.current.has(index)) {
           // Ensure we don't play notes that were way in the past (e.g. after a seek)
           if (newTime - note.time < 0.2 * playbackSpeed) {
              audioService.playNote(note.noteName, note.frequency || 440, note.duration / playbackSpeed);
           }
           playedNotesRef.current.add(index);
        }
      });

      // End of Song
      if (newTime >= songDuration) {
        setIsPlaying(false);
        return 0; // or songDuration to stop at end
      }
      return newTime;
    });

    if (isPlaying) {
      requestRef.current = requestAnimationFrame(animate);
    }
  };

  // --- Effects ---

  // Handle Play/Pause with Countdown
  useEffect(() => {
    if (isPlaying) {
      if (showCountdown) {
        // Countdown Logic
        let count = 3;
        setCountdownValue(3);
        const timer = setInterval(() => {
          count--;
          if (count <= 0) {
            clearInterval(timer);
            setShowCountdown(false);
            lastTimeRef.current = performance.now();
            requestRef.current = requestAnimationFrame(animate);
          } else {
            setCountdownValue(count);
          }
        }, 600); // slightly faster than second for better feel
        return () => clearInterval(timer);
      } else {
        lastTimeRef.current = performance.now();
        requestRef.current = requestAnimationFrame(animate);
      }
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }
    return () => {
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, showCountdown]); // eslint-disable-line react-hooks/exhaustive-deps

  // --- Helpers ---

  const handlePlayToggle = () => {
    if (!isPlaying) {
      // Start
      if (currentTime >= songDuration - 0.5) {
        setCurrentTime(0);
        playedNotesRef.current.clear();
      }
      setShowCountdown(true); // Always countdown on start
      setIsPlaying(true);
    } else {
      // Pause
      setIsPlaying(false);
      setShowCountdown(false);
    }
  };

  const handleLoopClick = () => {
    if (loopStart === null) {
      // Set Start
      setLoopStart(Math.max(0, currentTime));
    } else if (loopEnd === null) {
      // Set End
      if (currentTime > loopStart) {
        setLoopEnd(currentTime);
        // Automatically jump to start to preview
        setCurrentTime(loopStart);
        playedNotesRef.current.clear();
      } else {
        // Invalid, reset
        setLoopStart(null);
      }
    } else {
      // Clear
      setLoopStart(null);
      setLoopEnd(null);
    }
  };

  const formatTime = (t: number) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Note pitch mapping for sheet music (Simple heuristic for demo)
  // C4 = 0, D4 = 1, E4 = 2 (Line 1) ...
  const getNoteVerticalPos = (noteName: string) => {
    const scale = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    const octave = parseInt(noteName.slice(-1));
    const note = noteName.slice(0, -1).replace('#', ''); // ignore sharp for height
    const noteIndex = scale.indexOf(note);
    
    // Base C4 is index 0. E4 (bottom line) is index 2.
    // Absolute index
    const absIndex = (octave - 4) * 7 + noteIndex;
    
    // In our visual, let's say middle line (B4) is 50%.
    // B4 is index 6. 
    // Each step is maybe 5px.
    // Center is B4 (Index 6).
    return (6 - absIndex) * 6; // pixels offset from center
  };

  // Filter active notes for visualization
  const activeNotes = song.notes.filter(n => 
    currentTime >= n.time && currentTime < n.time + n.duration
  );

  return (
    <div className="bg-slate-900 h-full flex flex-col text-white overflow-hidden font-sans">
      
      {/* Top Bar */}
      <div className="h-12 flex items-center justify-between px-4 bg-slate-800 border-b border-slate-700 z-50">
         <button onClick={onBack} className="p-1 -ml-2 rounded-full active:bg-slate-700">
           <ChevronLeft className="text-gray-300" />
         </button>
         <div className="flex flex-col items-center">
            <span className="text-sm font-bold text-gray-200">{song.title}</span>
         </div>
         <button className="p-1 rounded-full active:bg-slate-700">
            <Settings size={20} className="text-gray-400" />
         </button>
      </div>

      {/* Sheet Music Area (Scrolling) */}
      <div className="h-40 bg-[#fdf6e3] relative overflow-hidden shadow-inner border-b-4 border-slate-800">
          <div className="absolute left-4 top-2 text-slate-400 text-[10px] font-bold z-10">SHEET MUSIC</div>
          
          {/* Staff Lines Container */}
          <div className="absolute inset-0 flex items-center justify-center">
             {/* 5 Lines */}
             <div className="w-full h-[60px] flex flex-col justify-between relative">
                {[0,1,2,3,4].map(i => <div key={i} className="w-full h-[1px] bg-slate-400"></div>)}
                
                {/* Clef */}
                <div className="absolute left-2 -top-4 w-10 h-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/e4/Treble_clef.svg')] bg-contain bg-no-repeat opacity-80"></div>
             </div>
          </div>

          {/* Scrolling Notes Layer */}
          <div className="absolute inset-0 flex items-center">
             <div 
               className="will-change-transform"
               style={{ transform: `translateX(${100 - (currentTime * 80)}px)` }} // 80px per second
             >
                <div className="relative h-0 w-[5000px]"> {/* Anchor point center */}
                  {song.notes.map((n, i) => {
                    const yOffset = getNoteVerticalPos(n.noteName);
                    return (
                       <div 
                         key={i} 
                         className={`absolute w-3 h-2.5 bg-slate-900 rounded-[50%] transform -translate-y-1/2 ${i === 0 ? 'after:content-["4/4"] after:absolute after:-left-8 after:-top-2 after:text-lg after:font-serif after:font-bold after:text-black' : ''}`}
                         style={{ 
                           left: `${n.time * 80}px`, // Horizontal pos
                           top: `${yOffset}px` // Vertical pos relative to center B4
                         }}
                       >
                         {/* Stem */}
                         <div className={`absolute w-[1px] h-8 bg-slate-900 ${yOffset > 0 ? 'bottom-1 right-0.5' : 'top-1 left-0.5'}`}></div>
                         {/* Sharp symbol */}
                         {n.noteName.includes('#') && (
                           <span className="absolute -left-3 -top-1.5 text-lg leading-none font-serif text-slate-800">♯</span>
                         )}
                       </div>
                    )
                  })}
                  
                  {/* Loop Markers on Sheet */}
                  {loopStart !== null && (
                     <div className="absolute top-[-40px] bottom-[-40px] w-0.5 border-l-2 border-dashed border-blue-500 opacity-50" style={{ left: `${loopStart * 80}px` }}>
                        <span className="absolute -top-4 -left-1 text-xs text-blue-600 font-bold">A</span>
                     </div>
                  )}
                  {loopEnd !== null && (
                     <div className="absolute top-[-40px] bottom-[-40px] w-0.5 border-l-2 border-dashed border-blue-500 opacity-50" style={{ left: `${loopEnd * 80}px` }}>
                        <span className="absolute -top-4 -left-1 text-xs text-blue-600 font-bold">B</span>
                     </div>
                  )}
                </div>
             </div>
          </div>

          {/* Playhead */}
          <div className="absolute left-[100px] top-0 bottom-0 w-0.5 bg-rose-500 z-20 shadow-[0_0_4px_rgba(244,63,94,0.6)]"></div>
      </div>

      {/* Main Visualization Area */}
      <div className="flex-1 relative bg-black/40 overflow-hidden">
          {/* View Toggle (Floating) */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex bg-slate-900/80 backdrop-blur rounded-full p-1 border border-slate-700 shadow-lg">
             <button 
               onClick={() => setViewMode('fingerboard')}
               className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 transition-all ${viewMode === 'fingerboard' ? 'bg-rose-500 text-white' : 'text-slate-400 hover:text-white'}`}
             >
                <Music size={14} /> 指法
             </button>
             <button 
               onClick={() => setViewMode('rhythm')}
               className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 transition-all ${viewMode === 'rhythm' ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-white'}`}
             >
                <Activity size={14} /> 节奏
             </button>
          </div>

          {/* Content */}
          <div className="w-full h-full relative">
            {viewMode === 'fingerboard' ? (
                <Fingerboard activeNotes={activeNotes} />
            ) : (
                <FallingNotes notes={song.notes} currentTime={currentTime} windowSize={2.5} />
            )}
          </div>

          {/* Countdown Overlay */}
          {showCountdown && (
            <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm animate-in fade-in">
                <div className="text-8xl font-black text-white scale-150 animate-pulse drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                    {countdownValue}
                </div>
            </div>
          )}
      </div>

      {/* Bottom Controls Area */}
      <div className="bg-slate-900 border-t border-slate-800 pb-safe-area shadow-[0_-5px_20px_rgba(0,0,0,0.3)] z-40">
         
         {/* Timeline */}
         <div className="flex items-center gap-3 px-4 py-2 text-[10px] text-slate-400 font-mono">
            <span>{formatTime(currentTime)}</span>
            <div 
              className="flex-1 h-8 flex items-center cursor-pointer group"
              onClick={(e) => {
                 const rect = e.currentTarget.getBoundingClientRect();
                 const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                 const newTime = pct * songDuration;
                 setCurrentTime(newTime);
                 playedNotesRef.current.clear();
                 // If paused, we just seek. If playing, it continues from there.
              }}
            >
               <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden relative group-hover:h-2 transition-all">
                  <div 
                    className="absolute top-0 bottom-0 left-0 bg-rose-500 rounded-full"
                    style={{ width: `${(currentTime / songDuration) * 100}%` }}
                  ></div>
                  
                  {/* Loop Range Highlight */}
                  {loopStart !== null && (
                     <div 
                       className="absolute top-0 bottom-0 bg-blue-500/30 border-l border-blue-500"
                       style={{ 
                         left: `${(loopStart / songDuration) * 100}%`,
                         width: loopEnd 
                            ? `${((loopEnd - loopStart) / songDuration) * 100}%` 
                            : '2px' // marker if only start is set
                       }}
                     ></div>
                  )}
               </div>
            </div>
            <span>{formatTime(songDuration)}</span>
         </div>

         {/* Main Controls */}
         <div className="flex items-center justify-between px-6 pb-6 pt-2">
            
            {/* Speed / Metronome Group */}
            <div className="flex gap-4">
                <button 
                  onClick={() => setMetronomeEnabled(!metronomeEnabled)}
                  className={`flex flex-col items-center gap-1 ${metronomeEnabled ? 'text-blue-400' : 'text-slate-500'}`}
                >
                   <Timer size={20} />
                   <span className="text-[9px]">节拍器</span>
                </button>
                
                <div className="relative group">
                    <button 
                      className="flex flex-col items-center gap-1 text-slate-500 active:text-white"
                      onClick={() => setPlaybackSpeed(s => s === 1 ? 0.5 : s === 0.5 ? 1.5 : 1)}
                    >
                      <RefreshCw size={20} className={playbackSpeed !== 1 ? 'text-green-400' : ''} />
                      <span className="text-[9px]">{playbackSpeed}x</span>
                    </button>
                </div>
            </div>

            {/* Play Button */}
            <button 
              onClick={handlePlayToggle}
              className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-500 to-orange-500 flex items-center justify-center text-white shadow-[0_0_15px_rgba(244,63,94,0.5)] active:scale-95 transition-transform"
            >
               {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
            </button>

            {/* Loop / View Group */}
            <div className="flex gap-4">
               <button 
                  onClick={handleLoopClick}
                  className={`flex flex-col items-center gap-1 ${loopStart !== null ? 'text-blue-400' : 'text-slate-500'}`}
                >
                   <Repeat size={20} />
                   <span className="text-[9px]">
                      {loopStart === null ? 'AB循环' : loopEnd === null ? '定点B' : '清除'}
                   </span>
                </button>

                <button 
                   className="flex flex-col items-center gap-1 text-slate-500"
                >
                   <Volume2 size={20} />
                   <span className="text-[9px]">音量</span>
                </button>
            </div>

         </div>
      </div>
    </div>
  );
};

export default Player;