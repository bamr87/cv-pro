import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DownloadSimple, FileText, Code } from '@phosphor-icons/react';
import { CVData } from '@/types/cv';
import { exportToMarkdown, exportToASCII, downloadFile } from '@/lib/export-utils';
import { latexTemplates, generateLaTeX } from '@/lib/latex-templates';
import { useState } from 'react';
import { toast } from 'sonner';

interface ExportSectionProps {
  data: CVData;
}

type ExportFormat = 'markdown' | 'ascii' | 'latex';

export function ExportSection({ data }: ExportSectionProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('markdown');
  const [selectedTemplate, setSelectedTemplate] = useState(latexTemplates[0].id);

  const handleExport = () => {
    const fileName = data.personalInfo.fullName.replace(/\s+/g, '_') || 'CV';
    
    try {
      switch (selectedFormat) {
        case 'markdown': {
          const markdown = exportToMarkdown(data);
          downloadFile(markdown, `${fileName}.md`, 'text/markdown');
          toast.success('CV exported as Markdown');
          break;
        }

        case 'ascii': {
          const ascii = exportToASCII(data);
          downloadFile(ascii, `${fileName}.txt`, 'text/plain');
          toast.success('CV exported as ASCII text');
          break;
        }

        case 'latex': {
          const template = latexTemplates.find(t => t.id === selectedTemplate);
          if (template) {
            const latex = generateLaTeX(template, data);
            downloadFile(latex, `${fileName}.tex`, 'text/plain');
            toast.success('CV exported as LaTeX');
          }
          break;
        }
      }
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Export failed. Please try again.');
    }
  };

  const isDataComplete = () => {
    return data.personalInfo.fullName && 
           data.personalInfo.email && 
           (data.experience.length > 0 || data.education.length > 0);
  };

  const getFormatIcon = (format: ExportFormat) => {
    switch (format) {
      case 'markdown':
        return <FileText className="w-4 h-4" />;
      case 'ascii':
        return <FileText className="w-4 h-4" />;
      case 'latex':
        return <Code className="w-4 h-4" />;
    }
  };

  const getFormatDescription = (format: ExportFormat) => {
    switch (format) {
      case 'markdown':
        return 'Markdown format - great for GitHub, documentation, and web publishing';
      case 'ascii':
        return 'Plain text format - universal compatibility, email-friendly';
      case 'latex':
        return 'LaTeX source code - for professional typesetting and PDF generation';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DownloadSimple className="w-5 h-5" />
          Export CV
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Download your CV in various formats
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Export Format</label>
            <Select value={selectedFormat} onValueChange={(value: ExportFormat) => setSelectedFormat(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="markdown">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Markdown (.md)
                  </div>
                </SelectItem>
                <SelectItem value="ascii">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    ASCII Text (.txt)
                  </div>
                </SelectItem>
                <SelectItem value="latex">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    LaTeX Source (.tex)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {getFormatDescription(selectedFormat)}
            </p>
          </div>

          {selectedFormat === 'latex' && (
            <div className="space-y-2">
              <label className="text-sm font-medium">LaTeX Template</label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {latexTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      <div>
                        <div className="font-medium">{template.name}</div>
                        <div className="text-xs text-muted-foreground">{template.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Button 
            onClick={handleExport} 
            disabled={!isDataComplete()}
            className="w-full"
            size="lg"
          >
            {getFormatIcon(selectedFormat)}
            <span className="ml-2">
              Export as {selectedFormat.toUpperCase()}
            </span>
          </Button>

          {!isDataComplete() && (
            <p className="text-xs text-muted-foreground text-center">
              Please fill in basic information (name, email) and add at least one experience or education entry to export.
            </p>
          )}
        </div>

        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">Quick Actions</h4>
          <div className="grid grid-cols-1 gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setSelectedFormat('markdown');
                setTimeout(handleExport, 100);
              }}
              disabled={!isDataComplete()}
            >
              <FileText className="w-4 h-4 mr-2" />
              Quick Export Markdown
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setSelectedFormat('latex');
                setTimeout(handleExport, 100);
              }}
              disabled={!isDataComplete()}
            >
              <Code className="w-4 h-4 mr-2" />
              Quick Export LaTeX
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}