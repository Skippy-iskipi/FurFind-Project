import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const PreferenceModal = ({ isOpen, onClose, onSave }) => {
    const [preferences, setPreferences] = useState({
        petType: 'Both',
        agePreferences: [],
        location: ''
    });

    const locations = [
        "Abucay",
        "Bagac",
        "Balanga",
        "Dinalupihan",
        "Hermosa",
        "Limay",
        "Mariveles",
        "Morong",
        "Orani",
        "Orion",
        "Pilar",
        "Samal"
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch('http://localhost:5000/api/auth/preferences', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ preferences })
            });

            const data = await response.json();
            if (data.success) {
                toast.success('Preferences saved successfully');
                onSave(preferences);
                onClose();
            } else {
                throw new Error(data.message || 'Failed to save preferences');
            }
        } catch (error) {
            console.error('Error saving preferences:', error);
            toast.error('Error updating preferences');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#D4F5F5] p-6 rounded-md w-[480px]">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">Pet Preferences</h2>
                    <button
                        onClick={onClose}
                        className="text-[#7A62DC] text-2xl"
                    >
                        &times;
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Pet Type */}
                    <div>
                        <label className="block mb-2">Pet Type</label>
                        <select
                            value={preferences.petType}
                            onChange={(e) => setPreferences({...preferences, petType: e.target.value})}
                            className="w-full rounded-md p-2 bg-white"
                        >
                            <option value="Both">Both</option>
                            <option value="Dog">Dog</option>
                            <option value="Cat">Cat</option>
                        </select>
                    </div>

                    {/* Age Preferences */}
                    <div>
                        <label className="block mb-2">Age Preferences</label>
                        <div className="space-y-2">
                            {['Baby', 'Young', 'Teenager', 'Adult'].map((age) => (
                                <label key={age} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={preferences.agePreferences.includes(age)}
                                        onChange={(e) => {
                                            const newAges = e.target.checked
                                                ? [...preferences.agePreferences, age]
                                                : preferences.agePreferences.filter(a => a !== age);
                                            setPreferences({...preferences, agePreferences: newAges});
                                        }}
                                        className="mr-2 rounded border-gray-300"
                                    />
                                    {age}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block mb-2">Location</label>
                        <select
                            value={preferences.location}
                            onChange={(e) => setPreferences({...preferences, location: e.target.value})}
                            className="w-full rounded-md p-2 bg-white"
                        >
                            <option value="">Select Location...</option>
                            {locations.map(location => (
                                <option key={location} value={location}>
                                    {location}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end gap-4 mt-8">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-[#7A62DC] text-white rounded-md hover:bg-[#6249c7] transition-colors"
                        >
                            Save Preferences
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PreferenceModal; 