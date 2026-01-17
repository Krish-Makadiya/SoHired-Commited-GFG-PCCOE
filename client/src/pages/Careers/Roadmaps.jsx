import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/ui/card";

const Roadmaps = () => {
    return (
        <div className="p-6 md:p-8 space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Career Roadmaps</h1>
            <p className="text-muted-foreground">Detailed guides to help you navigate your career path.</p>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {["Frontend Developer", "Backend Developer", "DevOps Engineer"].map((role) => (
                    <Card key={role} className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardHeader>
                            <CardTitle>{role}</CardTitle>
                            <CardDescription>Step-by-step guide to becoming a {role}.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm text-muted-foreground">Beginner • 6 Months</div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Roadmaps;
