import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Sparkle } from '@phosphor-icons/react';
import type { Resolution } from '@/lib/types';

interface ResolutionGalleryProps {
  resolutions: Resolution[];
  onAddNew: () => void;
}

export default function ResolutionGallery({ resolutions, onAddNew }: ResolutionGalleryProps) {
  return (
    <div className="min-h-screen relative">
      <header className="fixed top-0 left-0 right-0 z-50 p-4 sm:p-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Sparkle weight="fill" className="w-6 h-6 text-primary" />
          <h1 className="font-display text-xl sm:text-2xl font-bold text-foreground">
            2025 Resolutions
          </h1>
        </div>
        <Button
          onClick={onAddNew}
          className="bg-primary text-primary-foreground hover:bg-primary/90 font-body font-medium shadow-lg shadow-primary/25"
        >
          <Plus className="mr-1" weight="bold" />
          Add Yours
        </Button>
      </header>

      {resolutions.length === 0 ? (
        <div className="min-h-screen flex items-center justify-center p-8">
          <div className="text-center">
            <Sparkle weight="fill" className="w-16 h-16 text-primary mx-auto mb-4 opacity-60" />
            <h2 className="font-display text-2xl text-foreground/80 mb-2">
              No resolutions yet
            </h2>
            <p className="text-muted-foreground font-body mb-6">
              Be the first to share your hopes for the new year!
            </p>
            <Button
              onClick={onAddNew}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-body"
            >
              <Plus className="mr-1" weight="bold" />
              Share Your Resolutions
            </Button>
          </div>
        </div>
      ) : (
        <div className="pt-20 pb-8 px-4 min-h-screen">
          <div className="relative w-full h-[calc(100vh-6rem)]">
            {resolutions.map((resolution, index) => (
              <FloatingCard key={resolution.id} resolution={resolution} index={index} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function FloatingCard({ resolution, index }: { resolution: Resolution; index: number }) {
  const { animationProps } = resolution;
  
  const gridCols = 3;
  const gridRows = Math.ceil(12 / gridCols);
  const col = index % gridCols;
  const row = Math.floor(index / gridCols) % gridRows;
  
  const baseLeft = (col / gridCols) * 70 + 5;
  const baseTop = (row / gridRows) * 70 + 5;
  const randomOffsetX = (animationProps.rotation / 8) * 10;
  const randomOffsetY = (animationProps.driftY / 40) * 10;

  return (
    <Card
      className="absolute bg-card/95 backdrop-blur-sm border-primary/10 shadow-xl hover:shadow-2xl transition-shadow duration-300 cursor-default w-64 sm:w-72 animate-float"
      style={{
        left: `calc(${baseLeft}% + ${randomOffsetX}%)`,
        top: `calc(${baseTop}% + ${randomOffsetY}%)`,
        '--rotation': `${animationProps.rotation}deg`,
        '--duration': `${animationProps.floatDuration}s`,
        '--delay': `${index * 0.5}s`,
        transform: `rotate(${animationProps.rotation}deg)`,
      } as React.CSSProperties}
    >
      <CardContent className="p-4 sm:p-5">
        <ul className="space-y-2">
          {resolution.resolutions.map((text, i) => (
            <li key={i} className="flex items-start gap-2">
              <Sparkle weight="fill" className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span className="font-body text-sm sm:text-base text-card-foreground leading-relaxed">
                {text}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-3 pt-3 border-t border-border/50">
          <p className="font-body text-xs sm:text-sm text-card-foreground/60 italic">
            — {resolution.author || 'Anonymous'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
