import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/ui/card";
import { Button } from "@/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar";
import { Calendar as CalendarIcon, Clock, Video, MoreVertical } from "lucide-react";

const Interviews = () => {
    const interviews = [
        { id: 1, candidate: "Diana Evans", role: "Product Designer", time: "10:00 AM", date: "Today, Oct 24", type: "Video Call" },
        { id: 2, candidate: "Ethan Hunt", role: "Backend Developer", time: "2:30 PM", date: "Today, Oct 24", type: "Video Call" },
        { id: 3, candidate: "Alice Johnson", role: "Senior Frontend Engineer", time: "11:00 AM", date: "Tomorrow, Oct 25", type: "In-Person" },
    ];

    return (
        <div className="p-6 md:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Interviews</h1>
                    <p className="text-muted-foreground">Upcoming scheduled interviews.</p>
                </div>
                <Button>Schedule Interview</Button>
            </div>

            <div className="grid gap-6">
                {interviews.map((interview) => (
                    <Card key={interview.id}>
                        <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
                            <div className="flex flex-col items-center justify-center p-4 bg-primary/5 rounded-lg min-w-[100px] text-center">
                                <span className="text-sm font-medium text-muted-foreground uppercase">{interview.date.split(',')[0]}</span>
                                <span className="text-2xl font-bold text-primary">{interview.date.split(' ')[2]}</span>
                            </div>

                            <div className="flex-1 space-y-1 text-center md:text-left">
                                <h3 className="text-lg font-semibold">{interview.candidate}</h3>
                                <p className="text-sm text-muted-foreground">Candidate for <span className="text-foreground font-medium">{interview.role}</span></p>
                                <div className="flex items-center justify-center md:justify-start gap-4 pt-2 text-sm text-neutral-500">
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="h-4 w-4" />
                                        {interview.time}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Video className="h-4 w-4" />
                                        {interview.type}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 w-full md:w-auto">
                                <Button variant="default" className="flex-1 md:flex-none">Join Meeting</Button>
                                <Button variant="outline" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {interviews.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        No upcoming interviews scheduled.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Interviews;
