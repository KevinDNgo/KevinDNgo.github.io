import { useState, useEffect } from 'react';
import { useKV } from '@github/spark/hooks';
import ResolutionForm from '@/components/resolutions/ResolutionForm';
import ResolutionGallery from '@/components/resolutions/ResolutionGallery';
import type { Resolution } from '@/lib/types';

function App() {
  const [resolutions, setResolutions] = useKV<Resolution[]>('resolutions', []);
  const [view, setView] = useState<'gallery' | 'form' | null>(null);

  useEffect(() => {
    if (view === null && resolutions !== undefined) {
      setView(resolutions.length === 0 ? 'form' : 'gallery');
    }
  }, [resolutions, view]);

  const handleSubmit = (newResolution: Resolution) => {
    setResolutions((current) => [...(current || []), newResolution]);
    setView('gallery');
  };

  const handleAddNew = () => {
    setView('form');
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
