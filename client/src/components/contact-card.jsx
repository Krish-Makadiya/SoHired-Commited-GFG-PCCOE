import React from 'react';
import { cn } from '@/lib/utils';
import { Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';

export function ContactCard({
    title = 'Get in touch',
    description = 'Have a project in mind? We would love to hear from you.',
    contactInfo,
    className,
    formSectionClassName,
    children,
    ...props
}) {
    return (
        <div className={cn("relative z-10", className)} {...props}>
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                {/* Left Side: Typography & Info */}
                <div className="lg:col-span-5 flex flex-col gap-8 lg:py-0">
                    <div className="space-y-4">
                        <div className="inline-flex items-center rounded-full border border-light-primary/30 bg-light-primary/10 px-3 py-1 text-xs font-medium text-light-primary dark:border-dark-primary/30 dark:bg-dark-primary/10 dark:text-dark-primary w-fit">
                            <span className="flex h-1.5 w-1.5 rounded-full bg-light-primary dark:bg-dark-primary mr-2 animate-pulse"></span>
                            Contact Us
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold tracking-tight text-light-primary-text dark:text-dark-primary-text">
                            {title}
                        </h1>
                        <p className="text-lg text-light-secondary-text dark:text-dark-secondary-text leading-relaxed">
                            {description}
                        </p>
                    </div>

                    <div className="flex flex-col gap-3">
                        {contactInfo?.map((info, index) => (
                            <ContactInfoItem key={index} {...info} />
                        ))}
                    </div>
                </div>

                {/* Right Side: The Form Card */}
                <div className="lg:col-span-7 relative">
                    {/* Abstract background blob behind form */}
                    <div className="absolute -top-12 -right-12 w-64 h-64 bg-light-primary/20 dark:bg-dark-primary/20 rounded-full blur-3xl opacity-50 pointer-events-none" />
                    <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-light-secondary/20 dark:bg-dark-secondary/20 rounded-full blur-3xl opacity-50 pointer-events-none" />

                    <div
                        className={cn(
                            'relative bg-white/80 dark:bg-[#1a1a1a]/80 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-[0_0_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_0_60px_-15px_rgba(0,0,0,0.5)] transition-all hover:shadow-[0_0_80px_-15px_rgba(0,0,0,0.15)]',
                            formSectionClassName
                        )}>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}

function ContactInfoItem({
    icon: Icon,
    label,
    value,
    className,
    ...props
}) {
    return (
        <a
            href="#"
            className={cn('group flex items-center gap-4 p-3 -mx-3 rounded-2xl transition-all duration-300 hover:bg-light-surface dark:hover:bg-white/5', className)}
            {...props}
        >
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-light-bg dark:bg-white/5 border border-black/5 dark:border-white/10 group-hover:scale-110 group-hover:bg-light-primary group-hover:text-white dark:group-hover:bg-dark-primary dark:group-hover:text-black transition-all duration-300 shadow-sm">
                <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1">
                <p className="text-xs font-medium text-light-secondary-text dark:text-dark-secondary-text uppercase tracking-wider mb-0.5">{label}</p>
                <p className="text-base md:text-lg font-medium text-light-primary-text dark:text-dark-primary-text group-hover:translate-x-1 transition-transform">{value}</p>
            </div>
            <ArrowUpRight className="w-4 h-4 text-light-secondary-text dark:text-dark-secondary-text opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
        </a>
    );
}
