import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { useUser } from "@clerk/clerk-react"
import axios from "axios"
import { Save } from "lucide-react"
import { useEffect, useState } from "react"

const JobPreferences = () => {
    const { user } = useUser()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        role: [],
        experienceLevel: "",
        jobType: "",
        workMode: "",
        location: "",
        salary: "",
        skills: "" // Keeping as string for comma-separated input or we could handle array
    })

    // Fetch existing data
    useEffect(() => {
        const fetchUserData = async () => {
            if (user?.id) {
                try {
                    const response = await axios.get(`${import.meta.env.VITE_SERVER_API}/api/user/user-profile/${user.id}`)
                    if (response.data) {
                        const userData = response.data

                        // Handle skills: if array, join with commas; if string, keep as is
                        let skillsVal = ""
                        if (Array.isArray(userData.skills)) {
                            skillsVal = userData.skills.join(", ")
                        } else if (userData.skills) {
                            skillsVal = userData.skills
                        }

                        setFormData({
                            role: Array.isArray(userData.role) ? userData.role : (userData.role ? [userData.role] : []),
                            experienceLevel: userData.experienceLevel || "",
                            jobType: userData.jobType || "",
                            workMode: userData.workMode || "",
                            location: userData.locationPreference || "", // specific field name for preference
                            salary: userData.salaryExpectation || "",
                            skills: skillsVal
                        })
                    }
                } catch (error) {
                    if (error.response && error.response.status === 404) {
                        console.log("No existing profile found.")
                    } else {
                        console.error("Error fetching user preferences:", error)
                    }
                }
            }
        }
        fetchUserData()
    }, [user])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleValueChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            // Convert skills string back to array if needed, or keep as string. 
            // Onboarding uses array. Let's try to keep it consistent if meaningful.
            const skillsArray = formData.skills.split(",").map(s => s.trim()).filter(Boolean)

            const payload = {
                clerkId: user?.id,
                role: formData.role,
                experienceLevel: formData.experienceLevel,
                jobType: formData.jobType,
                workMode: formData.workMode,
                locationPreference: formData.location,
                salaryExpectation: formData.salary,
                skills: skillsArray // Save as array to match onboarding structure
            }

            const response = await axios.post(`${import.meta.env.VITE_SERVER_API}/api/user/user-profile`, payload)
            console.log("Preferences Saved Successfully:", response.data)
        } catch (error) {
            console.error("Error saving preferences:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full max-w-5xl mx-auto p-6 space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Job Preferences</h1>
                    <p className="text-muted-foreground mt-2">
                        Customize your job feed and let recruiters know what you're looking for.
                    </p>
                </div>
                <Button type="submit" form="job-preferences-form" className="gap-2" disabled={isLoading}>
                    <Save className="h-4 w-4" />
                    {isLoading ? "Saving..." : "Save Preferences"}
                </Button>
            </div>

            <form id="job-preferences-form" onSubmit={handleSubmit} className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Role & Experience</CardTitle>
                        <CardDescription>
                            Define your professional level and the roles you are targeting.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <FieldGroup>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Field>
                                    <FieldLabel htmlFor="role">Desired Role</FieldLabel>

                                    <Select
                                        value={formData.role}
                                        onChange={(val) => handleValueChange("role", val)}
                                        options={[
                                            "Frontend Developer",
                                            "Backend Developer",
                                            "Fullstack Developer",
                                            "Mobile Developer",
                                            "DevOps Engineer",
                                            "UI/UX Designer",
                                            "Data Scientist",
                                            "Product Manager",
                                            "Software Engineer",
                                            "Machine Learning Engineer",
                                            "Cybersecurity Analyst",
                                            "Data Engineer",
                                            "SRE",
                                            "Cloud Architect",
                                            "AI Engineer",
                                            "System Administrator",
                                            "Network Engineer",
                                            "QA Engineer"
                                        ]}
                                        multiple={true}
                                        placeholder={formData.role.length > 0 ? "Add more roles..." : "Select Desired Role(s)"}
                                    />
                                    {formData.role.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {formData.role.map((r) => (
                                                <span key={r} className="inline-flex items-center px-2 py-1 rounded-md text-sm font-medium bg-primary/10 text-primary">
                                                    {r}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleValueChange("role", formData.role.filter(item => item !== r))}
                                                        className="ml-1 text-primary/60 hover:text-primary focus:outline-none"
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="experienceLevel">Experience Level</FieldLabel>
                                    <Select
                                        value={formData.experienceLevel}
                                        onChange={(val) => handleValueChange("experienceLevel", val)}
                                        options={["Internship", "Entry Level", "Junior (1-3 yrs)", "Mid Level (3-5 yrs)", "Senior (5+ yrs)", "Lead / Manager"]}
                                        placeholder="Select Level"
                                    />
                                </Field>
                            </div>
                        </FieldGroup>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Work Preferences</CardTitle>
                        <CardDescription>
                            Where and how do you want to work?
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <FieldGroup>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <Field>
                                    <FieldLabel htmlFor="jobType">Job Type</FieldLabel>
                                    <Select
                                        value={formData.jobType}
                                        onChange={(val) => handleValueChange("jobType", val)}
                                        options={["Full-time", "Part-time", "Contract", "Freelance", "Internship"]}
                                        placeholder="Select Type"
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="workMode">Work Mode</FieldLabel>
                                    <Select
                                        value={formData.workMode}
                                        onChange={(val) => handleValueChange("workMode", val)}
                                        options={["Remote", "On-site", "Hybrid"]}
                                        placeholder="Select Mode"
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="salary">Expected Salary (Annual)</FieldLabel>
                                    <Input
                                        id="salary"
                                        name="salary"
                                        value={formData.salary}
                                        onChange={handleChange}
                                        placeholder="Ex: $80,000 - $120,000"
                                    />
                                </Field>
                                <Field className="md:col-span-3">
                                    <FieldLabel htmlFor="location">Preferred Locations</FieldLabel>
                                    <Input
                                        id="location"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="Ex: San Francisco, New York, London, Remote"
                                    />
                                </Field>
                            </div>
                        </FieldGroup>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Skills & Expertise</CardTitle>
                        <CardDescription>
                            List the key skills that make you a great candidate.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="skills">Skills (comma separated)</FieldLabel>
                                <Input
                                    id="skills"
                                    name="skills"
                                    value={formData.skills}
                                    onChange={handleChange}
                                    placeholder="Ex: React, Node.js, Python, AWS, Figma"
                                />
                            </Field>
                        </FieldGroup>
                    </CardContent>
                </Card>
            </form>
        </div>
    )
}

export default JobPreferences