import { useUser } from "@clerk/clerk-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/ui/card";
import { Button } from "@/ui/button";
import { PlusCircle, Users, Briefcase, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RecruiterDashboard = () => {
    const { user } = useUser();
    const navigate = useNavigate();

    return (
        <div className="p-6 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Recruiter Dashboard</h1>
                    <p className="text-muted-foreground mt-1">Manage your job postings and candidates.</p>
                </div>
                <Button onClick={() => navigate("/dashboard/recruiter/post-job")} className="gap-2">
                    <PlusCircle className="w-4 h-4" />
                    Post New Job
                </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12</div>
                        <p className="text-xs text-muted-foreground">+2 from yesterday</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">48</div>
                        <p className="text-xs text-muted-foreground">+12% from last week</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Interviews Scheduled</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">3</div>
                        <p className="text-xs text-muted-foreground">For this week</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity / Jobs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Recent Job Posts</CardTitle>
                        <CardDescription>Your most recent job listings.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* Placeholder items */}
                            <div className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                <div>
                                    <p className="font-medium">Senior Frontend Engineer</p>
                                    <p className="text-sm text-muted-foreground">Full-time • Remote</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium">12 Applicants</p>
                                    <p className="text-xs text-muted-foreground">Posted 2d ago</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                <div>
                                    <p className="font-medium">Backend Developer</p>
                                    <p className="text-sm text-muted-foreground">Contract • On-site</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium">5 Applicants</p>
                                    <p className="text-xs text-muted-foreground">Posted 5d ago</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Recent Applications</CardTitle>
                        <CardDescription>Latest candidates who applied.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* Placeholder items */}
                            <div className="flex items-center gap-4">
                                <div className="h-9 w-9 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                                    <span className="text-xs font-bold">JD</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">John Doe</p>
                                    <p className="text-xs text-muted-foreground">Applied for Senior Frontend Engineer</p>
                                </div>
                                <Button size="sm" variant="ghost">View</Button>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="h-9 w-9 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                                    <span className="text-xs font-bold">AS</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">Alice Smith</p>
                                    <p className="text-xs text-muted-foreground">Applied for Backend Developer</p>
                                </div>
                                <Button size="sm" variant="ghost">View</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default RecruiterDashboard;
