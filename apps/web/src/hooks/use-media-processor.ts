import { useQuery } from '@tanstack/react-query';
import { getMediaProcessorHealth } from '@/api/media-processor';

export const useMediaProcessorHealth = () => {
  return useQuery({
    queryKey: ['media-processor-health'],
    queryFn: async () => await getMediaProcessorHealth(),
  });
};
