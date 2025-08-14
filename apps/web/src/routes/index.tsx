import { createFileRoute } from '@tanstack/react-router';
import Loader from '@/components/loader';
import ProjectsList from '@/components/projects-list';
import { authClient } from '@/lib/auth-client';

export const Route = createFileRoute('/')({
  component: HomeComponent,
});

function HomeComponent() {
  const { isPending, data: session } = authClient.useSession();
  console.log('session', session);
  return (
    <div className="container mx-auto max-w-3xl px-4 py-2">
      {isPending && <Loader />}
      {session && <ProjectsList />}
    </div>
  );
}
