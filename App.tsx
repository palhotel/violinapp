import React, { useState } from 'react';
import { ViewState, Song } from './types';
import BottomNav from './components/BottomNav';
import HomeView from './views/Home';
import DetailView from './views/Detail';
import Player from './views/Player';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);

  const handleSelectSong = (song: Song) => {
    setSelectedSong(song);
    setCurrentView(ViewState.DETAIL);
  };

  const handlePlay = () => {
    setCurrentView(ViewState.PLAYER);
  };

  const handleBack = () => {
    if (currentView === ViewState.PLAYER) {
      setCurrentView(ViewState.DETAIL);
    } else if (currentView === ViewState.DETAIL) {
      setCurrentView(ViewState.HOME);
      setSelectedSong(null);
    }
  };

  return (
    <div className="h-full w-full bg-gray-50 max-w-md mx-auto relative shadow-2xl overflow-hidden">
      {currentView === ViewState.HOME && (
        <>
          <HomeView onSelectSong={handleSelectSong} />
          <BottomNav currentView={currentView} onNavigate={setCurrentView} />
        </>
      )}

      {currentView === ViewState.DETAIL && selectedSong && (
        <DetailView 
          song={selectedSong} 
          onBack={handleBack} 
          onPlay={handlePlay}
        />
      )}

      {currentView === ViewState.PLAYER && selectedSong && (
        <Player 
          song={selectedSong} 
          onBack={handleBack} 
        />
      )}
    </div>
  );
};

export default App;
