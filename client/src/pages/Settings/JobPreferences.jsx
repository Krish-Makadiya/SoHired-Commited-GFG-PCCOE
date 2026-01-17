import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/ui/card";
import { Label } from "@/ui/label";
import { Button } from "@/ui/button";
import { useUser } from '@clerk/clerk-react';
import { Badge } from "@/ui/badge";
import { Select } from '@/ui/select'; // Assuming this component exists or use native

const JobPreferences = () => {
    const { user } = useUser();
    // Placeholder for job preferences logic
    // This could just show the onboarding data in a read-only or editable format

    return (
        <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Job & Project Preferences</h1>
                <p className="text-muted-foreground">Tailor your feed to your skills and interests.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Your Preferences</CardTitle>
                    <CardDescription>These settings affect the projects shown in your dashboard.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-4 bg-neutral-100 dark:bg-neutral-900 rounded-md">
                        <p className="text-sm text-muted-foreground">
                            Preferences editing is currently disabled. Please update your
                            <span className="font-semibold text-foreground"> Skills </span>
                            in your Profile to see relevant projects.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default JobPreferences;
