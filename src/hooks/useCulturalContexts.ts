
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CulturalContext } from '@/types/leadAgent';
import { useToast } from '@/hooks/use-toast';

export function useCulturalContexts() {
  const [contexts, setContexts] = useState<CulturalContext[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchCulturalContexts = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('cultural_contexts')
        .select('*')
        .order('language');

      if (error) {
        console.error('Error fetching cultural contexts:', error);
        toast({
          title: "Error",
          description: "Failed to load cultural contexts.",
          variant: "destructive"
        });
        return;
      }

      setContexts(data || []);
    } catch (error) {
      console.error('Error in fetchCulturalContexts:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while loading cultural contexts.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getCulturalContextByLanguage = (language: string): CulturalContext | null => {
    return contexts.find(context => context.language === language) || null;
  };

  useEffect(() => {
    fetchCulturalContexts();
  }, []);

  return {
    contexts,
    isLoading,
    getCulturalContextByLanguage,
    refetch: fetchCulturalContexts
  };
}
