import React, { useState, useEffect } from 'react';
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Textarea } from "@/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/ui/card";
import { Select } from "@/ui/select";
import { useNavigate, useLocation } from "react-router-dom";
import { Calendar } from "@/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Loader2, DollarSign, Clock, Code2, FileText, UploadCloud, Trash2, Plus, Layers, ChevronDown, ChevronRight, Sparkles } from "lucide-react";
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';
import { Checkbox } from "@/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/ui/accordion";

const PostJob = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useUser();
    const [date, setDate] = useState();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [jobId, setJobId] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        timeline: "",
        type: "",
        techStack: "",
        description: "",
        budget: "",
        deliverables: "",
        blindHiring: false
    });

    // New Modular Structure
    // Module: { id, title: "", description: "", deadline: null, tasks: [] }
    const [modules, setModules] = useState([{ 
        id: Date.now(), 
        title: "Module 1: Foundation", 
        description: "", 
        deadline: null, 
        tasks: [{ description: "", payout: "" }] 
    }]);

    useEffect(() => {
        // Check if we are in Edit Mode
        if (location.state && location.state.job) {
            const { job } = location.state;
            setIsEditMode(true);
            setJobId(job.id || job.jobId);
            setFormData({
                title: job.title || "",
                timeline: job.timeline || "",
                type: job.type || "",
                techStack: job.techStack || "",
                description: job.description || "",
                budget: job.budget || "",
                deliverables: job.deliverables || "",
                blindHiring: job.blindHiring || false
            });
            if (job.deadline) {
                setDate(new Date(job.deadline));
            }
            // Backward compatibility or load modules
            if (job.modules && Array.isArray(job.modules)) {
                setModules(job.modules.map(m => ({
                    ...m,
                    deadline: m.deadline ? new Date(m.deadline) : null
                })));
            } else if (job.tasks) {
                // Convert old flat tasks to one module
                setModules([{
                    id: Date.now(),
                    title: "General Tasks",
                    description: "Imported tasks",
                    deadline: job.deadline ? new Date(job.deadline) : null,
                    tasks: job.tasks
                }]);
            }
        }
    }, [location.state]);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSelectChange = (value, id) => {
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    // --- Module & Task Management ---

    const addModule = () => {
        setModules([...modules, {
            id: Date.now(),
            title: `Module ${modules.length + 1}`,
            description: "",
            deadline: null,
            tasks: [{ description: "", payout: "" }]
        }]);
    };

    const removeModule = (index) => {
        const newModules = [...modules];
        newModules.splice(index, 1);
        setModules(newModules);
    };

    const updateModule = (index, field, value) => {
        const newModules = [...modules];
        newModules[index][field] = value;
        setModules(newModules);
    };

    const addTaskToModule = (moduleIndex) => {
        const newModules = [...modules];
        newModules[moduleIndex].tasks.push({ description: "", payout: "" });
        setModules(newModules);
    };

    const removeTaskFromModule = (moduleIndex, taskIndex) => {
        const newModules = [...modules];
        newModules[moduleIndex].tasks.splice(taskIndex, 1);
        setModules(newModules);
    };

    const updateTaskInModule = (moduleIndex, taskIndex, field, value) => {
        const newModules = [...modules];
        newModules[moduleIndex].tasks[taskIndex][field] = value;
        setModules(newModules);
    };

    // --- AI Integration ---
    const [showAIModal, setShowAIModal] = useState(false);
    const [aiIdea, setAiIdea] = useState("");
    const [aiLoading, setAiLoading] = useState(false);
    const [aiOptions, setAiOptions] = useState(null);

    const handleAIGenerate = async () => {
        if (!aiIdea.trim()) return;
        setAiLoading(true);
        try {
            const res = await axios.post(`${import.meta.env.VITE_SERVER_API}/api/gemini/job-details`, {
                projectIdea: aiIdea
            });
            if (res.data && res.data.options) {
                setAiOptions(res.data.options);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setAiLoading(false);
        }
    };

    const applyAIOption = (option) => {
        setFormData(prev => ({
            ...prev,
            title: option.title,
            description: option.description,
            techStack: option.techStack,
            timeline: option.timeline,
            type: option.type || "Contract",
            budget: option.budget,
            deliverables: "Complete source code, Deployment instructions, Documentation"
        }));
        
        // Map AI modules to state
        if (option.modules) {
            setModules(option.modules.map((m, i) => ({
                id: Date.now() + i,
                title: m.title,
                description: m.description,
                deadline: null, // User needs to set this
                tasks: m.tasks.map(t => ({ description: t.description, payout: t.payout }))
            })));
        }
        setShowAIModal(false);
    };


    const handleSubmit = async (status = "Active") => {
        if (!formData.title || !formData.description || !formData.timeline || !formData.techStack) {
            alert("Please fill in all required fields.");
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                recruiterId: user?.id,
                ...formData,
                modules: modules.map(m => ({
                    ...m,
                    deadline: m.deadline ? m.deadline.toISOString() : null
                })),
                // Allow backward compat searching if needed
                deadline: date ? date.toISOString() : null, 
                status: status,
                postedAt: isEditMode ? undefined : new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            if (isEditMode && jobId) {
                await axios.post(`${import.meta.env.VITE_SERVER_API}/api/jobs/update`, {
                    jobId: jobId,
                    ...payload
                });
            } else {
                await axios.post(`${import.meta.env.VITE_SERVER_API}/api/jobs/post`, payload);
            }

            navigate("/dashboard/recruiter/manage-jobs");
        } catch (error) {
            console.error("Error posting/updating job:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Calculate total layout budget from modules
    const calculatedTotalBudget = modules.reduce((acc, mod) => {
        return acc + mod.tasks.reduce((tAcc, task) => tAcc + (parseFloat(task.payout) || 0), 0);
    }, 0);

    return (
        <div className="p-6 md:p-8 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
             {/* AI Modal */}
             {showAIModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto border border-neutral-200 dark:border-neutral-800 flex flex-col">
                        <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center sticky top-0 bg-white dark:bg-neutral-900 z-10">
                            <h2 className="text-2xl font-bold flex items-center gap-2"><Sparkles className="w-5 h-5 text-indigo-500"/> AI Project Assistant</h2>
                            <Button variant="ghost" onClick={() => setShowAIModal(false)}>Close</Button>
                        </div>
                        
                        <div className="p-6 space-y-6">
                            {!aiOptions ? (
                                <div className="space-y-4">
                                    <Label>Describe your project idea roughly:</Label>
                                    <Textarea 
                                        placeholder="e.g. I want to build a marketplace for used books..."
                                        className="min-h-[150px] text-lg"
                                        value={aiIdea}
                                        onChange={e => setAiIdea(e.target.value)}
                                    />
                                    <Button 
                                        className="w-full bg-linear-to-r from-indigo-600 to-purple-600" 
                                        size="lg" 
                                        onClick={handleAIGenerate} 
                                        disabled={aiLoading}
                                    >
                                        {aiLoading ? <Loader2 className="animate-spin mr-2" /> : "Generate Project Plan"}
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <p className="text-muted-foreground">Select a project plan:</p>
                                        <Button variant="outline" onClick={() => setAiOptions(null)}>Back to Input</Button>
                                    </div>
                                    <div className="grid md:grid-cols-3 gap-4">
                                        {aiOptions.map((opt, idx) => (
                                            <div key={idx} className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 hover:border-indigo-500 cursor-pointer transition-all hover:shadow-lg flex flex-col h-full bg-neutral-50/50 dark:bg-neutral-900/50" onClick={() => applyAIOption(opt)}>
                                                <div className="mb-4">
                                                    <h3 className="font-bold text-lg mb-1">{opt.title}</h3>
                                                    <div className="flex items-center gap-4 text-sm font-medium mt-2">
                                                        <span className="text-green-600 flex items-center gap-1"><DollarSign className="w-3 h-3"/> {opt.budget}</span>
                                                        <span className="text-blue-600 flex items-center gap-1"><Clock className="w-3 h-3"/> {opt.timeline}</span>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{opt.description}</p>
                                                
                                                <div className="mt-auto space-y-2">
                                                    <p className="text-xs font-semibold uppercase text-neutral-500">Modules:</p>
                                                    {opt.modules?.map((m, i) => (
                                                        <div key={i} className="text-xs bg-white dark:bg-neutral-950 p-2 rounded border border-neutral-200 dark:border-neutral-800">
                                                            <span className="font-semibold block text-indigo-600">{m.title}</span>
                                                            <span className="text-neutral-500">{m.tasks.length} tasks</span>
                                                        </div>
                                                    ))}
                                                    <Button className="w-full mt-4" variant="secondary">Select This Plan</Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <Button variant="ghost" className="mb-6 pl-0 hover:bg-transparent text-muted-foreground transition-colors hover:text-foreground" onClick={() => navigate(-1)}>← Back to Dashboard</Button>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-neutral-900 to-neutral-600 dark:from-white dark:to-neutral-400">
                        {isEditMode ? "Edit Project" : "Post a Project"}
                    </h1>
                    <p className="text-muted-foreground mt-2 text-lg">
                        Define your requirements, modules, and milestones.
                    </p>
                </div>
                {!isEditMode && (
                     <Button onClick={() => setShowAIModal(true)} className="bg-linear-to-r from-indigo-600 to-purple-600 text-white border-0 shadow-lg hover:shadow-indigo-500/20 transition-all hover:scale-105">
                     ✨ AI Assistant
                 </Button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Form */}
                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Project Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Project Title <span className="text-red-500">*</span></Label>
                                <Input id="title" placeholder="e.g. Build E-commerce Platform" value={formData.title} onChange={handleInputChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
                                <Textarea id="description" className="min-h-[150px]" placeholder="Detailed scope..." value={formData.description} onChange={handleInputChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="techStack">Tech Stack <span className="text-red-500">*</span></Label>
                                <Input id="techStack" placeholder="React, Node, etc." value={formData.techStack} onChange={handleInputChange} />
                            </div>
                            
                            <div className="flex items-start space-x-3 p-4 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-lg">
                                <Checkbox id="blindHiring" checked={formData.blindHiring} onCheckedChange={(c) => setFormData(p => ({...p, blindHiring: c}))} />
                                <div>
                                    <Label htmlFor="blindHiring" className="font-semibold">Blind Hiring Mode</Label>
                                    <p className="text-sm text-neutral-600">Mask candidate PII to reduce bias.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Modules Section */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold flex items-center gap-2"><Layers className="w-5 h-5"/> Project Modules</h2>
                            <Button onClick={addModule} variant="outline" size="sm" className="gap-2"><Plus className="w-4 h-4"/> Add Module</Button>
                        </div>
                        <p className="text-sm text-muted-foreground">Break down the project into completed modules. Payment is released per module completion.</p>

                        <Accordion type="multiple" defaultValue={modules.map((_, i) => `item-${i}`)} className="space-y-4">
                            {modules.map((module, mIndex) => (
                                <AccordionItem key={module.id} value={`item-${mIndex}`} className="border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50/50 dark:bg-neutral-900/50 px-4">
                                    <AccordionTrigger className="hover:no-underline">
                                        <div className="flex items-center gap-3 text-left w-full">
                                            <div className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold">
                                                {mIndex + 1}
                                            </div>
                                            <div className="flex-1">
                                                <span className="font-semibold text-lg">{module.title || "Untitled Module"}</span>
                                                <div className="text-xs text-muted-foreground flex gap-3 mt-1 font-normal">
                                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> Deadline: {module.deadline ? format(module.deadline, 'PP') : "Not Set"}</span>
                                                    <span className="flex items-center gap-1"><DollarSign className="w-3 h-3"/> Total: ${module.tasks.reduce((sum, t) => sum + (parseFloat(t.payout)||0), 0)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pt-4 space-y-4 border-t border-neutral-200 dark:border-neutral-800 mt-2">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Module Title</Label>
                                                <Input value={module.title} onChange={(e) => updateModule(mIndex, "title", e.target.value)} placeholder="e.g. Frontend Implementation" />
                                            </div>
                                            <div className="space-y-2 flex flex-col">
                                                <Label className="mb-2">Deadline</Label>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button variant={"outline"} className={`w-full justify-start text-left font-normal ${!module.deadline && "text-muted-foreground"}`}>
                                                            {module.deadline ? format(module.deadline, "PPP") : <span>Pick a deadline</span>}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar mode="single" selected={module.deadline} onSelect={(d) => updateModule(mIndex, "deadline", d)} initialFocus />
                                                    </PopoverContent>
                                                </Popover>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Description</Label>
                                            <Input value={module.description} onChange={(e) => updateModule(mIndex, "description", e.target.value)} placeholder="Module specific details..." />
                                        </div>

                                        <div className="space-y-3 pl-4 border-l-2 border-indigo-100 dark:border-indigo-900 mt-4">
                                            <Label className="text-xs uppercase tracking-wide text-muted-foreground">Tasks</Label>
                                            {module.tasks.map((task, tIndex) => (
                                                <div key={tIndex} className="flex gap-3 items-start">
                                                    <Input className="flex-1" placeholder="Task description" value={task.description} onChange={(e) => updateTaskInModule(mIndex, tIndex, "description", e.target.value)} />
                                                    <Input className="w-24" placeholder="$" value={task.payout} onChange={(e) => updateTaskInModule(mIndex, tIndex, "payout", e.target.value)} />
                                                    <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-500" onClick={() => removeTaskFromModule(mIndex, tIndex)}><Trash2 className="w-4 h-4"/></Button>
                                                </div>
                                            ))}
                                            <Button variant="outline" size="sm" onClick={() => addTaskToModule(mIndex)} className="w-full border-dashed"><Plus className="w-3 h-3 mr-2"/> Add Task</Button>
                                        </div>
                                        
                                        <div className="flex justify-end pt-2">
                                            <Button variant="ghost" className="text-red-500 hover:bg-red-50 hover:text-red-600" onClick={() => removeModule(mIndex)}>Remove Module</Button>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>

                {/* Right Column: Summary */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="sticky top-6">
                        <CardHeader>
                            <CardTitle>{isEditMode ? "Update" : "Publish"}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Overall Timeline</Label>

                                {/* Quick Fix for Select component usage if it wraps Radix UI */}
                                <Select options={["1-2 Weeks", "1 Month", "2-3 Months", "3+ Months"]} placeholder="Select Duration" value={formData.timeline} onChange={(v) => handleSelectChange(v, "timeline")} />
                            </div>

                            <div className="space-y-2">
                                <Label>Employment Type</Label>
                                <Select options={["Contract", "Freelance", "Full-time"]} placeholder="Select Type" value={formData.type} onChange={(v) => handleSelectChange(v, "type")} />
                            </div>

                            <div className="pt-4 border-t">
                                <div className="flex justify-between font-bold text-lg mb-4">
                                    <span>Total Budget:</span>
                                    <span>${calculatedTotalBudget}</span>
                                </div>
                                <Button size="lg" className="w-full" onClick={() => handleSubmit("Active")} disabled={isSubmitting}>
                                    {isSubmitting ? <Loader2 className="animate-spin mr-2"/> : (isEditMode ? "Save Changes" : "Post Job")}
                                </Button>
                                <p className="text-xs text-muted-foreground text-center mt-2">Funds released per module completion.</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default PostJob;
