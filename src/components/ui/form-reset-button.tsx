import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';

interface FormResetButtonProps {
  formKeys: string[];
  onReset?: () => void;
  className?: string;
}

export function FormResetButton({ formKeys, onReset, className }: FormResetButtonProps) {
  const { user } = useAuth();
  
  const handleReset = () => {
    if (window.confirm('Möchtest du alle gespeicherten Formulardaten zurücksetzen?')) {
      formKeys.forEach(key => {
        const storageKey = user ? `${key}_${user.id}` : key;
        localStorage.removeItem(storageKey);
        sessionStorage.removeItem(storageKey);
      });
      
      if (onReset) {
        onReset();
      }
      
      // Page reload to reset all states
      window.location.reload();
    }
  };
  
  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleReset}
      className={className}
    >
      <RotateCcw className="w-4 h-4 mr-2" />
      Formular zurücksetzen
    </Button>
  );
}