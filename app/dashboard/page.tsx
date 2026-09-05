'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Sparkles,
  Plus,
  Trash2,
  FileDown,
  Loader2,
  FolderOpen,
  Calendar,
  HeartPulse,
  Wallet,
  GraduationCap,
  Bot,
  Eye as EyeIcon,
  Leaf,
  PenTool,
  Code2,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { projectToMarkdown, type FullProject, type AssessmentInput, type Roadmap } from '@/lib/idea-engine';

interface SavedProject {
  id: string;
  title: string;
  elevator_pitch: string;
  difficulty: string;
  skills: string[];
  interests: string[];
  roadmap: Roadmap;
  created_at: string;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  HeartPulse,
  Wallet,
  GraduationCap,
  Bot,
  Eye: EyeIcon,
  Leaf,
  PenTool,
  Code2,
};

// Map category to icon name
const CATEGORY_TO_ICON: Record<string, string> = {
  'Healthcare AI': 'HeartPulse',
  'FinTech Platform': 'Wallet',
  'AI Education Platform': 'GraduationCap',
  'Developer Tools': 'Code2',
  'Smart Automation': 'Bot',
  'AI Content Platform': 'PenTool',
  'Social Impact': 'Leaf',
  'Computer Vision': 'Eye',
};

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/auth/sign-in');
      return;
    }

    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from('saved_projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({ title: 'Failed to load projects', description: error.message, variant: 'destructive' });
      } else {
        setProjects(data || []);
      }
      setLoading(false);
    };
    fetchProjects();
  }, [user, authLoading, router]);

  const handleDelete = async (id: string) => {
    setDeleteId(id);
    const { error } = await supabase.from('saved_projects').delete().eq('id', id);
    if (error) {
      toast({ title: 'Delete failed', description: error.message, variant: 'destructive' });
    } else {
      setProjects(projects.filter((p) => p.id !== id));
      toast({ title: 'Project deleted' });
    }
    setDeleteId(null);
  };

  const handleExport = (project: SavedProject) => {
    const fullProject: FullProject = {
      id: project.id,
      title: project.title,
      elevatorPitch: project.elevator_pitch,
      category: Object.entries(CATEGORY_TO_ICON).find(([, icon]) => icon === 'Code2')?.[0] || '',
      difficulty: project.difficulty as AssessmentInput['difficulty'],
      tags: [...project.interests.slice(0, 3), ...project.skills.slice(0, 2)],
      icon: 'Code2',
      roadmap: project.roadmap,
      assessment: {
        skills: project.skills,
        interests: project.interests,
        difficulty: project.difficulty as AssessmentInput['difficulty'],
      },
    };
    const markdown = projectToMarkdown(fullProject);
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Exported!', description: 'Markdown file downloaded.' });
  };

  if (authLoading || (loading && user)) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute inset-0 bg-glow" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              My <span className="text-gradient">Projects</span>
            </h1>
            <p className="text-muted-foreground mt-2">
              Your saved project roadmaps, ready to build.
            </p>
          </div>
          <Link href="/assessment">
            <Button className="glow-primary">
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </Link>
        </div>

        {/* Empty state */}
        {projects.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="border-border/50 border-dashed">
              <CardContent className="pt-12 pb-12 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                  <FolderOpen className="h-8 w-8 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-medium mb-2">No saved projects yet</h2>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  Generate project ideas and save the ones you love. They&apos;ll appear here for
                  you to access anytime.
                </p>
                <Link href="/assessment">
                  <Button size="lg" className="glow-primary">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Your First Project
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Projects grid */}
        {projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project, i) => {
              const iconName = CATEGORY_TO_ICON[project.roadmap?.['category' as keyof Roadmap] as string] || 'Code2';
              const Icon = ICON_MAP[iconName] || Code2;
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  <Card className="group border-border/50 hover:border-primary/40 transition-all">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <Badge variant="outline" className="capitalize text-xs">
                          {project.difficulty}
                        </Badge>
                      </div>
                      <CardTitle className="text-base leading-snug mt-3">{project.title}</CardTitle>
                      <CardDescription className="text-sm leading-relaxed line-clamp-2 mt-1">
                        {project.elevator_pitch}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {project.skills.slice(0, 3).map((s) => (
                          <Badge key={s} variant="secondary" className="text-xs">
                            {s}
                          </Badge>
                        ))}
                        {project.interests.slice(0, 2).map((int) => (
                          <Badge key={int} variant="outline" className="text-xs">
                            {int}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
                        <Calendar className="h-3 w-3" />
                        {new Date(project.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => {
                            const params = new URLSearchParams({
                              title: project.title,
                              pitch: project.elevator_pitch,
                              category: '',
                              difficulty: project.difficulty,
                              tags: '',
                              icon: iconName,
                              skills: project.skills.join(','),
                              interests: project.interests.join(','),
                            });
                            router.push(`/roadmap?${params.toString()}`);
                          }}
                        >
                          <EyeIcon className="h-3.5 w-3.5 mr-1.5" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleExport(project)}
                        >
                          <FileDown className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(project.id)}
                          disabled={deleteId === project.id}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
