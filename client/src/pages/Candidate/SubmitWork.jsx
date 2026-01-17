import React, { useState } from 'react';
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Textarea } from "@/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/ui/card";
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2, CheckCircle } from "lucide-react";

const SubmitWork = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = () => {
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitted(true);
        }, 1500);
    };

    if (submitted) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8 animate-in fade-in zoom-in duration-300">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Submission Received!</h2>
                <p className="text-muted-foreground max-w-md mb-8">
                    Your work has been submitted successfully. The company will review it and you will be notified of any updates.
                </p>
                <Button onClick={() => navigate('/dashboard/active-projects')}>Back to Projects</Button>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Button variant="ghost" className="mb-6 pl-0" onClick={() => navigate(-1)}>← Back</Button>

            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Submit Design / Prototype</h1>
                <p className="text-muted-foreground mt-1">Project ID: #{projectId}</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Submission Details</CardTitle>
                    <CardDescription>Please provide links to your work and a brief explanation.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label>Primary Link (Required)</Label>
                        <Input placeholder="e.g. Figma Link, GitHub Repository, Hosted URL" />
                        <p className="text-xs text-muted-foreground">Ensure permissions are set to 'View' or 'Comment' for the client.</p>
                    </div>

                    <div className="space-y-2">
                        <Label>Additional Link (Optional)</Label>
                        <Input placeholder="e.g. Loom Walkthrough, Documentation" />
                    </div>

                    <div className="space-y-2">
                        <Label>Comments / Implementation Notes</Label>
                        <Textarea
                            placeholder="Briefly explain your approach, key decisions, and any instructions for testing..."
                            className="min-h-[150px]"
                        />
                    </div>

                    <div className="pt-4 flex justify-end">
                        <Button size="lg" onClick={handleSubmit} disabled={isSubmitting} className="w-full md:w-auto">
                            {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : "Submit Work"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SubmitWork;
