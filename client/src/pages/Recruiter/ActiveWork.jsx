import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/ui/card";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Checkbox } from "@/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar";
import { Clock, CheckCircle2, AlertCircle, Loader2, Building2, User, FileText } from "lucide-react";
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { toast } from "sonner";
import { Progress } from "@/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/ui/dialog";

const ActiveWork = () => {
    const { user } = useUser();
    const [engagements, setEngagements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [verifyingTask, setVerifyingTask] = useState(null);

    useEffect(() => {
        const fetchActiveWork = async () => {
            if (!user) return;
            try {
                const response = await axios.get(`${import.meta.env.VITE_SERVER_API}/api/jobs/active-work/${user.id}`);
                setEngagements(response.data.activeEngagements);
            } catch (error) {
                console.error("Error fetching active work:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchActiveWork();
    }, [user]);

    const handleVerifyTask = async (jobId, applicantId, taskIndex) => {
        try {
            await axios.patch(`${import.meta.env.VITE_SERVER_API}/api/jobs/${jobId}/applicants/${applicantId}/tasks`, {
                taskIndex,
                status: 'verified'
            });

            // Update local state
            setEngagements(prev => prev.map(eng => {
                if (eng.id === applicantId && eng.jobId === jobId) {
                    const updatedProgress = { ...eng.taskProgress };
                    updatedProgress[taskIndex] = { ...updatedProgress[taskIndex], status: 'verified' };
                    return { ...eng, taskProgress: updatedProgress };
                }
                return eng;
            }));

            toast.success("Task work verified successfully");
            setVerifyingTask(null);
        } catch (error) {
            console.error("Error verifying task:", error);
            toast.error("Failed to verify task");
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Active Contracts</h1>
                <p className="text-muted-foreground text-lg">Manage ongoing projects and verify candidate milestones.</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {engagements.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground border-2 border-dashed rounded-xl bg-neutral-50 dark:bg-neutral-900/50">
                        <User className="w-12 h-12 mx-auto mb-4 text-neutral-300" />
                        <h3 className="text-xl font-medium text-foreground">No active contracts yet</h3>
                        <p className="max-w-md mx-auto mt-2">Once you hire candidates or start the submission phase, their progress will appear here.</p>
                    </div>
                ) : (
                    engagements.map((engagement) => {
                        const tasks = engagement.tasks || [];
                        const completedCount = Object.values(engagement.taskProgress || {}).filter(t => t.status === 'verified').length;
                        const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

                        return (
                            <Card key={`${engagement.jobId}-${engagement.id}`} className="overflow-hidden border-l-4 border-l-purple-600 shadow-sm hover:shadow-md transition-all">
                                <CardHeader className="bg-neutral-50/50 dark:bg-neutral-900/20 pb-4">
                                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                                        <div className="flex items-center gap-4">
                                            <Avatar className="h-12 w-12 border">
                                                <AvatarImage src={engagement.candidateImage} />
                                                <AvatarFallback>{engagement.candidateName[0]}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <CardTitle className="text-xl">{engagement.jobTitle}</CardTitle>
                                                <CardDescription className="flex items-center gap-2 mt-1">
                                                    <User className="w-3.5 h-3.5" />
                                                    <span className="font-medium text-foreground">{engagement.candidateName}</span>
                                                    <Badge variant="secondary" className="ml-2 text-xs">{engagement.status}</Badge>
                                                </CardDescription>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <span className="text-xs text-muted-foreground">Started {formatDistanceToNow(new Date(engagement.appliedAt), { addSuffix: true })}</span>
                                            <Badge variant="outline" className="bg-white dark:bg-black">ID: {engagement.id.slice(0, 8)}</Badge>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="p-6 space-y-6">
                                    {/* Progress */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="font-medium">Milestone Progress</span>
                                            <span className="text-muted-foreground">{completedCount} / {tasks.length} Verified</span>
                                        </div>
                                        <Progress value={progress} className="h-2" />
                                    </div>

                                    {/* Task List */}
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-semibold flex items-center gap-2 text-primary">
                                            <CheckCircle2 className="w-4 h-4" /> Verify Milestones
                                        </h4>
                                        <div className="grid gap-3">
                                            {tasks.map((task, idx) => {
                                                const taskState = engagement.taskProgress[idx]?.status; // 'submitted', 'verified'
                                                const isSubmitted = taskState === 'submitted';
                                                const isVerified = taskState === 'verified';

                                                return (
                                                    <div key={idx} className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${isSubmitted ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/10 dark:border-yellow-800' : 'bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800'}`}>
                                                        <div className="flex items-start gap-3">
                                                            <div className={`mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center ${isVerified ? 'bg-green-500 border-green-500 text-white' : 'border-neutral-300'}`}>
                                                                {isVerified && <CheckCircle2 className="w-3.5 h-3.5" />}
                                                            </div>
                                                            <div>
                                                                <p className={`text-sm font-medium ${isVerified ? 'line-through text-muted-foreground' : ''}`}>{task.description}</p>
                                                                <span className="text-xs text-muted-foreground">Payout: {task.payout}</span>
                                                            </div>
                                                        </div>

                                                        <div>
                                                            {isVerified ? (
                                                                <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50">Verified</Badge>
                                                            ) : isSubmitted ? (
                                                                <Dialog>
                                                                    <DialogTrigger asChild>
                                                                        <Button size="sm" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200">
                                                                            Review & Verify
                                                                        </Button>
                                                                    </DialogTrigger>
                                                                    <DialogContent>
                                                                        <DialogHeader>
                                                                            <DialogTitle>Verify Milestone Completion</DialogTitle>
                                                                            <DialogDescription>
                                                                                Please confirm that the candidate has satisfactorily completed this task. verifying this will unlock the next steps for the candidate.
                                                                            </DialogDescription>
                                                                        </DialogHeader>
                                                                        <div className="py-2 space-y-4">
                                                                            <div className="p-4 bg-muted/50 rounded-lg border">
                                                                                <p className="font-medium text-sm mb-1">Task:</p>
                                                                                <p className="text-muted-foreground">{task.description}</p>
                                                                            </div>

                                                                            {engagement.taskProgress[idx]?.submissionNote && (
                                                                                <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-900">
                                                                                    <div className="flex items-center gap-2 mb-2 text-blue-700 dark:text-blue-300">
                                                                                        <FileText className="w-4 h-4" />
                                                                                        <p className="font-semibold text-sm">Review Candidate Note</p>
                                                                                    </div>
                                                                                    <p className="text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap leading-relaxed">
                                                                                        {engagement.taskProgress[idx].submissionNote}
                                                                                    </p>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        <DialogFooter>
                                                                            <Button onClick={() => handleVerifyTask(engagement.jobId, engagement.id, idx)} className="w-full bg-green-600 hover:bg-green-700">
                                                                                <CheckCircle2 className="w-4 h-4 mr-2" /> Confirm & Verify Work
                                                                            </Button>
                                                                        </DialogFooter>
                                                                    </DialogContent>
                                                                </Dialog>
                                                            ) : (
                                                                <span className="text-xs text-muted-foreground italic">Not started</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Final Submission Info */}
                                    {engagement.status === 'Work Submitted' && (
                                        <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300">
                                                    <FileText className="w-5 h-5" />
                                                    <span className="font-semibold">Final Project Submitted</span>
                                                </div>
                                                <Button size="sm" variant="outline" onClick={() => window.location.href = `/dashboard/recruiter/applications?job=${engagement.jobId}`}>
                                                    View Submission
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                </CardContent>
                            </Card>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default ActiveWork;