'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Sparkles,
  Plus,
  X,
  Code,
  Heart,
  Gauge,
  ArrowRight,
  ArrowLeft,
  Brain,
  Wallet,
  GraduationCap,
  Bot,
  Eye,
  Leaf,
  PenTool,
  Shield,
  Cloud,
  Music,
  Gamepad2,
  Camera,
  Lightbulb,
  Wand2,
} from 'lucide-react';
import type { Difficulty } from '@/lib/idea-engine';

type Mode = 'generate' | 'mentor';

const SKILL_SUGGESTIONS = [
  'Python', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'Next.js',
  'Java', 'C++', 'Go', 'Rust', 'Flask', 'Django', 'FastAPI', 'Express',
  'PostgreSQL', 'MongoDB', 'Firebase', 'Supabase', 'Docker', 'AWS',
  'TensorFlow', 'PyTorch', 'OpenCV', 'scikit-learn', 'Git', 'REST API',
  'GraphQL', 'Tailwind CSS', 'Framer Motion', 'C#', 'Kotlin', 'Swift',
];

const INTEREST_SUGGESTIONS = [
  { label: 'Healthcare', icon: Heart },
  { label: 'FinTech', icon: Wallet },
  { label: 'Education', icon: GraduationCap },
  { label: 'AI / Machine Learning', icon: Brain },
  { label: 'Automation', icon: Bot },
  { label: 'Computer Vision', icon: Eye },
  { label: 'Environment', icon: Leaf },
  { label: 'Content / NLP', icon: PenTool },
  { label: 'Security', icon: Shield },
  { label: 'Cloud / DevOps', icon: Cloud },
  { label: 'Music / Audio', icon: Music },
  { label: 'Gaming', icon: Gamepad2 },
  { label: 'Social Impact', icon: Leaf },
  { label: 'Photography', icon: Camera },
  { label: 'Developer Tools', icon: Code },
];

const DIFFICULTY_OPTIONS: { value: Difficulty; label: string; description: string }[] = [
  {
    value: 'beginner',
    label: 'Beginner',
    description: 'New to building full projects. Want something achievable with guidance.',
  },
  {
    value: 'intermediate',
    label: 'Intermediate',
    description: 'Comfortable with frameworks. Ready for a multi-service or ML-integrated project.',
  },
  {
    value: 'advanced',
    label: 'Advanced',
    description: 'Experienced developer. Want a complex, impressive project that pushes boundaries.',
  },
];

const MENTOR_EXAMPLES = [
  "Build a decentralized voting system using blockchain that ensures tamper-proof election results with voter anonymity.",
  "Create a real-time sign language translation app using a webcam that converts hand gestures to text and speech.",
  "Develop a smart agriculture IoT system that monitors soil moisture and weather data to automate irrigation and predict crop yield.",
];

export default function AssessmentPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('generate');

  // Shared state
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('intermediate');

  // Generate mode state
  const [interests, setInterests] = useState<string[]>([]);
  const [step, setStep] = useState(1);

  // Mentor mode state
  const [problemStatement, setProblemStatement] = useState('');

  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setSkills([...skills, trimmed]);
    }
    setSkillInput('');
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const toggleInterest = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter((i) => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (skillInput.trim()) addSkill(skillInput);
    }
  };

  const canProceed = (currentStep: number) => {
    if (currentStep === 1) return skills.length >= 1;
    if (currentStep === 2) return interests.length >= 1;
    if (currentStep === 3) return !!difficulty;
    return false;
  };

  const canMentorProceed = skills.length >= 1 && problemStatement.trim().length >= 20;

  const handleGenerate = () => {
    const params = new URLSearchParams({
      skills: skills.join(','),
      interests: interests.join(','),
      difficulty,
    });
    router.push(`/ideas?${params.toString()}`);
  };

  const handleMentor = () => {
    const params = new URLSearchParams({
      mode: 'mentor',
      problem: problemStatement.trim(),
      skills: skills.join(','),
      difficulty,
    });
    router.push(`/roadmap?${params.toString()}`);
  };

  const filteredSuggestions = SKILL_SUGGESTIONS.filter(
    (s) =>
      !skills.some((sk) => sk.toLowerCase() === s.toLowerCase()) &&
      s.toLowerCase().includes(skillInput.toLowerCase())
  ).slice(0, 8);

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute inset-0 bg-glow" />

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Mode Toggle */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <div className="relative flex rounded-xl border border-border bg-secondary/30 p-1.5 max-w-md mx-auto">
            {/* Animated background slider */}
            <motion.div
              className="absolute inset-y-1.5 w-[calc(50%-0.375rem)] rounded-lg bg-gradient-to-br from-primary to-accent glow-primary"
              animate={{ x: mode === 'generate' ? 0 : 'calc(100% + 0.375rem)' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{ left: '0.375rem' }}
            />
            <button
              onClick={() => setMode('generate')}
              className={`relative z-10 flex flex-1 items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors ${
                mode === 'generate' ? 'text-white' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Sparkles className="h-4 w-4" />
              Generate Idea
            </button>
            <button
              onClick={() => setMode('mentor')}
              className={`relative z-10 flex flex-1 items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors ${
                mode === 'mentor' ? 'text-white' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Wand2 className="h-4 w-4" />
              Mentor My Idea
            </button>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* ============ GENERATE MODE ============ */}
          {mode === 'generate' && (
            <motion.div
              key="generate-mode"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Progress */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  {[1, 2, 3].map((s) => (
                    <div key={s} className="flex items-center flex-1">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-all ${
                          step >= s
                            ? 'bg-gradient-to-br from-primary to-accent text-white'
                            : 'bg-secondary text-muted-foreground'
                        }`}
                      >
                        {step > s ? '✓' : s}
                      </div>
                      {s < 3 && (
                        <div
                          className={`h-0.5 flex-1 mx-2 transition-all ${
                            step > s ? 'bg-primary' : 'bg-secondary'
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span className={step >= 1 ? 'text-foreground' : ''}>Skills</span>
                  <span className={step >= 2 ? 'text-foreground' : ''}>Interests</span>
                  <span className={step >= 3 ? 'text-foreground' : ''}>Difficulty</span>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {/* Step 1: Skills */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="border-border/50">
                      <CardHeader>
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mb-2">
                          <Code className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-2xl">What are your skills?</CardTitle>
                        <CardDescription>
                          Add the programming languages, frameworks, and tools you know. Be honest — this
                          helps us match the right projects.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="skill-input">Type a skill and press Enter</Label>
                          <div className="relative">
                            <Input
                              id="skill-input"
                              placeholder="e.g. Python, React, TensorFlow..."
                              value={skillInput}
                              onChange={(e) => setSkillInput(e.target.value)}
                              onKeyDown={handleSkillKeyDown}
                              className="pr-10 focus-visible:glow-focus"
                            />
                            <button
                              onClick={() => skillInput.trim() && addSkill(skillInput)}
                              className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:text-foreground"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {skills.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {skills.map((skill) => (
                              <Badge
                                key={skill}
                                variant="secondary"
                                className="flex items-center gap-1 py-1.5 pl-3 pr-2 bg-primary/10 text-primary border border-primary/20"
                              >
                                {skill}
                                <button
                                  onClick={() => removeSkill(skill)}
                                  className="ml-1 hover:text-destructive"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        )}

                        <Separator />

                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Popular skills:</p>
                          <div className="flex flex-wrap gap-2">
                            {filteredSuggestions.map((skill) => (
                              <button
                                key={skill}
                                onClick={() => addSkill(skill)}
                                className="rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs text-muted-foreground hover:border-primary/50 hover:text-foreground transition-all"
                              >
                                + {skill}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-end pt-4">
                          <Button
                            onClick={() => setStep(2)}
                            disabled={!canProceed(1)}
                            className="glow-primary"
                          >
                            Next: Choose Interests
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Step 2: Interests */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="border-border/50">
                      <CardHeader>
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mb-2">
                          <Heart className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-2xl">What domains interest you?</CardTitle>
                        <CardDescription>
                          Pick one or more areas you&apos;re passionate about. This shapes the kind of
                          projects we&apos;ll suggest.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {INTEREST_SUGGESTIONS.map((item) => {
                            const selected = interests.includes(item.label);
                            return (
                              <button
                                key={item.label}
                                onClick={() => toggleInterest(item.label)}
                                className={`flex items-center gap-2 rounded-lg border p-3 text-left text-sm transition-all ${
                                  selected
                                    ? 'border-primary bg-primary/10 text-foreground glow-primary'
                                    : 'border-border bg-secondary/30 text-muted-foreground hover:border-primary/40 hover:text-foreground'
                                }`}
                              >
                                <item.icon
                                  className={`h-4 w-4 shrink-0 ${selected ? 'text-primary' : ''}`}
                                />
                                <span className="truncate">{item.label}</span>
                              </button>
                            );
                          })}
                        </div>

                        {interests.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-2">
                            {interests.map((interest) => (
                              <Badge
                                key={interest}
                                variant="secondary"
                                className="flex items-center gap-1 py-1.5 pl-3 pr-2 bg-accent/10 text-accent border border-accent/20"
                              >
                                {interest}
                                <button
                                  onClick={() => toggleInterest(interest)}
                                  className="ml-1 hover:text-destructive"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        )}

                        <div className="flex justify-between pt-4">
                          <Button variant="outline" onClick={() => setStep(1)}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                          </Button>
                          <Button
                            onClick={() => setStep(3)}
                            disabled={!canProceed(2)}
                            className="glow-primary"
                          >
                            Next: Difficulty
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Step 3: Difficulty */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="border-border/50">
                      <CardHeader>
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mb-2">
                          <Gauge className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-2xl">How challenging?</CardTitle>
                        <CardDescription>
                          Pick the difficulty level that matches your experience and ambition.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          {DIFFICULTY_OPTIONS.map((opt) => (
                            <button
                              key={opt.value}
                              onClick={() => setDifficulty(opt.value)}
                              className={`w-full text-left rounded-lg border p-4 transition-all ${
                                difficulty === opt.value
                                  ? 'border-primary bg-primary/10 glow-primary'
                                  : 'border-border bg-secondary/30 hover:border-primary/40'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className={`font-medium ${difficulty === opt.value ? 'text-primary' : 'text-foreground'}`}>
                                    {opt.label}
                                  </p>
                                  <p className="text-sm text-muted-foreground mt-1">{opt.description}</p>
                                </div>
                                <div
                                  className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all ${
                                    difficulty === opt.value
                                      ? 'border-primary bg-primary'
                                      : 'border-border'
                                  }`}
                                >
                                  {difficulty === opt.value && (
                                    <div className="h-2 w-2 rounded-full bg-white" />
                                  )}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>

                        <div className="rounded-lg border border-border bg-secondary/30 p-4 space-y-2">
                          <p className="text-sm font-medium">Your Assessment Summary:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {skills.map((s) => (
                              <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                            ))}
                            <span className="text-muted-foreground text-xs mx-1">|</span>
                            {interests.map((i) => (
                              <Badge key={i} variant="outline" className="text-xs">{i}</Badge>
                            ))}
                            <span className="text-muted-foreground text-xs mx-1">|</span>
                            <Badge variant="outline" className="text-xs capitalize">{difficulty}</Badge>
                          </div>
                        </div>

                        <div className="flex justify-between pt-4">
                          <Button variant="outline" onClick={() => setStep(2)}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                          </Button>
                          <Button onClick={handleGenerate} className="glow-primary">
                            <Sparkles className="h-4 w-4 mr-2" />
                            Generate Ideas
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* ============ MENTOR MODE ============ */}
          {mode === 'mentor' && (
            <motion.div
              key="mentor-mode"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-border/50">
                <CardHeader>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 mb-2">
                    <Lightbulb className="h-5 w-5 text-accent" />
                  </div>
                  <CardTitle className="text-2xl">Describe your project idea</CardTitle>
                  <CardDescription>
                    Paste your final-year project problem statement or describe the system you want to
                    build. Our AI architect will analyze it and generate a complete roadmap.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Problem Statement Textarea */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="problem-statement">Your project problem statement</Label>
                      <span className={`text-xs ${problemStatement.length >= 20 ? 'text-accent' : 'text-muted-foreground'}`}>
                        {problemStatement.length} characters
                      </span>
                    </div>
                    <Textarea
                      id="problem-statement"
                      placeholder="e.g. Build a decentralized voting system using blockchain that ensures tamper-proof election results with voter anonymity..."
                      value={problemStatement}
                      onChange={(e) => setProblemStatement(e.target.value)}
                      rows={7}
                      className="resize-none focus-visible:glow-focus-accent text-sm leading-relaxed"
                    />
                    {problemStatement.length > 0 && problemStatement.length < 20 && (
                      <p className="text-xs text-muted-foreground">Write at least 20 characters for a meaningful analysis.</p>
                    )}

                    {/* Example chips */}
                    {problemStatement.length === 0 && (
                      <div className="space-y-2 pt-2">
                        <p className="text-xs text-muted-foreground">Need inspiration? Try an example:</p>
                        <div className="flex flex-col gap-2">
                          {MENTOR_EXAMPLES.map((ex, i) => (
                            <button
                              key={i}
                              onClick={() => setProblemStatement(ex)}
                              className="text-left rounded-lg border border-border bg-secondary/30 px-3 py-2 text-xs text-muted-foreground hover:border-accent/40 hover:text-foreground transition-all"
                            >
                              <Lightbulb className="h-3 w-3 inline mr-1.5 text-accent/60" />
                              {ex}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Skills Input (shared) */}
                  <div className="space-y-2">
                    <Label htmlFor="mentor-skill-input">What technologies do you want to use?</Label>
                    <div className="relative">
                      <Input
                        id="mentor-skill-input"
                        placeholder="e.g. Python, React, TensorFlow..."
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={handleSkillKeyDown}
                        className="pr-10 focus-visible:glow-focus"
                      />
                      <button
                        onClick={() => skillInput.trim() && addSkill(skillInput)}
                        className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:text-foreground"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    {skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {skills.map((skill) => (
                          <Badge
                            key={skill}
                            variant="secondary"
                            className="flex items-center gap-1 py-1.5 pl-3 pr-2 bg-primary/10 text-primary border border-primary/20"
                          >
                            {skill}
                            <button
                              onClick={() => removeSkill(skill)}
                              className="ml-1 hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 pt-1">
                      {filteredSuggestions.slice(0, 6).map((skill) => (
                        <button
                          key={skill}
                          onClick={() => addSkill(skill)}
                          className="rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs text-muted-foreground hover:border-primary/50 hover:text-foreground transition-all"
                        >
                          + {skill}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Difficulty */}
                  <div className="space-y-2">
                    <Label>Project complexity</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {DIFFICULTY_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => setDifficulty(opt.value)}
                          className={`rounded-lg border p-3 text-center transition-all ${
                            difficulty === opt.value
                              ? 'border-primary bg-primary/10 glow-primary'
                              : 'border-border bg-secondary/30 hover:border-primary/40'
                          }`}
                        >
                          <p className={`text-sm font-medium ${difficulty === opt.value ? 'text-primary' : 'text-foreground'}`}>
                            {opt.label}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="flex justify-end pt-2">
                    <Button
                      onClick={handleMentor}
                      disabled={!canMentorProceed}
                      className="glow-primary"
                      size="lg"
                    >
                      <Wand2 className="h-4 w-4 mr-2" />
                      Generate Roadmap
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
