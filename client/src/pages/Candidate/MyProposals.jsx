import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/ui/card";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Calendar, Clock, DollarSign, Loader2, Building2, UploadCloud, Lock } from "lucide-react";
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/ui/dialog";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Textarea } from "@/ui/textarea";

const MyProposals = () => {
    const { user } = useUser();
    const [proposals, setProposals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitOpen, setSubmitOpen] = useState(false);
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [submissionLink, setSubmissionLink] = useState("");
    const [submissionDesc, setSubmissionDesc] = useState("");

    useEffect(() => {
        const fetchProposals = async () => {
            if (!user) return;
            try {
                const response = await axios.get(`${import.meta.env.VITE_SERVER_API}/api/jobs/applications/${user.id}`);
                setProposals(response.data.applications);
            } catch (error) {
                console.error("Error fetching proposals:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProposals();
    }, [user]);

    const handleOpenSubmit = (jobId) => {
        setSelectedJobId(jobId);
        setSubmitOpen(true);
    };

    const handleSubmitWork = async () => {
        if (!selectedJobId || !submissionLink) return;
        try {
            await axios.post(`${import.meta.env.VITE_SERVER_API}/api/jobs/submit-work`, {
                jobId: selectedJobId,
                userId: user.id,
                submissionLink,
                description: submissionDesc
            });

            // Update local state
            setProposals(prev => prev.map(p =>
                p.jobId === selectedJobId ? { ...p, status: "Work Submitted" } : p
            ));

            setSubmitOpen(false);
            setSubmissionLink("");
            setSubmissionDesc("");
        } catch (error) {
            console.error("Error submitting work:", error);
            // Optionally add toast error here
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Shortlisted': return <Badge className="bg-emerald-500 hover:bg-emerald-600">Shortlisted</Badge>;
            case 'Work Submitted': return <Badge className="bg-blue-500 hover:bg-blue-600">Work Submitted</Badge>;
            case 'Interview': return <Badge className="bg-purple-500 hover:bg-purple-600">Interview</Badge>;
            case 'Applied': return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Pending Review</Badge>;
            case 'Rejected': return <Badge variant="destructive">Not Selected</Badge>;
            case 'Hired': return <Badge className="bg-green-600 hover:bg-green-700">Hired 🎉</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
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
        <div className="p-6 md:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">My Proposals</h1>
                <p className="text-muted-foreground">Track the status of your submitted project proposals.</p>
            </div>

            {proposals.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                    <p>You haven't applied to any projects yet.</p>
                    <Button variant="link" asChild className="mt-2">
                        <a href="/dashboard">Find Projects</a>
                    </Button>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {proposals.map((proposal) => {
                        // Check if submission is allowed: User is shortlisted AND Job is in Submission Status
                        const isSubmissionAllowed = proposal.status === 'Shortlisted' && (proposal.jobStatus === 'SubmissionOpen' || proposal.jobStatus === 'Closed');

                        return (
                            <Card key={proposal.jobId} className="flex flex-col hover:shadow-md transition-shadow">
                                <CardHeader>
                                    <div className="flex justify-between items-start mb-2">
                                        {getStatusBadge(proposal.status)}
                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> {proposal.sentDate ? formatDistanceToNow(new Date(proposal.sentDate), { addSuffix: true }) : 'Recently'}
                                        </span>
                                    </div>
                                    <CardTitle className="line-clamp-1 text-lg">{proposal.projectTitle}</CardTitle>
                                    <CardDescription className="flex items-center gap-1">
                                        <Building2 className="w-3 h-3" /> {proposal.company}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1 space-y-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="flex items-center gap-2 text-muted-foreground"><DollarSign className="w-4 h-4" /> Bid Amount:</span>
                                        <span className="font-medium">{proposal.bidAmount}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="flex items-center gap-2 text-muted-foreground"><Calendar className="w-4 h-4" /> Duration:</span>
                                        <span className="font-medium">{proposal.duration}</span>
                                    </div>
                                </CardContent>

                                <CardFooter className="pt-0 flex flex-col gap-2">
                                    {proposal.status === 'Shortlisted' && (
                                        <Button
                                            className="w-full bg-emerald-600 hover:bg-emerald-700 gap-2"
                                            onClick={() => handleOpenSubmit(proposal.jobId)}
                                            disabled={!isSubmissionAllowed}
                                            title={!isSubmissionAllowed ? "Recruiter has not started submission phase yet" : "Submit your work"}
                                        >
                                            {isSubmissionAllowed ? <UploadCloud className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                                            {isSubmissionAllowed ? "Submit Proof of Work" : "Submission Locked"}
                                        </Button>
                                    )}
                                    {proposal.status === 'Work Submitted' && (
                                        <Button variant="outline" className="w-full" disabled>
                                            Under Review
                                        </Button>
                                    )}
                                    {(proposal.status === 'Interview') && (
                                        <Button className="w-full bg-purple-600 hover:bg-purple-700">Check Email for Details</Button>
                                    )}
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>
            )}

            <Dialog open={submitOpen} onOpenChange={setSubmitOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Submit Proof of Work</DialogTitle>
                        <DialogDescription>
                            Upload your project files or provide a link to your repository/portfolio.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="link" className="text-right">
                                Project Link
                            </Label>
                            <Input
                                id="link"
                                value={submissionLink}
                                onChange={(e) => setSubmissionLink(e.target.value)}
                                placeholder="https://github.com/..."
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="desc" className="text-right">
                                Description
                            </Label>
                            <Textarea
                                id="desc"
                                value={submissionDesc}
                                onChange={(e) => setSubmissionDesc(e.target.value)}
                                placeholder="Briefly describe your approach..."
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" onClick={handleSubmitWork}>Submit for Review</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default MyProposals;
