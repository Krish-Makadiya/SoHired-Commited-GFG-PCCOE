import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/ui/card";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Calendar, Clock, DollarSign, CheckCircle2, XCircle, Loader2 } from "lucide-react";

const MyProposals = () => {
    // Dummy data for proposals
    const proposals = [
        {
            id: 1,
            projectTitle: "E-commerce Landing Page Redesign",
            company: "TechFlow Inc.",
            sentDate: "2024-03-20",
            status: "Shortlisted",
            bidAmount: "$800",
            duration: "2 Weeks"
        },
        {
            id: 2,
            projectTitle: "Mobile App for Food Delivery",
            company: "QuickEats",
            sentDate: "2024-03-18",
            status: "Pending",
            bidAmount: "$1500",
            duration: "1 Month"
        },
        {
            id: 3,
            projectTitle: "Corporate Brand Identity",
            company: "Nexus Corp",
            sentDate: "2024-03-10",
            status: "Rejected",
            bidAmount: "$500",
            duration: "1 Week"
        }
    ];

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Shortlisted': return <Badge className="bg-emerald-500 hover:bg-emerald-600">Shortlisted</Badge>;
            case 'Pending': return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Under Review</Badge>;
            case 'Rejected': return <Badge variant="destructive">Not Selected</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="p-6 md:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">My Proposals</h1>
                <p className="text-muted-foreground">Track the status of your submitted project proposals.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {proposals.map((proposal) => (
                    <Card key={proposal.id} className="flex flex-col">
                        <CardHeader>
                            <div className="flex justify-between items-start mb-2">
                                {getStatusBadge(proposal.status)}
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> {proposal.sentDate}
                                </span>
                            </div>
                            <CardTitle className="line-clamp-1">{proposal.projectTitle}</CardTitle>
                            <CardDescription>{proposal.company}</CardDescription>
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
                        {proposal.status === 'Shortlisted' && (
                            <CardFooter className="pt-0">
                                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">View Next Steps</Button>
                            </CardFooter>
                        )}
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default MyProposals;
