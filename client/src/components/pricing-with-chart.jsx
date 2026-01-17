import { Button } from '@/components/ui/button';
import { CheckCircleIcon } from 'lucide-react';
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';
import { Link } from 'react-router-dom';

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

export function PricingWithChart() {
	return (
		<div className="mx-auto max-w-6xl mt-32">
			{/* Heading */}
			<div className="mx-auto mb-10 max-w-2xl text-center">
				<h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-light-primary-text dark:text-dark-primary-text">
					Invest in Your <span className="text-light-primary dark:text-dark-primary">Future</span>
				</h1>
				<p className="text-light-secondary-text dark:text-dark-secondary-text mt-4 text-sm md:text-base">
					Stop wasting hours on manual applications. Choose the plan that gets you hired faster.
				</p>
			</div>
			{/* Pricing Grid */}
			<div className="bg-background grid rounded-xl border border-light-border dark:border-dark-border md:grid-cols-6">
				{/* Free Plan */}
				<div
					className="flex flex-col justify-between border-b p-6 md:col-span-2 md:border-r md:border-b-0">
					<div className="space-y-4">
						<div>
							<h2
								className="backdrop-blur-2 inline rounded-[2px] p-1 text-xl font-semibold text-light-primary-text dark:text-dark-primary-text">
								Job Seeker
							</h2>
							<span className="my-3 block text-3xl font-bold text-light-primary-text dark:text-dark-primary-text">
								₹0
							</span>
							<p className="text-light-secondary-text dark:text-dark-secondary-text text-sm">
								Perfect for testing the waters.
							</p>
						</div>

						<Button asChild variant="outline" className="w-full">
							<Link to="/sign-up">Get Started</Link>
						</Button>

						<div className="bg-border my-6 h-px w-full" />

						<ul className="text-light-secondary-text dark:text-dark-secondary-text space-y-3 text-sm">
							{[
								'10 Auto-Applications / month',
								'Basic Resume Scoring',
								'Job Tracker Dashboard',
							].map((item, index) => (
								<li key={index} className="flex items-center gap-2">
									<CheckCircleIcon className="h-4 w-4 text-light-secondary-text dark:text-dark-secondary-text" />
									{item}
								</li>
							))}
						</ul>
					</div>
				</div>

				{/* Pro Plan */}
				<div
					className="z-10 grid gap-8 overflow-hidden p-6 md:col-span-4 lg:grid-cols-2">
					{/* Pricing + Chart */}
					<div className="flex flex-col justify-between space-y-6">
						<div>
							<h2 className="text-xl font-semibold text-light-primary-text dark:text-dark-primary-text">Career Accelerator</h2>
							<span className="my-3 block text-3xl font-bold text-light-primary dark:text-dark-primary">
								₹299<span className="text-base font-medium text-light-secondary-text dark:text-dark-secondary-text">/mo</span>
							</span>
							<p className="text-light-secondary-text dark:text-dark-secondary-text text-sm">
								For serious candidates who want offers.
							</p>
						</div>
						<div className="bg-white/50 dark:bg-black/20 h-fit w-full rounded-lg border border-light-border dark:border-dark-border p-2">
							<InterestChart />
						</div>
					</div>
					{/* Features */}
					<div className="relative w-full flex flex-col justify-between">
						<div>

							<div className="text-sm font-medium text-light-primary-text dark:text-dark-primary-text">Everything in Job Seeker plus:</div>
							<ul className="text-light-secondary-text dark:text-dark-secondary-text mt-4 space-y-3 text-sm">
								{[
									'Unlimited Auto-Applications',
									'AI-Tailored Resumes per Job',
									'Mock Interview AI Agent',
									'Skill Gap Analysis & Roadmap',
									'Cover Letter Generation',
									'Salary Prediction Insights',
								].map((item, index) => (
									<li key={index} className="flex items-center gap-2">
										<CheckCircleIcon className="h-4 w-4 text-light-primary dark:text-dark-primary" />
										{item}
									</li>
								))}
							</ul>
						</div>

						{/* Call to Action */}
						<div className="mt-10 grid w-full grid-cols-2 gap-2.5">
							<Button
								asChild
								className="bg-light-primary dark:bg-dark-primary text-white hover:bg-light-primary-hover dark:hover:bg-dark-primary-hover">
								<Link to="/sign-up">Get Pro</Link>
							</Button>
							<Button asChild variant="outline">
								<Link to="/sign-up">Start Free Trial</Link>
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

function InterestChart() {
	const chartData = [
		{ month: 'Jan', interviews: 2 },
		{ month: 'Feb', interviews: 5 },
		{ month: 'Mar', interviews: 12 },
		{ month: 'Apr', interviews: 18 },
		{ month: 'May', interviews: 25 },
		{ month: 'Jun', interviews: 35 },
		{ month: 'Jul', interviews: 48 }, // Consistent growth
	];

	const chartConfig = {
		interviews: {
			label: 'Interviews',
			color: 'var(--color-light-primary)',
		}
	};

	return (
		<Card className="shadow-none border-0 bg-transparent">
			<CardHeader className="space-y-0 border-b-0 p-3 pb-0">
				<CardTitle className="text-lg text-light-primary-text dark:text-dark-primary-text">Interview Success Rate</CardTitle>
				<CardDescription className="text-xs text-light-secondary-text dark:text-dark-secondary-text">
					Average interviews secured by Pro users over time.
				</CardDescription>
			</CardHeader>
			<CardContent className="p-3">
				<ChartContainer config={chartConfig}>
					<LineChart data={chartData} margin={{ left: 12, right: 12 }}>
						<CartesianGrid vertical={false} strokeDasharray="3 3" strokeOpacity={0.2} />
						<XAxis
							dataKey="month"
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							tick={{ fill: 'var(--color-light-secondary-text)', fontSize: 10 }}
							tickFormatter={(value) => value} />
						<ChartTooltip cursor={false} content={<ChartTooltipContent />} />
						<Line
							dataKey="interviews"
							type="monotone"
							stroke="var(--color-light-primary)"
							strokeWidth={3}
							dot={false}
							strokeLinecap="round"
						/>
					</LineChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
