import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash, PaperPlaneTilt, Sparkle, ArrowLeft } from '@phosphor-icons/react';
import { filterTexts } from '@/lib/profanity-filter';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import type { Resolution } from '@/lib/types';

const triggerConfetti = () => {
  const duration = 3000;
  const end = Date.now() + duration;

  const colors = ['#d4a574', '#e8c89e', '#f5deb3', '#ffd700', '#ffe4b5'];

  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors,
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };

  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors,
  });

  frame();
};

interface ResolutionFormProps {
  onSubmit: (resolution: Resolution) => void;
  onCancel?: () => void;
}

export default function ResolutionForm({ onSubmit, onCancel }: ResolutionFormProps) {
  const [resolutionTexts, setResolutionTexts] = useState<string[]>(['']);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [authorName, setAuthorName] = useState('');

  const addResolution = () => {
    if (resolutionTexts.length < 5) {
      setResolutionTexts([...resolutionTexts, '']);
    }
  };

  const removeResolution = (index: number) => {
    if (resolutionTexts.length > 1) {
      setResolutionTexts(resolutionTexts.filter((_, i) => i !== index));
    }
  };

  const updateResolution = (index: number, value: string) => {
    const updated = [...resolutionTexts];
    updated[index] = value;
    setResolutionTexts(updated);
  };

  const handleSubmit = () => {
    const validResolutions = resolutionTexts.filter((r) => r.trim().length > 0);

    if (validResolutions.length === 0) {
      toast.error('Please enter at least one resolution');
      return;
    }

    const allTexts = [...validResolutions];
    if (!isAnonymous && authorName.trim()) {
      allTexts.push(authorName);
    }

    const { hasProfanity } = filterTexts(allTexts);
    if (hasProfanity) {
      toast.error('Please keep your resolutions positive and appropriate for everyone');
      return;
    }

    const newResolution: Resolution = {
      id: crypto.randomUUID(),
      resolutions: validResolutions,
      author: isAnonymous ? null : authorName.trim() || null,
      createdAt: Date.now(),
      likes: 0,
      animationProps: {
        startY: Math.random() * 60 + 20,
        driftY: (Math.random() - 0.5) * 40,
        rotation: (Math.random() - 0.5) * 8,
        duration: Math.random() * 20 + 25,
        delay: Math.random() * -30,
        floatDuration: Math.random() * 3 + 5,
      },
    };

    onSubmit(newResolution);
    triggerConfetti();
    toast.success('Your resolutions have been shared!');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8">
      <Card className="w-full max-w-lg bg-card/95 backdrop-blur-sm border-primary/20 shadow-2xl">
        <CardHeader className="text-center pb-2">
          {onCancel && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="absolute left-4 top-4 text-card-foreground/70 hover:text-card-foreground"
            >
              <ArrowLeft className="mr-1" />
              Back
            </Button>
          )}
          <div className="flex justify-center mb-4">
            <Sparkle weight="fill" className="w-10 h-10 text-primary" />
          </div>
          <CardTitle className="font-display text-3xl sm:text-4xl font-bold text-card-foreground">
            New Year's Resolutions
          </CardTitle>
          <p className="text-card-foreground/70 font-body mt-2">
            Share your hopes and dreams for the new year
          </p>
        </CardHeader>

        <CardContent className="space-y-6 pt-4">
          <div className="space-y-3">
            <Label className="text-card-foreground font-body font-medium">
              Your Resolutions
            </Label>
            {resolutionTexts.map((text, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  id={`resolution-${index}`}
                  value={text}
                  onChange={(e) => updateResolution(index, e.target.value)}
                  placeholder={`Resolution ${index + 1}...`}
                  maxLength={150}
                  className="bg-background/50 border-border text-card-foreground placeholder:text-card-foreground/40 focus:ring-primary font-body"
                />
                {resolutionTexts.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeResolution(index)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
                  >
                    <Trash weight="bold" />
                  </Button>
                )}
              </div>
            ))}
            {resolutionTexts.length < 5 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addResolution}
                className="w-full border-dashed border-border text-card-foreground/70 hover:text-card-foreground hover:bg-background/30 font-body"
              >
                <Plus className="mr-1" weight="bold" />
                Add another resolution
              </Button>
            )}
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-background/30">
            <Label htmlFor="anonymous-switch" className="text-card-foreground font-body cursor-pointer">
              Submit anonymously
            </Label>
            <Switch
              id="anonymous-switch"
              checked={isAnonymous}
              onCheckedChange={setIsAnonymous}
            />
          </div>

          {!isAnonymous && (
            <div className="space-y-2">
              <Label htmlFor="author-name" className="text-card-foreground font-body font-medium">
                Your Name (optional)
              </Label>
              <Input
                id="author-name"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="How should we sign your resolutions?"
                maxLength={50}
                className="bg-background/50 border-border text-card-foreground placeholder:text-card-foreground/40 focus:ring-primary font-body"
              />
            </div>
          )}

          <Button
            onClick={handleSubmit}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-body font-semibold text-lg py-6 shadow-lg shadow-primary/25"
          >
            <PaperPlaneTilt className="mr-2" weight="fill" />
            Share My Resolutions
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
