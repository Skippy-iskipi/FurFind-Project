import { AdoptionApplication } from '../models/adoptionApplication.model.js';
import { UserPreference } from '../models/userPreference.model.js';

export const getSimilarUsers = async (userId) => {
    try {
        // Get current user's preferences and adoption history
        const userPrefs = await UserPreference.findOne({ userId });
        const userAdoptions = await AdoptionApplication.find({ 
            userId, 
            status: { $in: ['Approved', 'Completed'] }
        });

        // Get all other users with successful adoptions
        const otherUsers = await AdoptionApplication.find({
            userId: { $ne: userId },
            status: { $in: ['Approved', 'Completed'] }
        }).distinct('userId');

        // Calculate similarity scores
        const similarityScores = await Promise.all(otherUsers.map(async (otherId) => {
            const otherPrefs = await UserPreference.findOne({ userId: otherId });
            const otherAdoptions = await AdoptionApplication.find({
                userId: otherId,
                status: { $in: ['Approved', 'Completed'] }
            });

            const score = calculateUserSimilarity(
                userPrefs?.preferences,
                otherPrefs?.preferences,
                userAdoptions,
                otherAdoptions
            );

            return { userId: otherId, score };
        }));

        // Sort and return top similar users
        return similarityScores
            .filter(score => score.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);
    } catch (error) {
        console.error('Error getting similar users:', error);
        return [];
    }
};

const calculateUserSimilarity = (userPrefs, otherPrefs, userAdoptions, otherAdoptions) => {
    let score = 0;

    // Preference similarity (30% weight)
    if (userPrefs && otherPrefs) {
        if (userPrefs.petType === otherPrefs.petType) score += 0.1;
        if (hasCommonElements(userPrefs.agePreferences, otherPrefs.agePreferences)) score += 0.1;
        if (userPrefs.location === otherPrefs.location) score += 0.1;
    }

    // Adoption pattern similarity (70% weight)
    const userPetTypes = userAdoptions.map(a => a.petId.classification);
    const otherPetTypes = otherAdoptions.map(a => a.petId.classification);
    if (hasCommonElements(userPetTypes, otherPetTypes)) score += 0.3;

    const userPetAges = userAdoptions.map(a => a.petId.age);
    const otherPetAges = otherAdoptions.map(a => a.petId.age);
    if (hasCommonElements(userPetAges, otherPetAges)) score += 0.2;

    const userLocations = userAdoptions.map(a => a.petId.location);
    const otherLocations = otherAdoptions.map(a => a.petId.location);
    if (hasCommonElements(userLocations, otherLocations)) score += 0.2;

    return score;
};

const hasCommonElements = (arr1, arr2) => {
    if (!Array.isArray(arr1) || !Array.isArray(arr2)) return false;
    return arr1.some(item => arr2.includes(item));
}; 