'use client';

import { platforms as basePlatforms } from './mockData';
import { mockPagesAndGroups } from './mockPagesAndGroups';

// Add a default "Personal Profile" to each platform that has pages/groups
const platformsWithProfiles = basePlatforms.map(p => {
    const hasPagesOrGroups = mockPagesAndGroups.some(pg => pg.platform.toLowerCase() === p.name.toLowerCase());
    if (hasPagesOrGroups) {
        return {
            ...p,
            // Add a default profile entry
            pagesAndGroups: [
                {
                    id: `${p.id}-profile`,
                    name: 'Personal Profile',
                    platform: p.name as 'Facebook' | 'LinkedIn',
                    type: 'Profile',
                    followers: 0, // Or fetch this if available
                    isEnabled: true, // Always enabled
                    avatarUrl: '' // No avatar for default profile
                },
                ...mockPagesAndGroups.filter(pg => pg.platform.toLowerCase() === p.name.toLowerCase())
            ]
        }
    }
    return p;
});

export const platformsWithPagesAndGroups = platformsWithProfiles.map(p => {
    if (!p.pagesAndGroups) {
        return {
            ...p,
            pagesAndGroups: []
        }
    }
    return p;
});

export type PlatformWithPagesAndGroups = typeof platformsWithPagesAndGroups[0];
export type SelectableItem = PlatformWithPagesAndGroups['pagesAndGroups'][0];
