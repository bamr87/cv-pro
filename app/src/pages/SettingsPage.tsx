import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db, firebaseReady } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Eye, EyeSlash } from '@phosphor-icons/react';

type Provider = 'grok' | 'openai' | 'affinda';

export function SettingsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState<Provider>('grok');
  const [apiKey, setApiKey] = useState('');
  // The key is masked by default; the toggle reveals it on demand.
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    const load = async () => {
      // db is undefined when the VITE_FIREBASE_* env vars are absent — same guard
      // the rest of the app uses before touching Firestore.
      if (!user || !firebaseReady || !db) return;
      setLoading(true);
      try {
        const ref = doc(db, 'users', user.uid, 'settings', 'ai');
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data() as any;
          setProvider((data.provider as Provider) || 'grok');
          setApiKey(data.apiKey || '');
        }
      } catch (e) {
        toast.error(e instanceof Error ? e.message : 'Failed to load AI settings');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const save = async () => {
    if (!user) return;
    if (!firebaseReady || !db) {
      toast.error('Firebase is not configured — AI settings cannot be saved');
      return;
    }
    setLoading(true);
    try {
      const ref = doc(db, 'users', user.uid, 'settings', 'ai');
      await setDoc(ref, { provider, apiKey }, { merge: true });
      toast.success('AI settings saved');
    } catch (e: any) {
      toast.error(e?.message || 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 flex justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>AI Integration Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Provider</label>
            <Select value={provider} onValueChange={(v: Provider) => setProvider(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grok">xAI Grok</SelectItem>
                <SelectItem value="openai">OpenAI</SelectItem>
                <SelectItem value="affinda">Affinda</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label htmlFor="api-key" className="text-sm font-medium">API Key</label>
            <div className="flex gap-2">
              <Input
                id="api-key"
                type={showKey ? 'text' : 'password'}
                autoComplete="off"
                spellCheck={false}
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                placeholder="sk-..."
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-pressed={showKey}
                aria-label={showKey ? 'Hide API key' : 'Show API key'}
                onClick={() => setShowKey(v => !v)}
              >
                {showKey ? <EyeSlash /> : <Eye />}
              </Button>
            </div>
          </div>
          <Button onClick={save} disabled={loading || !apiKey.trim()}>Save</Button>
        </CardContent>
      </Card>
    </div>
  );
}


