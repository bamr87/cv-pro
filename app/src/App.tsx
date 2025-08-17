import { Toaster } from '@/components/ui/sonner';
import { CVBuilder } from '@/components/cv/CVBuilder';

function App() {
  return (
    <div className="min-h-screen bg-background">
      <CVBuilder />
      <Toaster position="bottom-right" />
    </div>
  );
}

export default App