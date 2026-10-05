import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash } from '@phosphor-icons/react';
import { Experience } from '@/types/cv';

interface ExperienceFormProps {
  data: Experience[];
  onChange: (data: Experience[]) => void;
}

export function ExperienceForm({ data, onChange }: ExperienceFormProps) {
  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: ['']
    };
    onChange([...data, newExp]);
  };

  const removeExperience = (id: string) => {
    onChange(data.filter(exp => exp.id !== id));
  };

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    onChange(data.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  const addAchievement = (expId: string) => {
    updateExperience(expId, 'achievements', 
      [...data.find(exp => exp.id === expId)!.achievements, '']
    );
  };

  const updateAchievement = (expId: string, index: number, value: string) => {
    const exp = data.find(e => e.id === expId)!;
    const newAchievements = [...exp.achievements];
    newAchievements[index] = value;
    updateExperience(expId, 'achievements', newAchievements);
  };

  const removeAchievement = (expId: string, index: number) => {
    const exp = data.find(e => e.id === expId)!;
    const newAchievements = exp.achievements.filter((_, i) => i !== index);
    updateExperience(expId, 'achievements', newAchievements);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Work Experience</CardTitle>
        <Button onClick={addExperience} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Experience
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {data.map((exp, index) => (
          <div key={exp.id} className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Experience {index + 1}</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeExperience(exp.id)}
              >
                <Trash className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Company *</Label>
                <Input
                  value={exp.company}
                  onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                  placeholder="Company Name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>Position *</Label>
                <Input
                  value={exp.position}
                  onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                  placeholder="Job Title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  value={exp.location || ''}
                  onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                  placeholder="City, State"
                />
              </div>

              <div className="space-y-2">
                <Label>Start Date *</Label>
                <Input
                  type="month"
                  value={exp.startDate}
                  onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="month"
                  value={exp.endDate}
                  onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                  disabled={exp.current}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`current-${exp.id}`}
                checked={exp.current}
                onCheckedChange={(checked) => {
                  updateExperience(exp.id, 'current', checked);
                  if (checked) {
                    updateExperience(exp.id, 'endDate', '');
                  }
                }}
              />
              <Label htmlFor={`current-${exp.id}`}>Currently working here</Label>
            </div>
            
            <div className="space-y-2">
              <Label>Job Description</Label>
              <Textarea
                value={exp.description}
                onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                placeholder="Brief description of your role and responsibilities..."
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Key Achievements</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addAchievement(exp.id)}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>
              {exp.achievements.map((achievement, achIndex) => (
                <div key={achIndex} className="flex gap-2">
                  <Input
                    value={achievement}
                    onChange={(e) => updateAchievement(exp.id, achIndex, e.target.value)}
                    placeholder="Describe a key achievement or responsibility..."
                  />
                  {exp.achievements.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeAchievement(exp.id, achIndex)}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {data.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No work experience added yet.</p>
            <Button onClick={addExperience} className="mt-4">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Experience
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}