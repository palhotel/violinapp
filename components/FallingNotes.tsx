import React from 'react';
import { NoteData } from '../types';
import { STRING_COLORS } from '../constants';

interface FallingNotesProps {
  notes: NoteData[];
  currentTime: number;
  windowSize: number; // How many seconds of future notes to show
}

const FallingNotes: React.FC<FallingNotesProps> = ({ notes, currentTime, windowSize }) => {
  // Filter notes that are within the visible window [currentTime, currentTime + windowSize]
  // Or slightly passed to show them disappearing
  const visibleNotes = notes.filter(n => 
    n.time + n.duration > currentTime - 0.5 && 
    n.time < currentTime + windowSize
  );

  return (
    <div className="relative w-full h-full bg-slate-900 rounded-lg overflow-hidden border-2 border-slate-700 shadow-inner flex flex-col">
       {/* Lanes */}
       <div className="flex-1 flex relative">
          {[0, 1, 2, 3].map((lane, i) => (
             <div key={i} className="flex-1 border-r border-slate-800 last:border-r-0 relative group">
                {/* Lane Highlight on active */}
                <div className="absolute bottom-0 w-full h-20 bg-gradient-to-t from-slate-800 to-transparent opacity-50"></div>
             </div>
          ))}

          {/* Render Notes */}
          {visibleNotes.map((note, idx) => {
             // Calculate vertical position (0% at top, 100% at target line)
             // The target line is near the bottom, say 85%
             const targetLineY = 85; 
             const timeToHit = note.time - currentTime;
             
             // Map timeToHit to percentage. 
             // If timeToHit is windowSize, it's at 0%. If 0, it's at targetLineY.
             // If timeToHit is negative, it's passed targetLineY.
             
             const percentagePerSecond = targetLineY / windowSize; 
             const topPos = targetLineY - (timeToHit * percentagePerSecond);
             
             // Calculate height based on duration
             const height = note.duration * percentagePerSecond;

             if (topPos + height < 0) return null; // Fully offscreen top

             return (
                <div 
                   key={`${note.time}-${idx}`}
                   className="absolute w-[20%] rounded-md shadow-md"
                   style={{
                      left: `${2 + (note.stringIndex * 25)}%`, // Distribute across 4 lanes roughly
                      top: `${topPos}%`,
                      height: `${Math.max(height, 2)}%`, // Minimum height for visibility
                      backgroundColor: STRING_COLORS[note.stringIndex],
                      opacity: timeToHit < 0 ? 0.5 : 1, // Fade out when passed
                      zIndex: 10
                   }}
                >
                    <div className="w-full h-full relative overflow-hidden">
                        <div className="absolute inset-0 bg-white opacity-20"></div>
                        <span className="absolute bottom-1 w-full text-center text-[10px] text-white font-bold truncate px-0.5">
                            {note.fingerPosition === 0 ? '0' : note.fingerPosition}
                        </span>
                    </div>
                </div>
             )
          })}

          {/* Target Line (The "Now" line) */}
          <div className="absolute top-[85%] left-0 w-full h-1 bg-white shadow-[0_0_10px_white] z-20 opacity-80"></div>
          
          {/* Hit markers (Static at bottom) */}
          <div className="absolute top-[85%] left-0 w-full flex justify-around -mt-3">
              {[0,1,2,3].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white opacity-30"></div>
              ))}
          </div>
       </div>
    </div>
  );
};

export default FallingNotes;
