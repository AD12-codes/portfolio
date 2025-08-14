import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Types for your portfolio data
export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  featured: boolean;
  createdAt: string;
}

// Mock data for testing - replace with actual API calls later
const projectsApi = {
  // Mock projects data
  getProjects: async (): Promise<Project[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return [
      {
        id: '1',
        title: 'E-commerce Platform',
        description:
          'A full-stack e-commerce platform built with React, Node.js, and PostgreSQL. Features include user authentication, payment processing, and admin dashboard.',
        technologies: [
          'React',
          'Node.js',
          'PostgreSQL',
          'Stripe',
          'Tailwind CSS',
        ],
        githubUrl: 'https://github.com/yourusername/ecommerce-platform',
        liveUrl: 'https://your-ecommerce-demo.netlify.app',
        imageUrl:
          'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=225&fit=crop',
        featured: true,
        createdAt: '2024-01-15',
      },
      {
        id: '2',
        title: 'Task Management App',
        description:
          'A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.',
        technologies: [
          'Next.js',
          'TypeScript',
          'Prisma',
          'PostgreSQL',
          'Socket.io',
        ],
        githubUrl: 'https://github.com/yourusername/task-manager',
        liveUrl: 'https://your-task-manager.vercel.app',
        imageUrl:
          'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=225&fit=crop',
        featured: true,
        createdAt: '2024-02-20',
      },
      {
        id: '3',
        title: 'Weather Dashboard',
        description:
          'A responsive weather dashboard that displays current conditions and forecasts using OpenWeatherMap API with beautiful visualizations.',
        technologies: [
          'React',
          'Chart.js',
          'OpenWeatherMap API',
          'Tailwind CSS',
        ],
        githubUrl: 'https://github.com/yourusername/weather-dashboard',
        liveUrl: 'https://your-weather-dashboard.netlify.app',
        imageUrl:
          'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=400&h=225&fit=crop',
        featured: false,
        createdAt: '2024-03-10',
      },
      {
        id: '4',
        title: 'AI Chat Assistant',
        description:
          'An intelligent chat assistant powered by OpenAI GPT-4 with context memory, conversation history, and customizable prompts.',
        technologies: ['React', 'OpenAI API', 'Node.js', 'Redis', 'WebSocket'],
        githubUrl: 'https://github.com/yourusername/ai-chat-assistant',
        liveUrl: 'https://your-ai-chat-demo.netlify.app',
        imageUrl:
          'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=225&fit=crop',
        featured: true,
        createdAt: '2024-04-05',
      },
      {
        id: '5',
        title: 'Portfolio Website',
        description:
          'A modern, responsive portfolio website built with Next.js, featuring dark mode, animations, and contact form functionality.',
        technologies: [
          'Next.js',
          'TypeScript',
          'Tailwind CSS',
          'Framer Motion',
        ],
        githubUrl: 'https://github.com/yourusername/portfolio-website',
        liveUrl: 'https://your-portfolio-demo.vercel.app',
        imageUrl:
          'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=400&h=225&fit=crop',
        featured: false,
        createdAt: '2024-05-12',
      },
      {
        id: '6',
        title: 'Recipe Finder App',
        description:
          'A recipe discovery application with ingredient search, dietary filters, and nutritional information using Spoonacular API.',
        technologies: [
          'React',
          'Spoonacular API',
          'Local Storage',
          'CSS Modules',
        ],
        githubUrl: 'https://github.com/yourusername/recipe-finder',
        liveUrl: 'https://your-recipe-finder.netlify.app',
        imageUrl:
          'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=225&fit=crop',
        featured: false,
        createdAt: '2024-06-18',
      },
    ];
  },

  // Mock single project fetch
  getProject: async (id: string): Promise<Project> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const projects = await projectsApi.getProjects();
    const project = projects.find((p) => p.id === id);
    if (!project) {
      throw new Error('Project not found');
    }
    return project;
  },

  // Create a new project (if you have admin functionality)
  createProject: async (
    project: Omit<Project, 'id' | 'createdAt'>
  ): Promise<Project> => {
    const response = await fetch('/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(project),
    });
    if (!response.ok) {
      throw new Error('Failed to create project');
    }
    return response.json();
  },

  // Update a project
  updateProject: async ({
    id,
    ...project
  }: Partial<Project> & { id: string }): Promise<Project> => {
    const response = await fetch(`/api/projects/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(project),
    });
    if (!response.ok) {
      throw new Error('Failed to update project');
    }
    return response.json();
  },

  // Delete a project
  deleteProject: async (id: string): Promise<void> => {
    const response = await fetch(`/api/projects/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete project');
    }
  },
};

// Query keys for consistent cache management
export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) =>
    [...projectKeys.lists(), { filters }] as const,
  details: () => [...projectKeys.all, 'detail'] as const,
  detail: (id: string) => [...projectKeys.details(), id] as const,
};

// Custom hooks
export function useProjects() {
  return useQuery({
    queryKey: projectKeys.lists(),
    queryFn: projectsApi.getProjects,
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: () => projectsApi.getProject(id),
    enabled: !!id, // Only run query if id exists
  });
}

export function useFeaturedProjects() {
  return useQuery({
    queryKey: projectKeys.list({ featured: true }),
    queryFn: async () => {
      const projects = await projectsApi.getProjects();
      return projects.filter((project) => project.featured);
    },
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: projectsApi.createProject,
    onSuccess: () => {
      // Invalidate and refetch projects list
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: projectsApi.updateProject,
    onSuccess: (data) => {
      // Update the specific project in cache
      queryClient.setQueryData(projectKeys.detail(data.id), data);
      // Invalidate projects list to ensure consistency
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: projectsApi.deleteProject,
    onSuccess: (_, deletedId) => {
      // Remove the specific project from cache
      queryClient.removeQueries({ queryKey: projectKeys.detail(deletedId) });
      // Invalidate projects list
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
}
