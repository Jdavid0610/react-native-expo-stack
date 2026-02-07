import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').min(2, 'Name is too short'),
  bio: z.string().max(160, 'Bio must be 160 characters or less').optional(),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
