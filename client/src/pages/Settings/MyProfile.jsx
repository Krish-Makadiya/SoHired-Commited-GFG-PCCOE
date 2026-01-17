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
import { RadioGroup } from "@/components/ui/radio-group"
import { Select } from "@/components/ui/select"
import { useUser } from "@clerk/clerk-react"
import axios from "axios"
import { FileText, Loader2, Save } from "lucide-react"
import { useEffect, useState } from "react"

const MyProfile = () => {
    const { user } = useUser()
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        city: "",
        state: "",
        country: "",
        linkedin: "",
        github: "",
        portfolio: "",
        twitter: "",
        gender: "",
        disability: "No",
        university: "",
        degree: "",
        graduation_year: ""
    });
    const [isUploading, setIsUploading] = useState(false);



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



    useEffect(() => {
        const fetchUserData = async () => {
            const clerkId = user?.id;
            if (clerkId) {
                try {
                    // Correct Axios syntax: url, then config object
                    const response = await axios.get(`${import.meta.env.VITE_SERVER_API}/api/user/user-profile/${clerkId}`);

                    if (response.data) {
                        const userData = response.data;
                        setFormData(prev => ({
                            ...prev,
                            firstName: userData.firstName || prev.firstName,
                            lastName: userData.lastName || prev.lastName,
                            email: userData.email || prev.email,
                            phone: userData.phone || prev.phone,
                            city: userData.city || prev.city,
                            state: userData.state || prev.state,
                            country: userData.country || prev.country,
                            linkedin: userData.linkedin || prev.linkedin,
                            github: userData.github || prev.github,
                            portfolio: userData.portfolio || prev.portfolio,
                            twitter: userData.twitter || prev.twitter,
                            gender: userData.gender || prev.gender,
                            disability: userData.disability || prev.disability,
                            university: userData.university || prev.university,
                            degree: userData.degree || prev.degree,
                            graduation_year: userData.graduation_year || prev.graduation_year
                        }));
                        console.log("User data fetched and populated:", userData);
                    }
                } catch (error) {
                    if (error.response && error.response.status === 404) {
                        console.log("No existing profile found for this user (First time setup).");
                    } else {
                        console.error("Error fetching user profile:", error);
                    }
                }
            }
        };

        fetchUserData();
    }, [user]);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        const data = new FormData();
        data.append('file', file);

        try {
            const response = await axios.post('http://localhost:5678/webhook/parse-resume', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log("Resume Parsed Data:", response.data);
            setFormData(response.data);
        } catch (error) {
            console.error("Error parsing resume:", error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log("Form Data Submitted:", formData)

        try {
            const payload = {
                ...formData,
                clerkId: user?.id,
                imageUrl: user?.imageUrl
            }

            const response = await axios.post(`${import.meta.env.VITE_SERVER_API}/api/user/user-profile`, payload)
            console.log("Profile Saved Successfully:", response.data)
        } catch (error) {
            console.error("Error saving profile to backend:", error)
        }
    }

    return (
        <div className="w-full max-w-5xl mx-auto p-6 space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage your personal information and profile details.
                    </p>
                </div>
                <Button type="submit" form="profile-form" className="gap-2">
                    <Save className="h-4 w-4" />
                    Save Changes
                </Button>
            </div>

            <form id="profile-form" onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information Section */}
                <div className="flex justify-end mb-4">
                    <input
                        type="file"
                        id="resume-upload"
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileUpload}
                    />
                    <label htmlFor="resume-upload">
                        <Button
                            type="button"
                            variant="outline"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white border-0 shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 gap-2 cursor-pointer"
                            onClick={() => document.getElementById('resume-upload').click()}
                            disabled={isUploading}
                        >
                            {isUploading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <FileText className="h-4 w-4" />
                            )}
                            {isUploading ? "Parsing Resume..." : "Import from Resume"}
                        </Button>
                    </label>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>
                            Update your personal details including contact info and identity.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <FieldGroup>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Field>
                                    <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                                    <Input
                                        id="firstName"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        placeholder="Ex: Rahul"
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                                    <Input
                                        id="lastName"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        placeholder="Ex: Sharma"
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="email">Email Address</FieldLabel>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="rahul@example.com"
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+91 98765 43210"
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="city">City</FieldLabel>
                                    <Input
                                        id="city"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        placeholder="Ex: Bangalore"
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="state">State</FieldLabel>
                                    <Input
                                        id="state"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        placeholder="Ex: Karnataka"
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="country">Country</FieldLabel>
                                    <Input
                                        id="country"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        placeholder="Ex: India"
                                    />
                                </Field>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                                <Field>
                                    <FieldLabel htmlFor="gender">Gender</FieldLabel>
                                    <Select
                                        value={formData.gender}
                                        onChange={(val) => handleValueChange("gender", val)}
                                        options={["Male", "Female", "Prefer not to Say"]}
                                        placeholder="Select Gender"
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="disability" className="block">Do you have a disability?</FieldLabel>
                                    <RadioGroup
                                        value={formData.disability}
                                        onChange={(val) => handleValueChange("disability", val)}
                                        options={["Yes", "No"]}
                                    />
                                </Field>
                            </div>
                        </FieldGroup>
                    </CardContent>
                </Card>

                {/* Educational Information Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Educational Information</CardTitle>
                        <CardDescription>
                            Add your latest educational qualifications.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <FieldGroup>
                            <div className="grid grid-cols-1 gap-6">
                                <Field>
                                    <FieldLabel htmlFor="university">University / College</FieldLabel>
                                    <Input
                                        id="university"
                                        name="university"
                                        value={formData.university}
                                        onChange={handleChange}
                                        placeholder="Ex: IIT Bombay"
                                    />
                                </Field>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Field>
                                        <FieldLabel htmlFor="degree">Degree</FieldLabel>
                                        <Select
                                            value={formData.degree}
                                            onChange={(val) => handleValueChange("degree", val)}
                                            options={["B.Tech", "M.Tech", "BCA", "MCA", "B.Sc", "M.Sc", "PhD"]}
                                            placeholder="Select Degree"
                                        />
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="graduation_year">Graduation Year</FieldLabel>
                                        <Input
                                            id="graduation_year"
                                            name="graduation_year"
                                            value={formData.graduation_year}
                                            onChange={handleChange}
                                            placeholder="Ex: 2025"
                                        />
                                    </Field>
                                </div>
                            </div>
                        </FieldGroup>
                    </CardContent>
                </Card>

                {/* Social Links & Others Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Other Links and Updates</CardTitle>
                        <CardDescription>
                            Connect your social profiles to showcase your work.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <FieldGroup>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Field>
                                    <FieldLabel htmlFor="linkedin">LinkedIn Profile</FieldLabel>
                                    <Input
                                        id="linkedin"
                                        name="linkedin"
                                        value={formData.linkedin}
                                        onChange={handleChange}
                                        placeholder="https://linkedin.com/in/..."
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="github">GitHub Profile</FieldLabel>
                                    <Input
                                        id="github"
                                        name="github"
                                        value={formData.github}
                                        onChange={handleChange}
                                        placeholder="https://github.com/..."
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="portfolio">Portfolio URL</FieldLabel>
                                    <Input
                                        id="portfolio"
                                        name="portfolio"
                                        value={formData.portfolio}
                                        onChange={handleChange}
                                        placeholder="https://your-portfolio.com"
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="twitter">Twitter / X</FieldLabel>
                                    <Input
                                        id="twitter"
                                        name="twitter"
                                        value={formData.twitter}
                                        onChange={handleChange}
                                        placeholder="https://twitter.com/..."
                                    />
                                </Field>
                            </div>
                        </FieldGroup>
                    </CardContent>
                </Card>
            </form>
        </div>
    )
}

export default MyProfile