import { useState } from 'react';
import { useKV } from '@github/spark/hooks';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PersonalInfoForm } from './PersonalInfoForm';
import { ExperienceForm } from './ExperienceForm';
import { EducationForm } from './EducationForm';
import { SkillsForm } from './SkillsForm';
import { ProjectsForm } from './ProjectsForm';
import { ExportSection } from './ExportSection';
import { AIParser } from './AIParser';
import { CVData, defaultCVData } from '@/types/cv';
import { User, Briefcase, GraduationCap, Wrench, FolderOpen, DownloadSimple, Robot, Save } from '@phosphor-icons/react';
import { toast } from 'sonner';

export function CVBuilder() {
  const [cvData, setCvData, deleteCvData] = useKV<CVData>('cv-data', defaultCVData);
  const [activeTab, setActiveTab] = useState('personal');

  const handleSave = () => {
    setCvData(cvData);
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
          <Save className="w-4 h-4" />
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
            data={cvData.personalInfo}
            onChange={(personalInfo) => setCvData({ ...cvData, personalInfo })}
          />
        </TabsContent>

        <TabsContent value="experience" className="space-y-6">
          <ExperienceForm
            data={cvData.experience}
            onChange={(experience) => setCvData({ ...cvData, experience })}
          />
        </TabsContent>

        <TabsContent value="education" className="space-y-6">
          <EducationForm
            data={cvData.education}
            onChange={(education) => setCvData({ ...cvData, education })}
          />
        </TabsContent>

        <TabsContent value="skills" className="space-y-6">
          <SkillsForm
            data={cvData.skills}
            onChange={(skills) => setCvData({ ...cvData, skills })}
            certifications={cvData.certifications}
            onCertificationsChange={(certifications) => setCvData({ ...cvData, certifications })}
            languages={cvData.languages}
            onLanguagesChange={(languages) => setCvData({ ...cvData, languages })}
          />
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          <ProjectsForm
            data={cvData.projects}
            onChange={(projects) => setCvData({ ...cvData, projects })}
          />
        </TabsContent>

        <TabsContent value="export" className="space-y-6">
          <ExportSection data={cvData} />
        </TabsContent>

        <TabsContent value="ai-parser" className="space-y-6">
          <AIParser onParsed={handleAIParsed} />
        </TabsContent>
      </Tabs>
    </div>
  );
}