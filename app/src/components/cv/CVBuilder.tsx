import { useState } from 'react';
import { usePersistedState } from '@/lib/usePersistedState';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PersonalInfoForm } from './PersonalInfoForm';
import { ExperienceForm } from './ExperienceForm';
import { EducationForm } from './EducationForm';
import { SkillsForm } from './SkillsForm';
import { ProjectsForm } from './ProjectsForm';
import { ExportSection } from './ExportSection';
import { AIParser } from './AIParser';
import { CVData, defaultCVData } from '@/types/cv';
import { User, Briefcase, GraduationCap, Wrench, FolderOpen, DownloadSimple, Robot, FloppyDisk } from '@phosphor-icons/react';
import { toast } from 'sonner';

export function CVBuilder() {
  const [cvData, setCvData] = usePersistedState<CVData>('cv-data', defaultCVData);
  const [activeTab, setActiveTab] = useState('personal');

  // Ensure cvData is never undefined
  const safeData = cvData || defaultCVData;

  const handleSave = () => {
    setCvData(safeData);
    toast.success('CV data saved successfully!');
  };

  const handleAIParsed = (parsedData: CVData) => {
    setCvData(parsedData);
    setActiveTab('personal');
    toast.success('CV data imported from AI parsing!');
  };

  const tabs = [
    { id: 'personal', label: 'Personal', icon: User },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'skills', label: 'Skills', icon: Wrench },
    { id: 'projects', label: 'Projects', icon: FolderOpen },
    { id: 'export', label: 'Export', icon: DownloadSimple },
    { id: 'ai-parser', label: 'AI Parser', icon: Robot }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">CV Builder</h1>
        <p className="text-muted-foreground">
          Create professional CVs with LaTeX templating and AI-powered parsing
        </p>
      </div>

      <div className="flex justify-center">
        <Button onClick={handleSave} size="lg" className="gap-2">
          <FloppyDisk className="w-4 h-4" />
          Save Progress
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          <PersonalInfoForm
            data={safeData.personalInfo}
            onChange={(personalInfo) => setCvData((current) => ({ ...(current || defaultCVData), personalInfo }))}
          />
        </TabsContent>

        <TabsContent value="experience" className="space-y-6">
          <ExperienceForm
            data={safeData.experience}
            onChange={(experience) => setCvData((current) => ({ ...(current || defaultCVData), experience }))}
          />
        </TabsContent>

        <TabsContent value="education" className="space-y-6">
          <EducationForm
            data={safeData.education}
            onChange={(education) => setCvData((current) => ({ ...(current || defaultCVData), education }))}
          />
        </TabsContent>

        <TabsContent value="skills" className="space-y-6">
          <SkillsForm
            data={safeData.skills}
            onChange={(skills) => setCvData((current) => ({ ...(current || defaultCVData), skills }))}
            certifications={safeData.certifications}
            onCertificationsChange={(certifications) => setCvData((current) => ({ ...(current || defaultCVData), certifications }))}
            languages={safeData.languages}
            onLanguagesChange={(languages) => setCvData((current) => ({ ...(current || defaultCVData), languages }))}
          />
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          <ProjectsForm
            data={safeData.projects}
            onChange={(projects) => setCvData((current) => ({ ...(current || defaultCVData), projects }))}
          />
        </TabsContent>

        <TabsContent value="export" className="space-y-6">
          <ExportSection data={safeData} />
        </TabsContent>

        <TabsContent value="ai-parser" className="space-y-6">
          <AIParser onParsed={handleAIParsed} />
        </TabsContent>
      </Tabs>
    </div>
  );
}