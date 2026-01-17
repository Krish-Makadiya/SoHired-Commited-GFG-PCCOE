import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Label } from "@/ui/label";
import { Input } from "@/ui/input";
import { Textarea } from "@/ui/textarea";

const MyProfile = () => {
    const { user } = useUser();
    const role = user?.unsafeMetadata?.role || "Candidate";

    return (
        <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
                <p className="text-muted-foreground">Manage your public profile information.</p>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={user?.imageUrl} />
                            <AvatarFallback>User</AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle>{user?.fullName}</CardTitle>
                            <CardDescription>{user?.primaryEmailAddress?.emailAddress}</CardDescription>
                            <Badge className="mt-2 capitalize" variant="outline">{role}</Badge>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Full Name</Label>
                            <Input defaultValue={user?.fullName} disabled />
                        </div>
                        <div className="space-y-2">
                            <Label>Title / Role</Label>
                            <Input placeholder="e.g. Senior Product Designer" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Bio</Label>
                        <Textarea placeholder="Tell us about yourself..." className="min-h-[100px]" />
                    </div>

                    <div className="space-y-2">
                        <Label>Skills</Label>
                        <Input placeholder="e.g. React, Node.js, Figma" />
                    </div>

                    <div className="space-y-2">
                        <Label>Portfolio URL</Label>
                        <Input placeholder="https://..." />
                    </div>

                    <div className="flex justify-end">
                        <Button>Save Changes</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default MyProfile;
