import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash, X } from '@phosphor-icons/react';
import { Skill } from '@/types/cv';
import { useState } from 'react';

interface SkillsFormProps {
  data: Skill[];
  onChange: (data: Skill[]) => void;
  certifications: string[];
  onCertificationsChange: (certifications: string[]) => void;
  languages: string[];
  onLanguagesChange: (languages: string[]) => void;
}

export function SkillsForm({ 
  data, 
  onChange, 
  certifications, 
  onCertificationsChange,
  languages,
  onLanguagesChange 
}: SkillsFormProps) {
  const [newCategory, setNewCategory] = useState('');
  const [newSkills, setNewSkills] = useState('');
  const [newCertification, setNewCertification] = useState('');
  const [newLanguage, setNewLanguage] = useState('');

  const addSkillCategory = () => {
    if (!newCategory.trim() || !newSkills.trim()) return;
    
    const skills = newSkills.split(',').map(s => s.trim()).filter(s => s);
    const newSkillGroup: Skill = {
      category: newCategory.trim(),
      skills
    };
    
    onChange([...data, newSkillGroup]);
    setNewCategory('');
    setNewSkills('');
  };

  const removeSkillCategory = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const updateSkillCategory = (index: number, field: keyof Skill, value: any) => {
    onChange(data.map((skill, i) => 
      i === index ? { ...skill, [field]: value } : skill
    ));
  };

  const addCertification = () => {
    if (!newCertification.trim()) return;
    onCertificationsChange([...certifications, newCertification.trim()]);
    setNewCertification('');
  };

  const removeCertification = (index: number) => {
    onCertificationsChange(certifications.filter((_, i) => i !== index));
  };

  const addLanguage = () => {
    if (!newLanguage.trim()) return;
    onLanguagesChange([...languages, newLanguage.trim()]);
    setNewLanguage('');
  };

  const removeLanguage = (index: number) => {
    onLanguagesChange(languages.filter((_, i) => i !== index));
  };

  const removeSkillFromCategory = (categoryIndex: number, skillIndex: number) => {
    const updatedSkills = data[categoryIndex].skills.filter((_, i) => i !== skillIndex);
    updateSkillCategory(categoryIndex, 'skills', updatedSkills);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Technical Skills</CardTitle>
          <p className="text-sm text-muted-foreground">
            Organize your skills by category (e.g., Programming Languages, Frameworks, Tools)
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {data.map((skillGroup, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{skillGroup.category}</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeSkillCategory(index)}
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-2">
                <Label>Category Name</Label>
                <Input
                  value={skillGroup.category}
                  onChange={(e) => updateSkillCategory(index, 'category', e.target.value)}
                  placeholder="e.g., Programming Languages"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Skills</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {skillGroup.skills.map((skill, skillIndex) => (
                    <Badge key={skillIndex} variant="secondary" className="flex items-center gap-1">
                      {skill}
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => removeSkillFromCategory(index, skillIndex)}
                      />
                    </Badge>
                  ))}
                </div>
                <Input
                  value={skillGroup.skills.join(', ')}
                  onChange={(e) => {
                    const skills = e.target.value.split(',').map(s => s.trim()).filter(s => s);
                    updateSkillCategory(index, 'skills', skills);
                  }}
                  placeholder="JavaScript, Python, React (comma-separated)"
                />
              </div>
            </div>
          ))}
          
          <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
            <h4 className="font-medium">Add New Skill Category</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category Name</Label>
                <Input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="e.g., Programming Languages"
                />
              </div>
              <div className="space-y-2">
                <Label>Skills (comma-separated)</Label>
                <Input
                  value={newSkills}
                  onChange={(e) => setNewSkills(e.target.value)}
                  placeholder="JavaScript, Python, React"
                />
              </div>
            </div>
            <Button onClick={addSkillCategory} disabled={!newCategory || !newSkills}>
              <Plus className="w-4 h-4 mr-2" />
              Add Skill Category
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Certifications</CardTitle>
          <p className="text-sm text-muted-foreground">
            List your professional certifications and licenses
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {certifications.map((cert, index) => (
              <Badge key={index} variant="outline" className="flex items-center gap-1">
                {cert}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => removeCertification(index)}
                />
              </Badge>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Input
              value={newCertification}
              onChange={(e) => setNewCertification(e.target.value)}
              placeholder="e.g., AWS Solutions Architect"
              onKeyPress={(e) => e.key === 'Enter' && addCertification()}
            />
            <Button onClick={addCertification} disabled={!newCertification.trim()}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Languages</CardTitle>
          <p className="text-sm text-muted-foreground">
            List languages you speak and your proficiency level
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {languages.map((language, index) => (
              <Badge key={index} variant="outline" className="flex items-center gap-1">
                {language}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => removeLanguage(index)}
                />
              </Badge>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Input
              value={newLanguage}
              onChange={(e) => setNewLanguage(e.target.value)}
              placeholder="e.g., Spanish (Fluent), French (Intermediate)"
              onKeyPress={(e) => e.key === 'Enter' && addLanguage()}
            />
            <Button onClick={addLanguage} disabled={!newLanguage.trim()}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}