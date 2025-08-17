import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, X } from '@phosphor-icons/react';
import { Project } from '@/types/cv';

interface ProjectsFormProps {
  data: Project[];
  onChange: (data: Project[]) => void;
}

export function ProjectsForm({ data, onChange }: ProjectsFormProps) {
  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: '',
      description: '',
      technologies: [],
      url: '',
      github: '',
      startDate: '',
      endDate: ''
    };
    onChange([...data, newProject]);
  };

  const removeProject = (id: string) => {
    onChange(data.filter(project => project.id !== id));
  };

  const updateProject = (id: string, field: keyof Project, value: any) => {
    onChange(data.map(project => 
      project.id === id ? { ...project, [field]: value } : project
    ));
  };

  const addTechnology = (projectId: string, technology: string) => {
    const project = data.find(p => p.id === projectId);
    if (project && technology.trim() && !project.technologies.includes(technology.trim())) {
      updateProject(projectId, 'technologies', [...project.technologies, technology.trim()]);
    }
  };

  const removeTechnology = (projectId: string, techIndex: number) => {
    const project = data.find(p => p.id === projectId);
    if (project) {
      const newTechnologies = project.technologies.filter((_, i) => i !== techIndex);
      updateProject(projectId, 'technologies', newTechnologies);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Projects</CardTitle>
        <Button onClick={addProject} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {data.map((project, index) => (
          <div key={project.id} className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Project {index + 1}</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeProject(project.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Project Name *</Label>
                <Input
                  value={project.name}
                  onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                  placeholder="My Awesome Project"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="month"
                  value={project.startDate}
                  onChange={(e) => updateProject(project.id, 'startDate', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Live URL</Label>
                <Input
                  type="url"
                  value={project.url || ''}
                  onChange={(e) => updateProject(project.id, 'url', e.target.value)}
                  placeholder="https://myproject.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="month"
                  value={project.endDate || ''}
                  onChange={(e) => updateProject(project.id, 'endDate', e.target.value)}
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label>GitHub Repository</Label>
                <Input
                  type="url"
                  value={project.github || ''}
                  onChange={(e) => updateProject(project.id, 'github', e.target.value)}
                  placeholder="https://github.com/username/project"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Project Description *</Label>
              <Textarea
                value={project.description}
                onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                placeholder="Describe what this project does, its key features, and your role in developing it..."
                rows={3}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>Technologies Used</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {project.technologies.map((tech, techIndex) => (
                  <Badge key={techIndex} variant="secondary" className="flex items-center gap-1">
                    {tech}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => removeTechnology(project.id, techIndex)}
                    />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add technology (e.g., React, Node.js, PostgreSQL)"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const input = e.target as HTMLInputElement;
                      addTechnology(project.id, input.value);
                      input.value = '';
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    const input = (e.target as HTMLElement).parentElement?.querySelector('input') as HTMLInputElement;
                    if (input) {
                      addTechnology(project.id, input.value);
                      input.value = '';
                    }
                  }}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Press Enter or click + to add each technology
              </p>
            </div>
          </div>
        ))}
        
        {data.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No projects added yet.</p>
            <Button onClick={addProject} className="mt-4">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Project
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}