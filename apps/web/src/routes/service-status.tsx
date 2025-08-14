import { Separator } from '@radix-ui/react-separator';
import { createFileRoute } from '@tanstack/react-router';
import { Badge } from '@/components/ui/badge';
import { useMediaProcessorHealth } from '@/hooks/use-media-processor';

export const Route = createFileRoute('/service-status')({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: health, isLoading, error, isError } = useMediaProcessorHealth();
  return (
    <div
      className={`rounded-2xl border-3 bg-violet-200 p-4 text-black ${isLoading ? 'animate-pulse' : ''} ${isError ? 'border-red-800' : 'border-violet-800'}`}
    >
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error: {error.message}</p>}
      {health && (
        <div>
          <div className="flex items-center justify-between">
            <p>Media Processor Service</p>
            <p>
              {health.data.status === 'OK' ? (
                <Badge variant="default">Online</Badge>
              ) : (
                <Badge variant="destructive">Offline</Badge>
              )}
            </p>
          </div>
          <Separator className="my-3" />
          <div>
            <pre>{JSON.stringify(health.data, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
