import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileText, CircleNotch, FilePdf } from '@phosphor-icons/react';
import { CVData } from '@/types/cv';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { db, firebaseReady } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { extractTextFromPdf } from '@/lib/pdf';
import { parseCvText, AISettings } from '@/lib/aiClient';
import { parseCVData } from '@/lib/cv-json';

interface AIParserProps {
  onParsed: (data: CVData) => void;
}

export function AIParser({ onParsed }: AIParserProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [cvText, setCvText] = useState('');
  const { user } = useAuth();
  const [settings, setSettings] = useState<AISettings | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!user || !firebaseReady || !db) { setSettings(null); return; }
      try {
        const ref = doc(db, 'users', user.uid, 'settings', 'ai');
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data() as any;
          if (data?.apiKey && data?.provider) {
            setSettings({ provider: data.provider, apiKey: data.apiKey });
          } else {
            setSettings(null);
          }
        } else {
          setSettings(null);
        }
      } catch {
        setSettings(null);
      }
    };
    load();
  }, [user]);

  const parseWithAI = async (text: string) => {
    setIsLoading(true);
    try {
      if (!user) {
        toast.error('Sign in to use AI parsing');
        return;
      }
      if (!settings) {
        toast.error('Configure your AI provider and API key in Settings');
        return;
      }

      const jsonString = await parseCvText(settings, text);
      let parsedData: CVData;
      try {
        // Normalize through the same reader the cv.json import uses: it backfills
        // missing ids, fills absent sections, drops keys outside the contract, and
        // rejects a response that is not a CV — so a provider's error payload or a
        // half-hallucinated object can never be handed to the forms as CVData.
        parsedData = parseCVData(jsonString);
      } catch (parseError) {
        console.error('Failed to parse AI response:', parseError);
        toast.error('The AI did not return usable CV data. Try again, or paste a cleaner excerpt.');
        return;
      }

      onParsed(parsedData);
      toast.success('CV parsed successfully!');
      setCvText('');
    } catch (error) {
      // Surface the provider's own message (bad key, quota, rate limit) — it is
      // the only part of this failure the user can act on.
      console.error('AI parsing failed:', error);
      toast.error(`AI parsing failed: ${error instanceof Error ? error.message : 'unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    const file = input.files?.[0];
    if (!file) return;
    // Clear the picker (the File reference above stays valid) so re-selecting the
    // same file after a failed parse still fires onChange instead of doing nothing.
    input.value = '';

    if (file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        parseWithAI(text);
      };
      reader.onerror = () => toast.error('Could not read the selected file');
      reader.readAsText(file);
    } else if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      try {
        setIsLoading(true);
        const text = await extractTextFromPdf(file);
        await parseWithAI(text);
      } catch {
        toast.error('Failed to extract text from PDF');
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error('Unsupported file type. Use .txt or .pdf');
    }
  };

  const handleTextParse = () => {
    if (!cvText.trim()) {
      toast.error('Please enter CV text to parse');
      return;
    }
    parseWithAI(cvText);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          AI CV Parser
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Upload an existing CV (PDF or TXT) or paste text to automatically extract structured data
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Upload CV File</label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <input
                type="file"
                accept=".txt,.pdf"
                onChange={handleFileUpload}
                className="hidden"
                id="cv-upload"
                disabled={isLoading}
              />
              <label htmlFor="cv-upload" className="cursor-pointer">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                  <div className="flex gap-2">
                    <div className="flex items-center gap-1 px-2 py-1 bg-secondary rounded-md">
                      <FileText className="w-4 h-4" />
                      <span className="text-xs">TXT</span>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 bg-secondary rounded-md">
                      <FilePdf className="w-4 h-4" />
                      <span className="text-xs">PDF</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Click to upload a CV file (TXT or PDF format supported)
                </p>
              </label>
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            or
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Paste CV Text</label>
            <Textarea
              value={cvText}
              onChange={(e) => setCvText(e.target.value)}
              placeholder="Paste your CV text here..."
              rows={8}
              disabled={isLoading}
            />
          </div>

          <Button 
            onClick={handleTextParse} 
            disabled={isLoading || !cvText.trim()}
            className="w-full"
          >
            {isLoading ? (
              <>
                <CircleNotch className="w-4 h-4 mr-2 animate-spin" />
                Parsing with AI...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4 mr-2" />
                Parse CV with AI
              </>
            )}
          </Button>
        </div>

        {!user && (
          <p className="text-xs text-muted-foreground text-center">Sign in to enable AI parsing.</p>
        )}
        {user && !settings && (
          <p className="text-xs text-muted-foreground text-center">Add your AI API key in Settings to use this feature.</p>
        )}
      </CardContent>
    </Card>
  );
}