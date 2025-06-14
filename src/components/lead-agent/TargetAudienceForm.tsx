
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TargetAudience } from "@/pages/LeadAgent";

interface TargetAudienceFormProps {
  targetAudience: TargetAudience;
  onUpdate: (audience: TargetAudience) => void;
}

export function TargetAudienceForm({ targetAudience, onUpdate }: TargetAudienceFormProps) {
  const handleInputChange = (field: keyof TargetAudience, value: string) => {
    onUpdate({
      ...targetAudience,
      [field]: value
    });
  };

  const clearForm = () => {
    onUpdate({
      industry: "",
      companySize: "",
      jobTitle: "",
      location: "",
      techStack: ""
    });
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Zielgruppen-Definition</h2>
        <Button variant="outline" size="sm" onClick={clearForm}>
          Zurücksetzen
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="industry">Branche/Industry</Label>
          <Input
            id="industry"
            placeholder="z.B. SaaS, E-Commerce, Fintech"
            value={targetAudience.industry}
            onChange={(e) => handleInputChange("industry", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="companySize">Firmengröße (Mitarbeiteranzahl)</Label>
          <Input
            id="companySize"
            placeholder="z.B. 50-200, 1000+, Startup"
            value={targetAudience.companySize}
            onChange={(e) => handleInputChange("companySize", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="jobTitle">Position/Job Title</Label>
          <Input
            id="jobTitle"
            placeholder="z.B. CTO, Marketing Manager, CEO"
            value={targetAudience.jobTitle}
            onChange={(e) => handleInputChange("jobTitle", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="location">Location (Land/Region)</Label>
          <Input
            id="location"
            placeholder="z.B. Deutschland, DACH, Europa"
            value={targetAudience.location}
            onChange={(e) => handleInputChange("location", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="techStack">Technologie-Stack (optional)</Label>
          <Input
            id="techStack"
            placeholder="z.B. React, AWS, Salesforce"
            value={targetAudience.techStack || ""}
            onChange={(e) => handleInputChange("techStack", e.target.value)}
          />
        </div>
      </div>
    </Card>
  );
}
