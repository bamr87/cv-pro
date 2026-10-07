import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DownloadSimple, FileText, Code, BracketsCurly, UploadSimple } from '@phosphor-icons/react';
import { CVData } from '@/types/cv';
import { exportToMarkdown, exportToASCII, downloadFile } from '@/lib/export-utils';
import { latexTemplates, generateLaTeX } from '@/lib/latex-templates';
import { serializeCVData, parseCVData } from '@/lib/cv-json';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

interface ExportSectionProps {
  data: CVData;
  onImport?: (data: CVData) => void;
}

type ExportFormat = 'markdown' | 'ascii' | 'latex' | 'json';

export function ExportSection({ data, onImport }: ExportSectionProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('markdown');
  const [selectedTemplate, setSelectedTemplate] = useState(latexTemplates[0].id);
  const importInputRef = useRef<HTMLInputElement>(null);

  // The Quick Actions pass their format in explicitly. Calling setSelectedFormat
  // and then reading selectedFormat would still see the previous render's value,
  // so a one-click export has to be told which format it is.
  const handleExport = (format: ExportFormat = selectedFormat) => {
    const fileName = data.personalInfo.fullName.replace(/\s+/g, '_') || 'CV';

    try {
      switch (format) {
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
          if (!template) throw new Error(`Unknown LaTeX template "${selectedTemplate}"`);
          const latex = generateLaTeX(template, data);
          downloadFile(latex, `${fileName}.tex`, 'text/plain');
          toast.success('CV exported as LaTeX');
          break;
        }

        case 'json': {
          // Fixed filename: this is the canonical data file, drop-in for the
          // bamr87/cv repo's data/cv.json.
          downloadFile(serializeCVData(data), 'cv.json', 'application/json');
          toast.success('CV data exported as cv.json');
          break;
        }
      }
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Export failed. Please try again.');
    }
  };

  const handleImportFile = async (file: File | undefined) => {
    if (!file || !onImport) return;
    try {
      const text = await file.text();
      onImport(parseCVData(text));
      toast.success(`Imported CV data from ${file.name}`);
    } catch (error) {
      console.error('Import failed:', error);
      toast.error(`Import failed: ${error instanceof Error ? error.message : 'unreadable file'}`);
    } finally {
      if (importInputRef.current) importInputRef.current.value = '';
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
      case 'json':
        return <BracketsCurly className="w-4 h-4" />;
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
      case 'json':
        return 'Canonical CV data (cv.json) - round-trips with the bamr87/cv build machine';
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
                <SelectItem value="json">
                  <div className="flex items-center gap-2">
                    <BracketsCurly className="w-4 h-4" />
                    CV Data (cv.json)
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
            onClick={() => handleExport()}
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
                handleExport('markdown');
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
                handleExport('latex');
              }}
              disabled={!isDataComplete()}
            >
              <Code className="w-4 h-4 mr-2" />
              Quick Export LaTeX
            </Button>
          </div>
        </div>

        {onImport && (
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Data File (bamr87/cv)</h4>
            <p className="text-xs text-muted-foreground mb-2">
              cv.json is the canonical data format shared with the{' '}
              <a
                href="https://github.com/bamr87/cv"
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                bamr87/cv build machine
              </a>
              : import its data/cv.json to edit here, export it back to publish.
            </p>
            <input
              ref={importInputRef}
              type="file"
              accept=".json,application/json"
              className="hidden"
              data-testid="import-cv-json"
              onChange={(e) => handleImportFile(e.target.files?.[0])}
            />
            <div className="grid grid-cols-1 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => importInputRef.current?.click()}
              >
                <UploadSimple className="w-4 h-4 mr-2" />
                Import cv.json
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedFormat('json');
                  handleExport('json');
                }}
                disabled={!isDataComplete()}
              >
                <BracketsCurly className="w-4 h-4 mr-2" />
                Export cv.json
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}