import React from 'react';
import { useUser } from "@clerk/clerk-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/ui/card";
import { Button } from "@/ui/button";

const MyAccount = () => {
    // This serves as a placeholder for Account settings (Billing, Notifications, etc.)
    const { user } = useUser();

    return (
        <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
                <p className="text-muted-foreground">Manage your account preferences and security.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Security</CardTitle>
                    <CardDescription>Manage your password and authentication methods.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">Authentication is managed via Clerk.</p>
                    <Button variant="outline" onClick={() => window.location.href = "https://accounts.clerk.dev/user"}>
                        Manage Clerk Account
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>Choose what updates you want to receive.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-sm text-neutral-500">Notification settings coming soon.</div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Billing</CardTitle>
                    <CardDescription>Manage your subscription and payment methods.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-sm text-neutral-500">Billing portal coming soon.</div>
                </CardContent>
            </Card>
        </div>
    );
};

export default MyAccount;
