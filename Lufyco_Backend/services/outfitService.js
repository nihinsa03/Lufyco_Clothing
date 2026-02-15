const Product = require('../models/Product');

/**
 * Generate outfit recommendation based on user preferences
 * @param {Object} params - Recommendation parameters
 * @returns {Promise<Object>} Generated outfit
 */
const generateOutfit = async ({ mood, occasion, weather, userId }) => {
    try {
        // Step 1: Get all available products
        let query = {};

        // Step 2: Filter by occasion
        if (occasion) {
            switch (occasion.toLowerCase()) {
                case 'office':
                    // Formal wear: no t-shirts, hoodies, shorts
                    query.$and = [
                        { type: { $nin: ['T-Shirt', 'Hoodie'] } },
                        { subCategory: { $ne: 'Shorts' } }
                    ];
                    break;
                case 'party':
                    // Stylish pieces, dresses preferred
                    // No specific filter, just prioritize certain items
                    break;
                case 'wedding':
                    // Formal, elegant
                    query.category = { $in: ['Clothing', 'Formal'] };
                    break;
                case 'date':
                case 'casual':
                default:
                    // No strict filters
                    break;
            }
        }

        const allProducts = await Product.find(query);

        // Step 3: Filter by weather
        let weatherFiltered = allProducts;
        if (weather?.condition) {
            weatherFiltered = filterByWeather(allProducts, weather);
        }

        // Step 4: Categorize products
        const categorized = categorizeProducts(weatherFiltered);

        // Step 5: Assemble outfit
        const outfit = assembleOutfit(categorized, occasion);

        // Step 6: Add accessories
        const accessories = suggestAccessories(outfit, occasion);

        return {
            items: outfit,
            accessories,
            totalPrice: calculateTotalPrice(outfit),
            mood,
            occasion,
            weather
        };
    } catch (error) {
        console.error('Outfit generation error:', error);
        throw error;
    }
};

/**
 * Filter products by weather conditions
 */
const filterByWeather = (products, weather) => {
    const { condition, temperature } = weather;
    const temp = temperature || 75;

    // Hot weather (>75°F)
    if (temp > 75 || ['Sunny', 'Clear'].includes(condition)) {
        return products.filter(p => {
            const type = p.type?.toLowerCase() || '';
            const subCat = p.subCategory?.toLowerCase() || '';

            // Exclude heavy items
            return !['hoodie', 'sweater', 'jacket', 'coat'].includes(type) &&
                !['outerwear'].includes(subCat);
        });
    }

    // Cold weather (<60°F)
    if (temp < 60 || ['Rain', 'Snow', 'Fog', 'Cloud'].includes(condition)) {
        // Include warm items
        return products; // Keep all, will add outerwear in assembly
    }

    // Moderate weather
    return products;
};

/**
 * Categorize products by type
 */
const categorizeProducts = (products) => {
    return {
        tops: products.filter(p =>
            ['Tops', 'Shirt', 'Blouse', 'T-Shirt'].includes(p.subCategory || p.type)
        ),
        bottoms: products.filter(p =>
            ['Bottoms', 'Pants', 'Jeans', 'Shorts', 'Skirt'].includes(p.subCategory || p.type)
        ),
        dresses: products.filter(p =>
            ['Dress', 'Dresses'].includes(p.subCategory || p.category)
        ),
        outerwear: products.filter(p =>
            ['Outerwear', 'Jacket', 'Hoodie', 'Sweater', 'Coat'].includes(p.type || p.subCategory)
        ),
        shoes: products.filter(p =>
            ['Shoes', 'Footwear'].includes(p.category || p.subCategory)
        )
    };
};

/**
 * Assemble outfit from categorized products
 */
const assembleOutfit = (categorized, occasion) => {
    const outfit = [];

    // 30% chance for dress (if available and appropriate)
    const useDress = categorized.dresses.length > 0 &&
        Math.random() < 0.3 &&
        ['Party', 'Date', 'Wedding'].includes(occasion);

    if (useDress) {
        // Pick a dress
        outfit.push(randomPick(categorized.dresses));
    } else {
        // Pick top
        if (categorized.tops.length > 0) {
            outfit.push(randomPick(categorized.tops));
        }

        // Pick bottom
        if (categorized.bottoms.length > 0) {
            outfit.push(randomPick(categorized.bottoms));
        }
    }

    // Add outerwear (20% chance, or if cold)
    if (categorized.outerwear.length > 0 && Math.random() < 0.2) {
        outfit.push(randomPick(categorized.outerwear));
    }

    // Always add shoes
    if (categorized.shoes.length > 0) {
        outfit.push(randomPick(categorized.shoes));
    }

    return outfit;
};

/**
 * Suggest accessories based on outfit
 */
const suggestAccessories = (outfit, occasion) => {
    const accessories = [];

    // Mock accessories (replace with real product queries)
    if (['Office', 'Wedding', 'Date'].includes(occasion)) {
        accessories.push({
            name: 'Classic Watch',
            price: 120.00,
            image: 'https://via.placeholder.com/100'
        });
    }

    if (['Party', 'Date'].includes(occasion)) {
        accessories.push({
            name: 'Designer Perfume',
            price: 85.00,
            image: 'https://via.placeholder.com/100'
        });
    }

    return accessories;
};

/**
 * Calculate total price of outfit
 */
const calculateTotalPrice = (items) => {
    return items.reduce((sum, item) => sum + (item.price || 0), 0);
};

/**
 * Randomly pick an item from array
 */
const randomPick = (array) => {
    return array[Math.floor(Math.random() * array.length)];
};

module.exports = {
    generateOutfit
};
