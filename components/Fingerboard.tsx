import React from 'react';
import { NoteData, StringName } from '../types';
import { STRING_COLORS } from '../constants';

interface FingerboardProps {
  activeNotes: NoteData[];
}

const Fingerboard: React.FC<FingerboardProps> = ({ activeNotes }) => {
  // 4 strings: G D A E
  // Represented as vertical lines
  
  // Finger positions (mocked graphical percentages from top nut)
  // 0 is open string (top)
  // 1 is approx 10% down
  // 2 is approx 20% down
  const getTopPercentage = (fingerPos: number) => {
    if (fingerPos === 0) return 3; // Just below nut
    // Simple linear approx for demo visual (logarithmic in reality)
    return 3 + (fingerPos * 12); 
  };

  const strings = [0, 1, 2, 3]; // G D A E

  return (
    <div className="relative w-full h-full bg-[#2a2a2a] rounded-lg overflow-hidden border-2 border-[#4a4a4a] shadow-inner">
      {/* Nut */}
      <div className="absolute top-0 w-full h-3 bg-[#1a1a1a] z-10 border-b border-gray-600"></div>

      {/* Fret/Tape markers (Visual guides) */}
      {[15, 27, 39, 51].map((pos, i) => (
        <div key={i} className={`absolute w-full h-1 z-0 opacity-30 ${i===0?'bg-yellow-400': i===1?'bg-red-400': i===2?'bg-blue-400':'bg-purple-400'}`} style={{ top: `${pos}%` }}></div>
      ))}

      {/* Strings */}
      <div className="absolute inset-0 flex justify-around px-4 pt-3 pb-4">
        {strings.map((strIdx) => (
          <div key={strIdx} className="relative h-full w-8 flex justify-center">
            {/* The String Line */}
            <div className="h-full w-1.5 bg-gray-400 relative">
               {/* Core string color */}
               <div className="absolute inset-x-0.5 inset-y-0 opacity-80" style={{ backgroundColor: '#e2e8f0' }}></div>
            </div>

            {/* Active Finger Indicators */}
            {activeNotes
              .filter(n => n.stringIndex === strIdx)
              .map((note, idx) => {
                const top = getTopPercentage(note.fingerPosition);
                const color = STRING_COLORS[strIdx];
                return (
                  <div 
                    key={`${note.time}-${idx}`}
                    className="absolute z-20 w-8 h-8 -ml-0 rounded-full flex items-center justify-center font-bold text-white shadow-[0_0_10px_rgba(255,255,255,0.8)] transition-all duration-100"
                    style={{ 
                      top: `${top}%`,
                      backgroundColor: color,
                      transform: 'translateY(-50%)'
                    }}
                  >
                    <span className="text-sm shadow-black drop-shadow-md">
                        {note.fingerPosition === 0 ? '0' : note.fingerPosition}
                    </span>
                    {/* Ripple effect */}
                    <div className="absolute inset-0 rounded-full animate-ping opacity-75" style={{ backgroundColor: color }}></div>
                  </div>
                );
            })}
          </div>
        ))}
      </div>

      {/* String Labels at Bottom */}
      <div className="absolute bottom-1 w-full flex justify-around px-4 text-xs font-bold text-gray-500">
         <span>G</span><span>D</span><span>A</span><span>E</span>
      </div>
    </div>
  );
};

export default Fingerboard;
