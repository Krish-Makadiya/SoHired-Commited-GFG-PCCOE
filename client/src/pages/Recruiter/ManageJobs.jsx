import React, { useEffect, useState } from 'react';
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/ui/table";
import { MoreHorizontal, PlusCircle, Pencil, Trash2, Eye, Loader2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/ui/dropdown-menu";
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { format } from 'date-fns';

const ManageJobs = () => {
    const navigate = useNavigate();
    const { user, isLoaded } = useUser();
    const [jobs, setJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            if (!user) return;
            try {
                // Fetch using the new route: /api/jobs/posted/:recruiterId
                const response = await axios.get(`${import.meta.env.VITE_SERVER_API}/api/jobs/posted/${user.id}`);
                setJobs(response.data);
            } catch (error) {
                console.error("Error fetching jobs:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (isLoaded) {
            fetchJobs();
        }
    }, [user, isLoaded]);

    if (!isLoaded || isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Manage Jobs</h1>
                    <p className="text-muted-foreground">View and edit your posted job listings.</p>
                </div>
                <Button onClick={() => navigate("/dashboard/recruiter/post-job")} className="gap-2">
                    <PlusCircle className="w-4 h-4" />
                    Post New Job
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Jobs</CardTitle>
                    <CardDescription>A list of your recent job postings.</CardDescription>
                </CardHeader>
                <CardContent>
                    {jobs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-center">
                            <p className="text-neutral-500 mb-4">No jobs posted yet.</p>
                            <Button variant="outline" onClick={() => navigate("/dashboard/recruiter/post-job")}>
                                Post your first job
                            </Button>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Job Title</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead className="hidden md:table-cell">Posted On</TableHead>
                                    <TableHead>Applicants</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {jobs.map((job) => (
                                    <TableRow key={job.id}>
                                        <TableCell className="font-medium">{job.title}</TableCell>
                                        <TableCell>{job.type || "N/A"}</TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            {job.postedAt ? format(new Date(job.postedAt), 'yyyy-MM-dd') : 'N/A'}
                                        </TableCell>
                                        <TableCell>{job.applicantCount || 0}</TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${job.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                                job.status === 'Closed' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                                                    'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-400'
                                                }`}>
                                                {job.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    className="h-10"
                                                    onClick={() => navigate(`/dashboard/recruiter/applications?job=${job.id}`)}
                                                >
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    View Applicants
                                                </Button>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Open menu</span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => navigate("/dashboard/recruiter/post-job", { state: { job } })}>
                                                            <Pencil className="mr-2 h-4 w-4" />
                                                            Edit Job
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="text-red-600 focus:text-red-600">
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default ManageJobs;
