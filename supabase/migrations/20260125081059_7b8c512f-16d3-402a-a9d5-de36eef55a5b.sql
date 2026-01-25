-- Create projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  slug TEXT NOT NULL UNIQUE,
  owner_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create content_models table for headless CMS
CREATE TABLE public.content_models (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  fields JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(project_id, slug)
);

-- Create tasks table
CREATE TABLE public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  content_id UUID REFERENCES public.content(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'todo',
  priority TEXT NOT NULL DEFAULT 'medium',
  assignee_id UUID,
  due_date TIMESTAMP WITH TIME ZONE,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  data JSONB DEFAULT '{}',
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create project_members table
CREATE TABLE public.project_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'member',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(project_id, user_id)
);

-- Add project_id to content table
ALTER TABLE public.content ADD COLUMN project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE;

-- Enable RLS on all new tables
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;

-- Projects policies
CREATE POLICY "Users can view projects they own or are members of"
ON public.projects FOR SELECT
USING (
  owner_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM public.project_members WHERE project_id = projects.id AND user_id = auth.uid())
);

CREATE POLICY "Users can create projects"
ON public.projects FOR INSERT
WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owners can update their projects"
ON public.projects FOR UPDATE
USING (owner_id = auth.uid());

CREATE POLICY "Owners can delete their projects"
ON public.projects FOR DELETE
USING (owner_id = auth.uid());

-- Content models policies
CREATE POLICY "Users can view content models in their projects"
ON public.content_models FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.projects p 
    WHERE p.id = content_models.project_id 
    AND (p.owner_id = auth.uid() OR EXISTS (SELECT 1 FROM public.project_members pm WHERE pm.project_id = p.id AND pm.user_id = auth.uid()))
  )
);

CREATE POLICY "Project owners can manage content models"
ON public.content_models FOR ALL
USING (
  EXISTS (SELECT 1 FROM public.projects p WHERE p.id = content_models.project_id AND p.owner_id = auth.uid())
);

-- Tasks policies
CREATE POLICY "Users can view tasks in their projects"
ON public.tasks FOR SELECT
USING (
  created_by = auth.uid() OR 
  assignee_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.projects p 
    WHERE p.id = tasks.project_id 
    AND (p.owner_id = auth.uid() OR EXISTS (SELECT 1 FROM public.project_members pm WHERE pm.project_id = p.id AND pm.user_id = auth.uid()))
  )
);

CREATE POLICY "Users can create tasks"
ON public.tasks FOR INSERT
WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update tasks they created or are assigned"
ON public.tasks FOR UPDATE
USING (created_by = auth.uid() OR assignee_id = auth.uid());

CREATE POLICY "Users can delete tasks they created"
ON public.tasks FOR DELETE
USING (created_by = auth.uid());

-- Notifications policies
CREATE POLICY "Users can view their own notifications"
ON public.notifications FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "System can create notifications"
ON public.notifications FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can update their own notifications"
ON public.notifications FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own notifications"
ON public.notifications FOR DELETE
USING (user_id = auth.uid());

-- Project members policies
CREATE POLICY "Users can view project members"
ON public.project_members FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.projects p 
    WHERE p.id = project_members.project_id 
    AND (p.owner_id = auth.uid() OR EXISTS (SELECT 1 FROM public.project_members pm WHERE pm.project_id = p.id AND pm.user_id = auth.uid()))
  )
);

CREATE POLICY "Project owners can manage members"
ON public.project_members FOR ALL
USING (
  EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_members.project_id AND p.owner_id = auth.uid())
);

-- Triggers for updated_at
CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_content_models_updated_at
BEFORE UPDATE ON public.content_models
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_tasks_updated_at
BEFORE UPDATE ON public.tasks
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();