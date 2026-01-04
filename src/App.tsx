import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import ResolutionForm from '@/components/resolutions/ResolutionForm';
import ResolutionGallery from '@/components/resolutions/ResolutionGallery';
import type { Resolution } from '@/lib/types';

const DATA_VERSION = 2;

function App() {
  const [resolutions, setResolutions, deleteResolutions] = useLocalStorage<Resolution[]>('resolutions', []);
  const [dataVersion, setDataVersion] = useLocalStorage<number>('data-version', 0);
  const [view, setView] = useState<'gallery' | 'form' | null>(null);
  const [isOwner] = useState(true); // Always true for standalone app

  useEffect(() => {
    if (dataVersion !== undefined && dataVersion < DATA_VERSION) {
      deleteResolutions();
      setDataVersion(DATA_VERSION);
    }
  }, [dataVersion, deleteResolutions, setDataVersion]);

  useEffect(() => {
    if (view === null && resolutions !== undefined && dataVersion === DATA_VERSION) {
      setView(resolutions.length === 0 ? 'form' : 'gallery');
    }
  }, [resolutions, view, dataVersion]);

  const handleSubmit = (newResolution: Resolution) => {
    setResolutions((current) => [...(current || []), newResolution]);
    setView('gallery');
  };

  const handleAddNew = () => {
    setView('form');
  };

  const handleLike = (resolutionId: string) => {
    setResolutions((current) => 
      (current || []).map((r) => 
        r.id === resolutionId ? { ...r, likes: (r.likes || 0) + 1 } : r
      )
    );
  };

  const handleDelete = (resolutionId: string) => {
    setResolutions((current) => 
      (current || []).filter((r) => r.id !== resolutionId)
    );
  };

  const resolvedResolutions = resolutions ?? [];

  if (view === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Sparkles />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      <Sparkles />
      {view === 'form' ? (
        <ResolutionForm 
          onSubmit={handleSubmit} 
          onCancel={resolvedResolutions.length > 0 ? () => setView('gallery') : undefined}
        />
      ) : (
        <ResolutionGallery 
          resolutions={resolvedResolutions} 
          onAddNew={handleAddNew}
          onLike={handleLike}
          onDelete={handleDelete}
          isAdmin={isOwner}
        />
      )}
    </div>
  );
}

function Sparkles() {
  const sparkles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() * 4 + 2,
    delay: Math.random() * 2,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="absolute rounded-full bg-primary/60 animate-sparkle"
          style={{
            left: `${sparkle.left}%`,
            top: `${sparkle.top}%`,
            width: sparkle.size,
            height: sparkle.size,
            animationDelay: `${sparkle.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

export default App;
