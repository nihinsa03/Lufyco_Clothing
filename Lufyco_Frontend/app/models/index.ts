export interface ClothingItem {
    _id: string; // Using _id to match MongoDB style if needed, or just id
    name: string;
    category: 'Tops' | 'Bottoms' | 'Dresses' | 'Outerwear' | 'Accessories' | 'Shoes' | 'All';
    colors: string[];
    seasonTags?: string[];
    imageUri: string;
    createdAt?: Date;
    userId?: string;
}

export interface LookRequest {
    mood: string;
    occasion: string;
    when: 'Now' | 'Future';
    dateTime?: Date;
    weather?: string;
}

export interface Outfit {
    id: string;
    items: ClothingItem[];
    score?: number;
    createdAt: Date;
    userMood?: string;
    userOccasion?: string;
}

export interface CalendarEvent {
    id: string;
    title: string;
    dateTime: Date;
    occasionTag: string;
    linkedOutfitId?: string;
    linkedOutfit?: Outfit; // Populated for UI
}
