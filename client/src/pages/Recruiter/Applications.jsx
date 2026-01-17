import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Select } from "@/ui/select";
import { Search, Filter, MoreHorizontal, Mail, Calendar } from "lucide-react";
import { Input } from "@/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/ui/dropdown-menu";

const Applications = () => {
    const candidates = [
        { id: 1, name: "Alice Johnson", role: "Senior Frontend Engineer", date: "2d ago", status: "Review", score: 92, avatar: "/avatars/01.png" },
        { id: 2, name: "Bob Smith", role: "Backend Developer", date: "3d ago", status: "New", score: 85, avatar: "/avatars/02.png" },
        { id: 3, name: "Charlie Davis", role: "Senior Frontend Engineer", date: "5d ago", status: "Rejected", score: 45, avatar: "/avatars/03.png" },
        { id: 4, name: "Diana Evans", role: "Product Designer", date: "1w ago", status: "Interview", score: 88, avatar: "/avatars/04.png" },
        { id: 5, name: "Ethan Hunt", role: "Backend Developer", date: "1w ago", status: "Review", score: 78, avatar: "/avatars/05.png" },
    ];

    const [statusFilter, setStatusFilter] = useState("All");

    const filteredCandidates = statusFilter === "All"
        ? candidates
        : candidates.filter(c => c.status === statusFilter);

    return (
        <div className="p-6 md:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
                    <p className="text-muted-foreground">Manage and track candidate applications.</p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search candidates..."
                        className="pl-8"
                    />
                </div>
                <div className="flex gap-2">
                    <Select
                        options={["All", "New", "Review", "Interview", "Rejected", "Hired"]}
                        value={[statusFilter]}
                        onChange={(val) => setStatusFilter(val[0])} // Assuming single select returns array
                        placeholder="Filter Status"
                        className="w-[180px]"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {filteredCandidates.map((candidate) => (
                    <Card key={candidate.id} className="transition-all hover:shadow-md">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row items-center gap-4">
                                <Avatar className="h-16 w-16">
                                    <AvatarImage src={candidate.avatar} alt={candidate.name} />
                                    <AvatarFallback>{candidate.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>

                                <div className="flex-1 text-center md:text-left space-y-1">
                                    <h3 className="text-lg font-semibold">{candidate.name}</h3>
                                    <p className="text-sm text-neutral-500 dark:text-neutral-400">Applied for <span className="font-medium text-foreground">{candidate.role}</span> • {candidate.date}</p>
                                    <div className="flex items-center justify-center md:justify-start gap-2 pt-1">
                                        <Badge variant={candidate.score > 80 ? "default" : "secondary"}>
                                            Match: {candidate.score}%
                                        </Badge>
                                        <Badge variant="outline" className={
                                            candidate.status === 'New' ? 'text-blue-500 border-blue-200' :
                                                candidate.status === 'Rejected' ? 'text-red-500 border-red-200' :
                                                    candidate.status === 'Interview' ? 'text-purple-500 border-purple-200' :
                                                        'text-orange-500 border-orange-200'
                                        }>{candidate.status}</Badge>
                                    </div>
                                </div>

                                <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0">
                                    <Button variant="outline" size="sm" className="flex-1 md:flex-none gap-2">
                                        <Mail className="h-4 w-4" /> Message
                                    </Button>
                                    <Button variant="outline" size="sm" className="flex-1 md:flex-none gap-2">
                                        <Calendar className="h-4 w-4" /> Schedule
                                    </Button>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>View Profile</DropdownMenuItem>
                                            <DropdownMenuItem>Move to Interview</DropdownMenuItem>
                                            <DropdownMenuItem className="text-red-600">Reject Application</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Applications;
