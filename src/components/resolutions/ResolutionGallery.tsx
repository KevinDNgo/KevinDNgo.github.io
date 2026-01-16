import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Sparkle, Heart, Trash } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Resolution } from '@/lib/types';

interface ResolutionGalleryProps {
  resolutions: Resolution[];
  onAddNew: () => void;
  onLike: (resolutionId: string) => void;
  onDelete: (resolutionId: string) => void;
  isAdmin: boolean;
}

export default function ResolutionGallery({ resolutions, onAddNew, onLike, onDelete, isAdmin }: ResolutionGalleryProps) {
  const [likedIds, setLikedIds] = useLocalStorage<string[]>('liked-resolutions', []);
  const [focusedId, setFocusedId] = useState<string | null>(null);

  const handleLike = (resolutionId: string) => {
    const currentLiked = likedIds || [];
    if (currentLiked.includes(resolutionId)) {
      return;
    }
    setLikedIds((current) => [...(current || []), resolutionId]);
    onLike(resolutionId);
  };

  const isLiked = (resolutionId: string) => {
    return (likedIds || []).includes(resolutionId);
  };

  const handleCardFocus = (id: string) => {
    setFocusedId(id);
  };

  const handleBackdropClick = () => {
    setFocusedId(null);
  };

  return (
    <div className="min-h-screen relative">
      <header className="fixed top-0 left-0 right-0 z-50 p-4 sm:p-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Sparkle weight="fill" className="w-6 h-6 text-primary" />
          <h1 className="font-display text-xl sm:text-2xl font-bold text-foreground">
            2026 Resolutions
          </h1>
        </div>
        <Button
          onClick={onAddNew}
          className="bg-primary/90 text-primary-foreground hover:bg-primary font-body font-semibold shadow-lg shadow-primary/25"
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
              className="bg-primary/90 text-primary-foreground hover:bg-primary font-body font-semibold"
            >
              <Plus className="mr-1" weight="bold" />
              Share Your Resolutions
            </Button>
          </div>
        </div>
      ) : (
        <div className="pt-24 pb-8 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {resolutions.map((resolution, index) => (
              <FloatingCard 
                key={resolution.id} 
                resolution={resolution} 
                index={index}
                isLiked={isLiked(resolution.id)}
                onLike={() => handleLike(resolution.id)}
                onDelete={() => onDelete(resolution.id)}
                isAdmin={isAdmin}
                isFocused={focusedId === resolution.id}
                onFocus={() => handleCardFocus(resolution.id)}
              />
            ))}
          </div>
        </div>
      )}

      <AnimatePresence>
        {focusedId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40"
            onClick={handleBackdropClick}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

interface FloatingCardProps {
  resolution: Resolution;
  index: number;
  isLiked: boolean;
  onLike: () => void;
  onDelete: () => void;
  isAdmin: boolean;
  isFocused: boolean;
  onFocus: () => void;
}

function FloatingCard({ resolution, index, isLiked, onLike, onDelete, isAdmin, isFocused, onFocus }: FloatingCardProps) {
  const { animationProps } = resolution;
  
  const rotation = animationProps.rotation * 0.5;

  return (
    <motion.div
      layout
      onClick={(e) => {
        e.stopPropagation();
        onFocus();
      }}
      animate={{
        scale: isFocused ? 1.05 : 1,
        rotate: isFocused ? 0 : rotation,
        zIndex: isFocused ? 50 : 1,
      }}
      whileHover={!isFocused ? { scale: 1.02, rotate: 0, zIndex: 10 } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      style={{
        '--duration': `${animationProps.floatDuration}s`,
        '--delay': `${index * 0.3}s`,
      } as React.CSSProperties}
      className={`cursor-pointer ${!isFocused ? 'animate-float' : ''}`}
    >
      <Card
        className={`bg-card/95 backdrop-blur-sm border-primary/10 shadow-xl transition-shadow duration-300 ${
          isFocused ? 'shadow-2xl ring-2 ring-primary/30' : 'hover:shadow-2xl'
        }`}
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
          <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between">
            <p className="font-body text-xs sm:text-sm text-card-foreground/60 italic">
              — {resolution.author || 'Anonymous'}
            </p>
            <div className="flex items-center gap-3">
              {isAdmin && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  className="flex items-center group transition-all opacity-60 hover:opacity-100"
                  title="Remove submission"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Trash weight="regular" className="w-5 h-5 text-destructive/70 group-hover:text-destructive transition-colors" />
                  </motion.div>
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onLike();
                }}
                disabled={isLiked}
                className="flex items-center gap-1 group transition-all"
              >
                <AnimatePresence mode="wait">
                  {isLiked ? (
                    <motion.div
                      key="liked"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                    >
                      <Heart weight="fill" className="w-5 h-5 text-red-500" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="not-liked"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Heart weight="regular" className="w-5 h-5 text-card-foreground/40 group-hover:text-red-400 transition-colors" />
                    </motion.div>
                  )}
                </AnimatePresence>
                <span className={`text-xs font-body font-medium transition-colors ${isLiked ? 'text-red-500' : 'text-card-foreground/40 group-hover:text-card-foreground/60'}`}>
                  {resolution.likes || 0}
                </span>
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
