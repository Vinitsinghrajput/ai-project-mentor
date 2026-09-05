/*
# Create saved_projects table for user project roadmaps

## Overview
This migration creates a table to store AI-generated project ideas and their
full mentorship roadmaps that users save to their profile. Each project belongs
to a single authenticated user.

## New Tables

### saved_projects
- `id` (uuid, primary key) — unique identifier for each saved project
- `user_id` (uuid, not null, defaults to auth.uid()) — the owner, linked to auth.users
- `title` (text, not null) — the project title
- `elevator_pitch` (text, not null) — 2-sentence project pitch
- `difficulty` (text, not null) — 'beginner' | 'intermediate' | 'advanced'
- `skills` (text[], not null) — list of skills the user entered
- `interests` (text[], not null) — list of interest areas
- `roadmap` (jsonb, not null) — full structured roadmap object (core features, tech stack, architecture, development plan, resume angle)
- `created_at` (timestamptz, defaults to now()) — when the project was saved

## Security
- Enable RLS on saved_projects.
- Owner-scoped CRUD: each authenticated user can only access rows they own.
- Four separate policies: SELECT, INSERT, UPDATE, DELETE — all scoped to auth.uid() = user_id.
- user_id defaults to auth.uid() so inserts that omit it still satisfy the WITH CHECK.
*/

CREATE TABLE IF NOT EXISTS saved_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  elevator_pitch text NOT NULL,
  difficulty text NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  skills text[] NOT NULL DEFAULT '{}',
  interests text[] NOT NULL DEFAULT '{}',
  roadmap jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE saved_projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_projects" ON saved_projects;
CREATE POLICY "select_own_projects"
  ON saved_projects FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_projects" ON saved_projects;
CREATE POLICY "insert_own_projects"
  ON saved_projects FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_projects" ON saved_projects;
CREATE POLICY "update_own_projects"
  ON saved_projects FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_projects" ON saved_projects;
CREATE POLICY "delete_own_projects"
  ON saved_projects FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_saved_projects_user_id ON saved_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_projects_created_at ON saved_projects(created_at DESC);
