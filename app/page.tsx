'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Sparkles,
  Brain,
  Rocket,
  Map,
  FileDown,
  Target,
  Lightbulb,
  GraduationCap,
  ArrowRight,
  Zap,
  Code2,
  TrendingUp,
} from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Idea Generation',
    description:
      'Get 3-5 tailored project concepts based on your skills, interests, and difficulty preference — each with a catchy title and elevator pitch.',
  },
  {
    icon: Map,
    title: 'Detailed Project Roadmaps',
    description:
      'Every idea comes with a complete development plan: MVP features, tech stack, architecture, weekly sprints, and resume talking points.',
  },
  {
    icon: Rocket,
    title: 'Sprint-Based Development Plan',
    description:
      'Week-by-week breakdown with specific tasks and deliverables — so you always know what to build next and never get stuck.',
  },
  {
    icon: Target,
    title: 'Resume & Interview Prep',
    description:
      'Each project includes a tailored angle for pitching to employers, with talking points that highlight your technical depth.',
  },
  {
    icon: FileDown,
    title: 'Save & Export',
    description:
      'Save roadmaps to your profile and export them as Markdown files — perfect for sharing with advisors or keeping on hand.',
  },
  {
    icon: Lightbulb,
    title: 'Smart Matching',
    description:
      'Our engine matches your specific skills and interests to the most relevant project domains — no generic suggestions.',
  },
];

const steps = [
  {
    icon: GraduationCap,
    step: '01',
    title: 'Complete Assessment',
    description:
      'Tell us your skills (Python, React, etc.), interests (Healthcare, FinTech, AI), and preferred difficulty level.',
  },
  {
    icon: Zap,
    step: '02',
    title: 'Get AI Ideas',
    description:
      'Receive 3-5 unique, tailored project concepts with elevator pitches that match your profile and ambition level.',
  },
  {
    icon: Map,
    step: '03',
    title: 'Dive Into Roadmap',
    description:
      'Select an idea to unlock a complete roadmap with tech stack, architecture, weekly sprints, and interview prep.',
  },
  {
    icon: TrendingUp,
    step: '04',
    title: 'Build & Impress',
    description:
      'Follow the week-by-week plan, save your roadmap, and pitch it confidently in your next interview.',
  },
];

export default function Home() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute inset-0 bg-glow" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-24 md:pt-32 md:pb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-sm text-muted-foreground mb-6 animate-fade-in">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              AI-Powered Capstone Project Mentor
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl max-w-4xl mx-auto leading-[1.1]">
              Find Your Perfect
              <br />
              <span className="text-gradient">Final-Year Project</span>
            </h1>

            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Get AI-generated project ideas tailored to your skills and interests, complete with
              step-by-step development roadmaps, tech stack recommendations, and interview prep.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/assessment">
                <Button size="lg" className="glow-primary text-base px-8 h-12">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Project Ideas
                </Button>
              </Link>
              <Link href="/#how-it-works">
                <Button variant="outline" size="lg" className="text-base px-8 h-12">
                  How It Works
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          >
            {[
              { value: '8+', label: 'Project Domains' },
              { value: '3-5', label: 'Ideas Per Session' },
              { value: '5 wk', label: 'Sprint Plans' },
              { value: '100%', label: 'Tailored to You' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-bold text-gradient">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative py-24 border-t border-border/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold sm:text-4xl">
              From Skills to <span className="text-gradient-accent">Project Plan</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Four simple steps to go from "I don't know what to build" to a complete, resume-ready
              capstone project roadmap.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="relative h-full hover:border-primary/50 transition-colors group">
                  <div className="absolute -top-3 -right-3 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white text-xs font-bold shadow-lg">
                    {step.step}
                  </div>
                  <CardHeader>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary group-hover:bg-primary/10 transition-colors">
                      <step.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg mt-3">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative py-24 border-t border-border/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold sm:text-4xl">
              Everything You Need to <span className="text-gradient-accent">Succeed</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Not just ideas — a complete mentorship experience that guides you from concept to
              deployment.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Card className="h-full hover:border-primary/50 transition-all hover:glow-primary">
                  <CardHeader>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-base mt-3">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 border-t border-border/50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative rounded-2xl border border-border bg-gradient-to-br from-secondary to-card p-12 text-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-glow opacity-50" />
            <div className="relative">
              <Code2 className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold sm:text-4xl">
                Ready to Find Your <span className="text-gradient">Capstone Project?</span>
              </h2>
              <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
                Take the 2-minute assessment and get tailored project ideas with complete
                development roadmaps in seconds.
              </p>
              <Link href="/assessment" className="inline-block mt-8">
                <Button size="lg" className="glow-primary text-base px-8 h-12">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Start Now — It's Free
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
          <p>
            ProjectForge AI — Built for CS & IT final-year students. Find your perfect capstone
            project.
          </p>
        </div>
      </footer>
    </div>
  );
}
