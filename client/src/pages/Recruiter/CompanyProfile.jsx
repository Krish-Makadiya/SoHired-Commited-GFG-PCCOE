import React, { useState } from 'react';
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Textarea } from "@/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/ui/card";
import { useUser } from '@clerk/clerk-react';

const CompanyProfile = () => {
    const { user } = useUser();
    // Defaulting to existing metadata if available
    const [companyName, setCompanyName] = useState(user?.unsafeMetadata?.companyName || "Acme Inc.");
    const [website, setWebsite] = useState("https://acme.com");
    const [location, setLocation] = useState("San Francisco, CA");
    const [description, setDescription] = useState("We are building the future of...");

    return (
        <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Company Profile</h1>
                <p className="text-muted-foreground">Manage your organization's public details.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Organization Details</CardTitle>
                    <CardDescription>This information will be displayed on your job postings.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="logo">Company Logo</Label>
                        <div className="flex items-center gap-4">
                            <div className="h-20 w-20 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center border border-dashed border-neutral-300 dark:border-neutral-700">
                                <span className="text-sm text-muted-foreground">Logo</span>
                            </div>
                            <Button variant="outline" size="sm">Upload New</Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="companyName">Company Name</Label>
                            <Input id="companyName" value={companyName} onChange={e => setCompanyName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="website">Website</Label>
                            <Input id="website" value={website} onChange={e => setWebsite(e.target.value)} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="location">Headquarters</Label>
                        <Input id="location" value={location} onChange={e => setLocation(e.target.value)} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">About Company</Label>
                        <Textarea id="description" className="min-h-[150px]" value={description} onChange={e => setDescription(e.target.value)} />
                    </div>

                    <div className="flex justify-end">
                        <Button>Save Changes</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default CompanyProfile;
