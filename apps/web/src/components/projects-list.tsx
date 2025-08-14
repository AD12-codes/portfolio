import { Calendar, ExternalLink, Github, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useFeaturedProjects } from '@/hooks/use-projects';

// interface ProjectsListProps {
//   featuredOnly?: boolean;
// }

export default function ProjectsList() {
  const { data: projects, isLoading, error, isError } = useFeaturedProjects();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 font-medium text-lg">Loading projects...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-8 text-center shadow-sm">
        <p className="font-medium text-destructive text-lg">
          {error instanceof Error ? error.message : 'Failed to load projects'}
        </p>
        <Button
          className="mt-6"
          onClick={() => window.location.reload()}
          variant="outline"
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="rounded-lg border border-muted p-8 text-center shadow-sm">
        <p className="text-lg text-muted-foreground">No projects found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="font-bold text-3xl tracking-tight">Featured Projects</h2>
      <p className="text-muted-foreground">
        A collection of my recent work and side projects
      </p>

      <div className="space-y-6">
        {projects.map((project) => (
          <Card
            className="overflow-hidden transition-all hover:shadow-md"
            key={project.id}
          >
            <div className="md:flex">
              {/* Image section - takes full width on mobile, 40% on larger screens */}
              {project.imageUrl && (
                <div className="md:w-2/5 lg:w-1/3">
                  <div className="h-full overflow-hidden md:rounded-l-lg">
                    <img
                      alt={project.title}
                      className="h-64 w-full object-cover transition-transform duration-300 hover:scale-105 md:h-full"
                      src={project.imageUrl}
                    />
                  </div>
                </div>
              )}

              {/* Content section */}
              <div className="flex flex-1 flex-col p-0 md:p-0">
                <CardHeader className="pb-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <CardTitle className="font-bold text-xl md:text-2xl">
                      {project.title}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {project.featured && (
                        <Badge
                          className="bg-primary/10 text-primary hover:bg-primary/20"
                          variant="secondary"
                        >
                          Featured
                        </Badge>
                      )}
                      <div className="flex items-center text-muted-foreground text-xs">
                        <Calendar className="mr-1 h-3 w-3" />
                        {project.createdAt}
                      </div>
                    </div>
                  </div>

                  <CardDescription className="mt-2 text-base">
                    {project.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pb-2">
                  <Separator className="my-3" />
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <Badge
                        className="bg-secondary/50 font-medium text-xs hover:bg-secondary"
                        key={tech}
                        variant="secondary"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="flex-wrap gap-3 pt-2">
                  {project.githubUrl && (
                    <Button
                      asChild
                      className="gap-2"
                      size="sm"
                      variant="outline"
                    >
                      <a
                        href={project.githubUrl}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <Github className="h-4 w-4" />
                        View Code
                      </a>
                    </Button>
                  )}
                  {project.liveUrl && (
                    <Button asChild className="gap-2" size="sm">
                      <a
                        href={project.liveUrl}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Live Demo
                      </a>
                    </Button>
                  )}
                </CardFooter>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
