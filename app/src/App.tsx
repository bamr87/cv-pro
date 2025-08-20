import { Toaster } from '@/components/ui/sonner';
import { CVBuilder } from '@/components/cv/CVBuilder';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { LoginPage } from '@/pages/LoginPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { Button } from '@/components/ui/button';

function Protected({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function Shell({ children }: { children: React.ReactNode }) {
  const { user, signOutUser } = useAuth();
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="max-w-6xl mx-auto p-4 flex items-center justify-between">
          <Link to="/" className="font-semibold">CV Builder</Link>
          <div className="flex items-center gap-2">
            <Link to="/settings"><Button variant="outline" size="sm">Settings</Button></Link>
            {user ? (
              <Button variant="outline" size="sm" onClick={signOutUser}>Sign out</Button>
            ) : (
              <Link to="/login"><Button size="sm">Sign in</Button></Link>
            )}
          </div>
        </div>
      </header>
      {children}
      <Toaster position="bottom-right" />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Shell>
          <Routes>
            <Route path="/" element={<CVBuilder />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/settings" element={<Protected><SettingsPage /></Protected>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Shell>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App