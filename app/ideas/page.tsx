'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  HeartPulse,
  Wallet,
  GraduationCap,
  Bot,
  Eye,
  Leaf,
  PenTool,
  Code2,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import type { ProjectIdea, AssessmentInput, Difficulty } from '@/lib/idea-engine';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  HeartPulse,
  Wallet,
  GraduationCap,
  Bot,
  Eye,
  Leaf,
  PenTool,
  Code2,
};

function IdeasContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [ideas, setIdeas] = useState<ProjectIdea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assessment, setAssessment] = useState<AssessmentInput | null>(null);

  useEffect(() => {
    const skills = searchParams.get('skills');
    const interests = searchParams.get('interests');
    const difficulty = searchParams.get('difficulty') as Difficulty;

    if (!skills || !interests || !difficulty) {
      router.push('/assessment');
      return;
    }

    const input: AssessmentInput = {
      skills: skills.split(',').filter(Boolean),
      interests: interests.split(',').filter(Boolean),
      difficulty,
    };
    setAssessment(input);

    const fetchIdeas = async () => {
      try {
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'generate-ideas', assessment: input }),
        });
        if (!res.ok) throw new Error('Failed to generate ideas');
        const data = await res.json();
        setIdeas(data.ideas);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Something went wrong';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchIdeas();
  }, [searchParams, router]);

  const handleSelectIdea = (idea: ProjectIdea) => {
    if (!assessment) return;
    const params = new URLSearchParams({
      title: idea.title,
      pitch: idea.elevatorPitch,
      category: idea.category,
      difficulty: idea.difficulty,
      tags: idea.tags.join(','),
      icon: idea.icon,
      skills: assessment.skills.join(','),
      interests: assessment.interests.join(','),
    });
    router.push(`/roadmap?${params.toString()}`);
  };

  const handleRegenerate = () => {
    setLoading(true);
    setError(null);
    setIdeas([]);
    fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'generate-ideas', assessment }),
    })
      .then((res) => res.json())
      .then((data) => setIdeas(data.ideas))
      .catch(() => setError('Failed to regenerate ideas'))
      .finally(() => setLoading(false));
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute inset-0 bg-glow" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" size="sm" onClick={() => router.push('/assessment')} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Edit Assessment
          </Button>
          <h1 className="text-3xl font-bold mb-2">
            Your Tailored <span className="text-gradient">Project Ideas</span>
          </h1>
          <p className="text-muted-foreground">
            {assessment && (
              <>
                Based on your skills ({assessment.skills.join(', ')}) and interests in{' '}
                {assessment.interests.join(', ')}.
              </>
            )}
          </p>
        </div>

        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="border-border/50 animate-pulse">
                <CardHeader>
                  <div className="h-10 w-10 rounded-lg bg-secondary" />
                  <div className="h-5 w-3/4 rounded bg-secondary mt-2" />
                  <div className="h-4 w-1/2 rounded bg-secondary mt-1" />
                </CardHeader>
                <CardContent>
                  <div className="h-4 w-full rounded bg-secondary mb-2" />
                  <div className="h-4 w-5/6 rounded bg-secondary mb-4" />
                  <div className="flex gap-2">
                    <div className="h-6 w-16 rounded-full bg-secondary" />
                    <div className="h-6 w-20 rounded-full bg-secondary" />
                    <div className="h-6 w-14 rounded-full bg-secondary" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <Card className="border-destructive/50">
            <CardContent className="pt-6 text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">Failed to generate ideas</p>
              <p className="text-sm text-muted-foreground mb-4">{error}</p>
              <Button onClick={handleRegenerate}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Ideas grid */}
        {!loading && !error && ideas.length > 0 && (
          <>
            <div className="flex justify-end mb-4">
              <Button variant="outline" size="sm" onClick={handleRegenerate}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Regenerate Ideas
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ideas.map((idea, i) => {
                const Icon = ICON_MAP[idea.icon] || Sparkles;
                return (
                  <motion.div
                    key={idea.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                  >
                    <Card
                      className="group h-full border-border/50 hover:border-primary/50 transition-all cursor-pointer hover:glow-primary"
                      onClick={() => handleSelectIdea(idea)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <Badge variant="outline" className="capitalize text-xs">
                            {idea.difficulty}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg leading-snug mt-3 group-hover:text-primary transition-colors">
                          {idea.title}
                        </CardTitle>
                        <CardDescription className="text-sm leading-relaxed mt-2">
                          {idea.elevatorPitch}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {idea.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          <Badge variant="outline" className="text-xs">
                            {idea.category}
                          </Badge>
                        </div>
                        <div className="flex items-center text-sm text-primary font-medium group-hover:gap-3 transition-all">
                          View Full Roadmap
                          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function IdeasPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <IdeasContent />
    </Suspense>
  );
}
