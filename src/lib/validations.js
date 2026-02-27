import { z } from 'zod';

export const cropSchema = z.object({
    name: z.string().min(2, "Crop name is required").max(50),
    variety: z.string().optional(),
    plantedAt: z.coerce.date().refine((date) => date <= new Date(), {
        message: "Planting date cannot be in the future",
    }),
    expectedHarvestDate: z.coerce.date().optional(),
});

export const farmSchema = z.object({
    name: z.string().min(3, "Farm name must be at least 3 characters").max(100),
    location: z.object({
        lat: z.number().min(-90).max(90),
        lng: z.number().min(-180).max(180),
        address: z.string().optional(),
    }).optional(),
    sizeHectares: z.number().min(0.1, "Farm size must be at least 0.1 hectares"),
});

export const diseaseScanResultSchema = z.object({
    disease: z.string(),
    confidence: z.number().min(0).max(100),
    severity: z.enum(['Low', 'Moderate', 'High', 'Critical']),
    treatment: z.array(z.string()).min(1),
});

export const jobSchema = z.object({
    title: z.string().min(3, "Job title is required").max(100),
    employer_name: z.string().min(2, "Employer name is required"),
    location: z.string().min(2, "Location is required"),
    salary_per_day: z.number().positive("Salary must be positive"),
    job_type: z.enum(['daily', 'monthly']).default('daily'),
    category: z.string().min(2).default('labor'),
    phone: z.string().regex(/^\+?[0-9]{10,14}$/, "Valid phone number is required"),
    description: z.string().optional(),
});
