import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/ui/card";
import { Button } from "@/ui/button";
import { Badge } from "@/ui/badge";
import { Progress } from "@/ui/progress";
import { Clock, FileCheck, UploadCloud, AlertCircle } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const ActiveProjects = () => {
    const navigate = useNavigate();

    // Projects where the user has been "Shortlisted" or "Hired" and work is in progress
    const projects = [
        {
            id: 101,
            title: "Fintech Dashboard UI Kit",
            company: "Alpha Finance",
            deadline: "2024-04-10",
            progress: 60,
            status: "In Progress",
            nextMilestone: "High Fidelity Prototypes",
            compensation: "Basic Fee + $1000 Prize"
        },
        {
            id: 102,
            title: "React Native App Refactor",
            company: "MobileGurus",
            deadline: "2024-04-05",
            progress: 20,
            status: "On Track",
            nextMilestone: "Code Cleanup Analysis",
            compensation: "$800 Fixed"
        }
    ];

    return (
        <div className="p-6 md:p-8 space-y-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Active Projects</h1>
                <p className="text-muted-foreground">Manage your ongoing work and submit milestones.</p>
            </div>

            <div className="space-y-6">
                {projects.map((project) => (
                    <Card key={project.id} className="overflow-hidden">
                        <div className="flex flex-col md:flex-row">
                            <div className="flex-1 p-6 space-y-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-xl font-bold">{project.title}</h2>
                                        <Badge variant="outline" className="border-indigo-200 text-indigo-700 bg-indigo-50 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800">
                                            {project.status}
                                        </Badge>
                                    </div>
                                    <p className="text-muted-foreground text-sm">for {project.company}</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-4">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-orange-500" />
                                        <span className="font-medium">Deadline: {project.deadline}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FileCheck className="w-4 h-4 text-blue-500" />
                                        <span>Next: {project.nextMilestone}</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>Progress</span>
                                        <span>{project.progress}%</span>
                                    </div>
                                    <Progress value={project.progress} className="h-2" />
                                </div>
                            </div>

                            <div className="bg-neutral-50 dark:bg-neutral-900 p-6 flex flex-col justify-center items-start md:items-end gap-3 min-w-[250px] border-t md:border-t-0 md:border-l">
                                <div className="text-sm font-medium text-muted-foreground mb-2">Compensation: {project.compensation}</div>
                                <Button className="w-full md:w-auto gap-2" onClick={() => navigate(`/dashboard/submit-work/${project.id}`)}>
                                    <UploadCloud className="w-4 h-4" />
                                    Submit Work
                                </Button>
                                <Button variant="outline" className="w-full md:w-auto text-xs h-8">View Requirements</Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default ActiveProjects;
