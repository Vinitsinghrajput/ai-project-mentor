import { NextRequest, NextResponse } from 'next/server';
import {
  generateIdeas,
  generateFullProject,
  generateMentorProject,
  type AssessmentInput,
  type ProjectIdea,
  type MentorInput,
} from '@/lib/idea-engine';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// System prompts are documented in lib/prompts.ts. The current implementation uses a
// built-in deterministic engine that produces the same structured JSON shape without
// requiring an external API key.

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, assessment, idea, mentorInput } = body as {
      action: 'generate-ideas' | 'generate-roadmap' | 'mentor-idea';
      assessment?: AssessmentInput;
      idea?: ProjectIdea;
      mentorInput?: MentorInput;
    };

    if (action === 'generate-ideas') {
      if (!assessment || !assessment.skills || !assessment.interests || !assessment.difficulty) {
        return NextResponse.json(
          { error: 'Missing required fields: skills, interests, difficulty' },
          { status: 400 }
        );
      }

      // Simulate AI processing delay for realistic UX
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const ideas = generateIdeas(assessment);
      return NextResponse.json({ ideas });
    }

    if (action === 'generate-roadmap') {
      if (!idea || !assessment) {
        return NextResponse.json(
          { error: 'Missing required fields: idea, assessment' },
          { status: 400 }
        );
      }

      // Simulate AI processing delay
      await new Promise((resolve) => setTimeout(resolve, 1800));

      const project = generateFullProject(idea, assessment);
      return NextResponse.json({ project });
    }

    if (action === 'mentor-idea') {
      if (!mentorInput || !mentorInput.problemStatement || !mentorInput.skills) {
        return NextResponse.json(
          { error: 'Missing required fields: problemStatement, skills' },
          { status: 400 }
        );
      }

      // Simulate AI processing delay (slightly longer for custom analysis)
      await new Promise((resolve) => setTimeout(resolve, 2200));

      const project = generateMentorProject(mentorInput);
      return NextResponse.json({ project });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
