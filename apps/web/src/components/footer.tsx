import { Download, Github, Linkedin, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Footer() {
  const handleResumeDownload = () => {
    // You can replace this with your actual resume URL or file path
    const resumeUrl = '/resume.pdf';
    const link = document.createElement('a');
    link.href = resumeUrl;
    link.download = 'resume.pdf';
    link.click();
  };

  return (
    <footer className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-4">
            <Button asChild className="h-9 w-9 p-0" size="sm" variant="ghost">
              <a
                aria-label="Email"
                href="mailto:your.email@example.com"
                rel="noopener noreferrer"
                target="_blank"
              >
                <Mail className="h-4 w-4" />
              </a>
            </Button>
            <Button asChild className="h-9 w-9 p-0" size="sm" variant="ghost">
              <a
                aria-label="LinkedIn"
                href="https://linkedin.com/in/yourprofile"
                rel="noopener noreferrer"
                target="_blank"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </Button>
            <Button asChild className="h-9 w-9 p-0" size="sm" variant="ghost">
              <a
                aria-label="GitHub"
                href="https://github.com/yourusername"
                rel="noopener noreferrer"
                target="_blank"
              >
                <Github className="h-4 w-4" />
              </a>
            </Button>
          </div>
          <Button
            className="flex items-center gap-2"
            onClick={handleResumeDownload}
            size="sm"
            variant="outline"
          >
            <Download className="h-4 w-4" />
            Download Resume
          </Button>
        </div>
      </div>
    </footer>
  );
}
