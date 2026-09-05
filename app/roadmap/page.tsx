'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase/client';
import { toast } from '@/hooks/use-toast';
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  Sparkles,
  Layers,
  Code2,
  Map,
  Calendar,
  Briefcase,
  Save,
  FileDown,
  CheckCircle2,
  Trophy,
  AlertTriangle,
  Target,
  Rocket,
  Lightbulb,
  HeartPulse,
  Wallet,
  GraduationCap,
  Bot,
  Eye,
  Leaf,
  PenTool,
  Wand2,
} from 'lucide-react';
import type { FullProject, AssessmentInput, Difficulty, Roadmap, ProjectIdea } from '@/lib/idea-engine';
import { projectToMarkdown } from '@/lib/idea-engine';

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

// Tech stack layer icons
const LAYER_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  frontend: Layers,
  backend: Code2,
  database: Briefcase,
  'ai / ml': Brain_Icon,
  'ai / nlp': Brain_Icon,
  'ai / logic': Brain_Icon,
  'ai / cv': Eye,
  analytics: Trophy,
  integrations: Wand2,
  'iot / hardware': Bot,
  infrastructure: Map,
};

function Brain_Icon({ className }: { className?: string }) {
  return <Sparkles className={className} />;
}

function RoadmapSkeleton() {
  return (
    <div className="w-full max-w-2xl space-y-4">
      {/* Header skeleton */}
      <div className="flex items-center gap-3 animate-pulse">
        <div className="h-12 w-12 rounded-xl bg-secondary" />
        <div className="flex-1 space-y-2">
          <div className="h-5 w-3/4 rounded bg-secondary" />
          <div className="h-3 w-1/2 rounded bg-secondary" />
        </div>
      </div>
      {/* Tab bar skeleton */}
      <div className="flex gap-2 animate-pulse">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-9 flex-1 rounded-lg bg-secondary" style={{ animationDelay: `${i * 100}ms` }} />
        ))}
      </div>
      {/* Content skeletons - mimics roadmap being typed out */}
      {[1, 2, 3].map((card) => (
        <div key={card} className="rounded-lg border border-border/30 bg-secondary/20 p-5 space-y-3">
          <div className="flex items-center gap-2 animate-pulse">
            <div className="h-5 w-5 rounded bg-secondary" />
            <div className="h-4 w-32 rounded bg-secondary" style={{ animationDelay: `${card * 150}ms` }} />
          </div>
          {[1, 2, 3].map((line) => (
            <div
              key={line}
              className="h-3 rounded bg-secondary animate-pulse"
              style={{
                width: `${85 - line * 8}%`,
                animationDelay: `${(card * 150) + (line * 80)}ms`,
              }}
            />
          ))}
          <div className="flex gap-2 pt-1">
            {[1, 2, 3].map((badge) => (
              <div
                key={badge}
                className="h-6 w-20 rounded-full bg-secondary animate-pulse"
                style={{ animationDelay: `${(card * 150) + (badge * 100)}ms` }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function RoadmapContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [project, setProject] = useState<FullProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [alreadySaved, setAlreadySaved] = useState(false);

  useEffect(() => {
    const mode = searchParams.get('mode');
    const difficulty = searchParams.get('difficulty') as Difficulty;
    const skills = searchParams.get('skills');

    // ---- Mentor mode ----
    if (mode === 'mentor') {
      const problem = searchParams.get('problem');
      if (!problem || !skills || !difficulty) {
        router.push('/assessment');
        return;
      }

      const fetchMentorRoadmap = async () => {
        try {
          const res = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'mentor-idea',
              mentorInput: {
                problemStatement: problem,
                skills: skills.split(',').filter(Boolean),
                difficulty,
              },
            }),
          });
          if (!res.ok) throw new Error('Failed to generate roadmap');
          const data = await res.json();
          setProject(data.project);
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Something went wrong';
          setError(msg);
        } finally {
          setLoading(false);
        }
      };
      fetchMentorRoadmap();
      return;
    }

    // ---- Generate mode (existing flow) ----
    const title = searchParams.get('title');
    const pitch = searchParams.get('pitch');
    const category = searchParams.get('category');
    const tags = searchParams.get('tags');
    const icon = searchParams.get('icon');
    const interests = searchParams.get('interests');

    if (!title || !skills || !interests || !difficulty) {
      router.push('/assessment');
      return;
    }

    const idea: ProjectIdea = {
      id: 'temp',
      title,
      elevatorPitch: pitch || '',
      category: category || '',
      difficulty,
      tags: tags ? tags.split(',') : [],
      icon: icon || 'Sparkles',
    };

    const assessment: AssessmentInput = {
      skills: skills.split(',').filter(Boolean),
      interests: interests.split(',').filter(Boolean),
      difficulty,
    };

    const fetchRoadmap = async () => {
      try {
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'generate-roadmap', idea, assessment }),
        });
        if (!res.ok) throw new Error('Failed to generate roadmap');
        const data = await res.json();
        setProject(data.project);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Something went wrong';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmap();
  }, [searchParams, router]);

  const isMentorMode = searchParams.get('mode') === 'mentor';

  const handleSave = async () => {
    if (!project) return;
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Create an account to save your project roadmap.',
        variant: 'destructive',
      });
      router.push('/auth/sign-up');
      return;
    }

    setSaving(true);
    try {
      const { error: saveError } = await supabase.from('saved_projects').insert({
        title: project.title,
        elevator_pitch: project.elevatorPitch,
        difficulty: project.difficulty,
        skills: project.assessment.skills,
        interests: project.assessment.interests,
        roadmap: project.roadmap as unknown as Record<string, unknown>,
      });

      if (saveError) throw saveError;
      setAlreadySaved(true);
      toast({ title: 'Project saved!', description: 'Find it in your dashboard anytime.' });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to save';
      toast({ title: 'Save failed', description: msg, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleExportMarkdown = () => {
    if (!project) return;
    const markdown = projectToMarkdown(project);
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Exported!', description: 'Markdown file downloaded.' });
  };

  const handleExportPDF = () => {
    if (!project) return;
    const markdown = projectToMarkdown(project);
    const html = `<html><head><style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; color: #1a1a2e; line-height: 1.6; }
      h1 { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
      h2 { color: #1e293b; margin-top: 30px; }
      h3 { color: #475569; }
      table { border-collapse: collapse; width: 100%; margin: 20px 0; }
      th, td { border: 1px solid #e2e8f0; padding: 8px 12px; text-align: left; }
      th { background: #f1f5f9; font-weight: bold; }
      code { background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-size: 14px; }
      ul, ol { padding-left: 20px; }
      blockquote { border-left: 4px solid #2563eb; margin: 20px 0; padding: 10px 20px; background: #f8fafc; }
      strong { color: #1e293b; }
      hr { border: none; border-top: 1px solid #e2e8f0; margin: 30px 0; }
    </style></head><body>${markdownToHtml(markdown)}</body></html>`;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => printWindow.print(), 500);
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-primary blur-2xl opacity-30 animate-pulse" />
              <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
                {isMentorMode ? (
                  <Wand2 className="h-6 w-6 text-white animate-pulse" />
                ) : (
                  <Loader2 className="h-6 w-6 text-white animate-spin" />
                )}
              </div>
            </div>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl font-medium mt-2"
            >
              {isMentorMode ? 'Analyzing Your Problem Statement' : 'Generating Your Project Roadmap'}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-muted-foreground mt-2 text-sm"
            >
              {isMentorMode
                ? 'Decomposing requirements and designing architecture...'
                : 'Crafting a detailed development plan with sprints...'}
            </motion.p>
            <div className="mt-8">
              <RoadmapSkeleton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <Card className="border-destructive/50 max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">Failed to generate roadmap</p>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => router.push('/assessment')}>
              Back to Assessment
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const r = project.roadmap;
  const Icon = ICON_MAP[project.icon] || Sparkles;

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute inset-0 bg-glow" />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Button variant="ghost" size="sm" onClick={() => router.push('/assessment')} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {isMentorMode ? 'Back to Mentor' : 'Back to Ideas'}
          </Button>

          <div className="flex items-start gap-4 mb-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shrink-0"
            >
              {isMentorMode ? <Wand2 className="h-7 w-7 text-white" /> : <Icon className="h-7 w-7 text-white" />}
            </motion.div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold leading-tight">{project.title}</h1>
              <p className="text-muted-foreground mt-2 leading-relaxed">{project.elevatorPitch}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant="secondary" className="capitalize">{project.difficulty}</Badge>
                <Badge variant="outline">{project.category}</Badge>
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 mb-8">
            <Button onClick={handleSave} disabled={saving || alreadySaved} className="glow-primary">
              {alreadySaved ? (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Saved to Profile
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save to Profile'}
                </>
              )}
            </Button>
            <Button variant="outline" onClick={handleExportMarkdown}>
              <FileDown className="h-4 w-4 mr-2" />
              Export Markdown
            </Button>
            <Button variant="outline" onClick={handleExportPDF}>
              <FileDown className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </motion.div>

        {/* Roadmap Tabs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-6 h-auto">
              <TabsTrigger value="overview" className="flex items-center gap-1.5 py-2 text-xs md:text-sm">
                <Target className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="features" className="flex items-center gap-1.5 py-2 text-xs md:text-sm">
                <Layers className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Features</span>
              </TabsTrigger>
              <TabsTrigger value="tech" className="flex items-center gap-1.5 py-2 text-xs md:text-sm">
                <Code2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Tech Stack</span>
              </TabsTrigger>
              <TabsTrigger value="plan" className="flex items-center gap-1.5 py-2 text-xs md:text-sm">
                <Calendar className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Plan</span>
              </TabsTrigger>
              <TabsTrigger value="career" className="flex items-center gap-1.5 py-2 text-xs md:text-sm">
                <Briefcase className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Career</span>
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6 animate-fade-in">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    Project Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{r.overview}</p>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Map className="h-5 w-5 text-primary" />
                    System Architecture
                  </CardTitle>
                  <CardDescription>High-level explanation of how components interact</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="prose-dark">
                    <ReactMarkdown>{r.architectureMarkdown}</ReactMarkdown>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Trophy className="h-4 w-4 text-accent" />
                      Learning Outcomes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {r.learningOutcomes.map((lo, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                          {lo}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      Key Challenges
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {r.challenges.map((c, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <AlertTriangle className="h-3.5 w-3.5 text-yellow-500 shrink-0 mt-1" />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Features Tab */}
            <TabsContent value="features" className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-primary/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Rocket className="h-5 w-5 text-primary" />
                      MVP Features
                    </CardTitle>
                    <CardDescription>Build these first — the minimum viable product</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {r.coreFeatures.mvp.map((f, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.08 }}
                          className="flex items-start gap-3"
                        >
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary shrink-0">
                            {i + 1}
                          </div>
                          <span className="text-sm text-foreground leading-relaxed">{f}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-accent/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Sparkles className="h-5 w-5 text-accent" />
                      Future Enhancements
                    </CardTitle>
                    <CardDescription>Add these after MVP to level up the project</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {r.coreFeatures.future.map((f, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.08 }}
                          className="flex items-start gap-3"
                        >
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent shrink-0">
                            {i + 1}
                          </div>
                          <span className="text-sm text-muted-foreground leading-relaxed">{f}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Tech Stack Tab - upgraded with pill badges */}
            <TabsContent value="tech" className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {r.techStack.map((stack, i) => {
                  const LayerIcon = LAYER_ICONS[stack.layer.toLowerCase()] || Layers;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.08, type: 'spring', stiffness: 200 }}
                    >
                      <Card className="border-border/50 hover:border-primary/30 transition-all overflow-hidden group">
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                              <LayerIcon className="h-4 w-4 text-primary" />
                            </div>
                            <CardTitle className="text-sm font-semibold text-primary">{stack.layer}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {stack.technologies.map((tech, ti) => (
                              <motion.div
                                key={tech}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: (i * 0.08) + (ti * 0.05) }}
                              >
                                <Badge
                                  className="text-xs py-1.5 px-3 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 text-foreground border border-primary/20 hover:border-primary/40 transition-all cursor-default"
                                >
                                  {tech}
                                </Badge>
                              </motion.div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </TabsContent>

            {/* Plan Tab */}
            <TabsContent value="plan" className="space-y-4 animate-fade-in">
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />

                {r.sprintPlan.map((sprint, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="relative pl-16 pb-6"
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-0 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white text-xs font-bold z-10">
                      W{i + 1}
                    </div>

                    <Card className="border-border/50 hover:border-primary/30 transition-colors">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">{sprint.week}</Badge>
                        </div>
                        <CardTitle className="text-base mt-1">{sprint.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 mb-4">
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Tasks</p>
                          <ul className="space-y-1.5">
                            {sprint.tasks.map((task, ti) => (
                              <li key={ti} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <div className="h-1.5 w-1.5 rounded-full bg-primary/50 mt-2 shrink-0" />
                                {task}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <Separator className="mb-3" />
                        <div className="flex items-start gap-2">
                          <Target className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Deliverable</p>
                            <p className="text-sm text-foreground mt-0.5">{sprint.deliverable}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Career Tab */}
            <TabsContent value="career" className="space-y-4 animate-fade-in">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Briefcase className="h-5 w-5 text-primary" />
                    Resume & Interview Angle
                  </CardTitle>
                  <CardDescription>How to pitch this project to future employers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="prose-dark">
                    <ReactMarkdown>{r.resumeAngleMarkdown}</ReactMarkdown>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-accent/30 bg-accent/5">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium mb-1">Pro Tip</p>
                      <p className="text-sm text-muted-foreground">
                        Print this roadmap and bring it to your project advisor meeting. The
                        week-by-week plan shows you&apos;ve thought through the entire project
                        lifecycle — advisors love that.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}

// Simple markdown-to-HTML for PDF export
function markdownToHtml(md: string): string {
  let html = md
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Headers
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // Code
  html = html.replace(/`(.+?)`/g, '<code>$1</code>');

  // Table (simple)
  html = html.replace(/^\|(.+)\|$/gm, (match) => {
    const cells = match.split('|').filter((c) => c.trim());
    if (cells[0]?.startsWith('-')) return '';
    const tds = cells.map((c) => `<td>${c.trim()}</td>`).join('');
    return `<tr>${tds}</tr>`;
  });
  html = html.replace(/(<tr>[\s\S]*?<\/tr>)/g, '<table>$1</table>');

  // Lists
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>[\s\S]*?<\/li>)/g, '<ul>$1</ul>');

  // Horizontal rule
  html = html.replace(/^---$/gm, '<hr>');

  // Blockquote
  html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');

  // Paragraphs (lines not already tagged)
  html = html.replace(/^(?!<[a-z])(.+)$/gm, '<p>$1</p>');

  // Clean up empty paragraphs
  html = html.replace(/<p>\s*<\/p>/g, '');

  return html;
}

export default function RoadmapPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <RoadmapContent />
    </Suspense>
  );
}
