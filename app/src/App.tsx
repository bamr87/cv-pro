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
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:ring-2 focus:ring-ring"
      >
        Skip to main content
      </a>
      <header className="border-b">
        <div className="max-w-6xl mx-auto p-4 flex items-center justify-between">
          <Link to="/" className="font-semibold">CV Builder</Link>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm"><Link to="/settings">Settings</Link></Button>
            {user ? (
              <Button variant="outline" size="sm" onClick={signOutUser}>Sign out</Button>
            ) : (
              <Button asChild size="sm"><Link to="/login">Sign in</Link></Button>
            )}
          </div>
        </div>
      </header>
      <main id="main-content" tabIndex={-1} className="focus:outline-none">
        {children}
      </main>
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