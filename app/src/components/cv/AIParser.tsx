import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileText, Loader2 } from '@phosphor-icons/react';
import { CVData } from '@/types/cv';
import { toast } from 'sonner';

interface AIParserProps {
  onParsed: (data: CVData) => void;
}

export function AIParser({ onParsed }: AIParserProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [cvText, setCvText] = useState('');

  const parseWithAI = async (text: string) => {
    setIsLoading(true);
    try {
      const prompt = spark.llmPrompt`
        Extract CV/resume information from the following text and return it as a structured JSON object.
        The JSON should match this TypeScript interface:

        interface CVData {
          personalInfo: {
            fullName: string;
            email: string;
            phone: string;
            location: string;
            website?: string;
            linkedin?: string;
            github?: string;
            summary: string;
          };
          experience: Array<{
            id: string;
            company: string;
            position: string;
            startDate: string; // YYYY-MM format
            endDate: string; // YYYY-MM format or empty if current
            current: boolean;
            description: string;
            achievements: string[];
          }>;
          education: Array<{
            id: string;
            institution: string;
            degree: string;
            field: string;
            startDate: string; // YYYY-MM format
            endDate: string; // YYYY-MM format
            gpa?: string;
            honors?: string;
          }>;
          projects: Array<{
            id: string;
            name: string;
            description: string;
            technologies: string[];
            url?: string;
            github?: string;
            startDate: string; // YYYY-MM format
            endDate?: string; // YYYY-MM format
          }>;
          skills: Array<{
            category: string;
            skills: string[];
          }>;
          certifications: string[];
          languages: string[];
        }

        CV Text:
        ${text}

        Return only valid JSON without any markdown formatting or additional text.
      `;

      const response = await spark.llm(prompt, 'gpt-4o', true);
      
      try {
        const parsedData = JSON.parse(response);
        
        // Add IDs if missing
        if (parsedData.experience) {
          parsedData.experience = parsedData.experience.map((exp: any, index: number) => ({
            ...exp,
            id: exp.id || `exp-${Date.now()}-${index}`,
            achievements: exp.achievements || []
          }));
        }
        
        if (parsedData.education) {
          parsedData.education = parsedData.education.map((edu: any, index: number) => ({
            ...edu,
            id: edu.id || `edu-${Date.now()}-${index}`
          }));
        }
        
        if (parsedData.projects) {
          parsedData.projects = parsedData.projects.map((proj: any, index: number) => ({
            ...proj,
            id: proj.id || `proj-${Date.now()}-${index}`,
            technologies: proj.technologies || []
          }));
        }

        // Ensure required arrays exist
        parsedData.experience = parsedData.experience || [];
        parsedData.education = parsedData.education || [];
        parsedData.projects = parsedData.projects || [];
        parsedData.skills = parsedData.skills || [];
        parsedData.certifications = parsedData.certifications || [];
        parsedData.languages = parsedData.languages || [];

        onParsed(parsedData);
        toast.success('CV parsed successfully!');
        setCvText('');
      } catch (parseError) {
        console.error('Failed to parse AI response:', parseError);
        toast.error('Failed to parse CV. Please check the format and try again.');
      }
    } catch (error) {
      console.error('AI parsing failed:', error);
      toast.error('AI parsing failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        parseWithAI(text);
      };
      reader.readAsText(file);
    } else {
      toast.error('Please upload a text file. PDF parsing coming soon!');
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
          Upload an existing CV or paste text to automatically extract structured data
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
                <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Click to upload a CV file (TXT format supported)
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
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
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
      </CardContent>
    </Card>
  );
}