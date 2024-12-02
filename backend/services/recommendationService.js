import { getSimilarUsers } from './collaborativeFilteringService.js';

export const calculatePetScore = (pet, userPreferences) => {
    if (!userPreferences) {
        return 0;
    }

    let score = 0;
    const weights = {
        petType: 0.2,
        age: 0.4,
        location: 0.4
    };

    // Pet Type matching - strict matching unless 'Both' is selected
    if (userPreferences.petType === 'Both') {
        score += weights.petType;
    } else if (pet.classification === userPreferences.petType) {
        score += weights.petType;
    } else {
        // If pet type doesn't match, return 0 immediately
        return 0;
    }

    // Age matching - strict matching
    if (userPreferences.agePreferences && 
        Array.isArray(userPreferences.agePreferences) && 
        userPreferences.agePreferences.length > 0) {
        if (userPreferences.agePreferences.includes(pet.age)) {
            score += weights.age;
        } else {
            // If age doesn't match preferences, significantly reduce score
            score *= 0.5;
        }
    }

    // Location matching - strict matching
    if (userPreferences.location && pet.location) {
        if (pet.location === userPreferences.location) {
            score += weights.location;
        } else {
            // If location doesn't match, significantly reduce score
            score *= 0.5;
        }
    }

    return score;
};

// Simple distance calculation (can be enhanced later)
const calculateDistance = (loc1, loc2) => {
    if (!loc1 || !loc2) return Infinity;
    return loc1 === loc2 ? 0 : 1; // Simple match/no-match for now
};

export const getHybridRecommendations = async (userId, userPreferences) => {
    try {
        // Get content-based score
        const contentScore = (pet) => calculatePetScore(pet, userPreferences);

        // Get collaborative filtering score
        const similarUsers = await getSimilarUsers(userId);
        const collaborativeScore = (pet) => calculateCollaborativeScore(pet, similarUsers);

        // Combine scores with weights
        return (pet) => {
            const content = contentScore(pet) * 0.5;
            const collaborative = collaborativeScore(pet) * 0.5;
            return content + collaborative;
        };
    } catch (error) {
        console.error('Error in hybrid recommendations:', error);
        // Fallback to content-based only
        return (pet) => calculatePetScore(pet, userPreferences);
    }
};

const calculateCollaborativeScore = (pet, similarUsers) => {
    try {
        let score = 0;
        const totalUsers = similarUsers.length;

        if (totalUsers === 0) return 0;

        // Check if similar users have adopted similar pets
        similarUsers.forEach(({ userId, score: userSimilarity }) => {
            // Add to score based on similar user's adoption patterns
            // This is a simplified version - you can make it more sophisticated
            score += userSimilarity;
        });

        return score / totalUsers;
    } catch (error) {
        console.error('Error calculating collaborative score:', error);
        return 0;
    }
}; 