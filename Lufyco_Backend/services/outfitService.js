const ClosetItem = require("../models/ClosetItem");
const buildImageUrl = require("../utils/buildImageUrl");

/**
 * Normalize text safely
 */
const safeLower = (value) => (value || "").toString().trim().toLowerCase();

// /**
//  * Build frontend-safe image URL from DB local path
//  */
// const buildImageUrl = (imagePath) => {
//   if (!imagePath) return null;

//   // already full URL
//   if (
//     imagePath.startsWith("http://") ||
//     imagePath.startsWith("https://")
//   ) {
//     return imagePath;
//   }

//   // Windows path -> URL path
//   const normalized = imagePath.replace(/\\/g, "/");

//   // remove leading "userFiles/"
//   const relativePath = normalized.replace(/^userFiles\//, "");

//   // use env if available, otherwise fallback
//   const baseUrl =
//     process.env.BACKEND_BASE_URL || `http://localhost:${process.env.PORT || 5001}`;
    
//     console.log("BACKEND_BASE_URL:", process.env.BACKEND_BASE_URL);

//   return `${baseUrl}/uploads/${relativePath}`;
// };

/**
 * Normalize closet item for API response
 * featureVector intentionally omitted
 */
const normalizeClosetItem = (item) => ({
  _id: item._id || null,
  closetID: item.closetID ?? null,
  user: item.user ?? null,
  name: item.name ?? null,
  price: Number(item.price || 0),
  description: item.notes || null,
  image: buildImageUrl(item.image),
  category: item.category || null,
  subCategory: item.subCategory || null,
  type: item.type || null,
  gender: item.category || null, // compatibility with old response shape
  colors:
    Array.isArray(item.colors) && item.colors.length > 0
      ? item.colors
      : item.color
      ? [item.color]
      : [],
  sizes: Array.isArray(item.sizes) ? item.sizes : [],
  occasion: item.occasion || null,
  quantity: Number(item.quantity || 0),
  rating: Number(item.rating || 0),
  reviewsCount: Number(item.reviewsCount || 0),
  isNewArrival: Boolean(item.isNewArrival),
  style_tags: Array.isArray(item.style_tags) ? item.style_tags : [],
  season_tags: Array.isArray(item.season_tags) ? item.season_tags : [],
  material: item.material || null,
  fit: item.fit || null,
  weather_tag: item.weather_tag || null,
  pattern: item.pattern || null,
});

/**
 * Parse weather info from request
 * supports object or string
 */
const parseWeatherBucket = (weather) => {
  if (typeof weather === "string") {
    const condition = safeLower(weather);

    let bucket = "all";
    if (condition.includes("rain") || condition.includes("shower")) bucket = "rain";
    else if (
      condition.includes("sun") ||
      condition.includes("clear") ||
      condition.includes("hot")
    ) {
      bucket = "hot";
    } else if (
      condition.includes("cold") ||
      condition.includes("fog") ||
      condition.includes("snow")
    ) {
      bucket = "cold";
    }

    return {
      condition,
      temperature: null,
      bucket,
    };
  }

  const temp = Number(weather?.temperature);
  const condition = safeLower(weather?.condition);

  let bucket = "all";

  if (condition.includes("rain") || condition.includes("shower")) {
    bucket = "rain";
  } else if (!Number.isNaN(temp)) {
    if (temp >= 28) bucket = "hot";
    else if (temp >= 23) bucket = "warm";
    else if (temp >= 18) bucket = "cool";
    else bucket = "cold";
  }

  return {
    condition,
    temperature: Number.isNaN(temp) ? null : temp,
    bucket,
  };
};

/**
 * STRICT occasion scoring
 */
const getOccasionScore = (item, requestedOccasion) => {
  const itemOccasion = safeLower(item.occasion);
  const reqOccasion = safeLower(requestedOccasion);

  if (!reqOccasion) return 5;
  if (itemOccasion && itemOccasion === reqOccasion) return 30;

  return -1000;
};

/**
 * Weather score
 */
const getWeatherScore = (item, weatherInfo) => {
  const weatherTag = safeLower(item.weather_tag);

  if (!weatherInfo?.bucket || weatherInfo.bucket === "all") return 5;
  if (!weatherTag || weatherTag === "all") return 8;

  if (weatherInfo.bucket === "hot" && weatherTag === "hot") return 20;
  if (weatherInfo.bucket === "cold" && weatherTag === "cold") return 20;
  if (weatherInfo.bucket === "rain" && weatherTag === "rain") return 20;
  if (weatherInfo.bucket === "warm" && (weatherTag === "all" || weatherTag === "hot")) return 12;
  if (weatherInfo.bucket === "cool" && (weatherTag === "all" || weatherTag === "cold")) return 12;

  return 0;
};

/**
 * Style score
 */
const getStyleScore = (item, occasion) => {
  const tags = Array.isArray(item.style_tags)
    ? item.style_tags.map((t) => safeLower(t))
    : [];
  const reqOccasion = safeLower(occasion);

  if (!reqOccasion) return 5;

  if (reqOccasion === "casual" && tags.includes("casual")) return 10;
  if (reqOccasion === "office" && (tags.includes("minimal") || tags.includes("formal"))) return 10;
  if (reqOccasion === "party" && (tags.includes("trendy") || tags.includes("bold"))) return 10;
  if (reqOccasion === "date" && (tags.includes("minimal") || tags.includes("elegant"))) return 10;
  if (reqOccasion === "wedding" && (tags.includes("formal") || tags.includes("elegant"))) return 10;

  return 0;
};

/**
 * Season / material / fit score
 */
const getSeasonMaterialFitScore = (item, weatherInfo, occasion) => {
  let score = 0;

  const seasonTags = Array.isArray(item.season_tags)
    ? item.season_tags.map((s) => safeLower(s))
    : [];
  const material = safeLower(item.material);
  const fit = safeLower(item.fit);
  const type = safeLower(item.type);
  const reqOccasion = safeLower(occasion);

  if (weatherInfo.bucket === "hot") {
    if (seasonTags.includes("summer")) score += 10;
    if (material.includes("cotton")) score += 5;

    if (["hoodie", "coat", "sweater", "jacket"].includes(type)) score -= 30;
  }

  if (weatherInfo.bucket === "cold") {
    if (seasonTags.includes("winter")) score += 10;
    if (["hoodie", "coat", "sweater", "jacket", "blazer", "cardigan"].includes(type)) score += 8;
  }

  if (weatherInfo.bucket === "rain") {
    if (safeLower(item.weather_tag) === "rain") score += 10;
  }

  if (reqOccasion === "office") {
    if (fit === "regular" || fit === "slim") score += 5;
    if (type === "shorts") score -= 40;
  }

  return score;
};

const NEUTRAL_COLORS = ["black", "white", "grey", "gray", "beige", "navy", "brown"];

/**
 * Get item colors
 */
const getItemColors = (item) => {
  const list = [];

  if (Array.isArray(item.colors)) {
    for (const c of item.colors) {
      if (c) list.push(safeLower(c));
    }
  }

  if (item.color) {
    list.push(safeLower(item.color));
  }

  return [...new Set(list)];
};

/**
 * Color harmony score
 */
const getColorHarmonyScore = (itemA, itemB = null) => {
  const colorsA = getItemColors(itemA);

  if (!itemB) {
    if (colorsA.some((c) => NEUTRAL_COLORS.includes(c))) return 10;
    return 5;
  }

  const colorsB = getItemColors(itemB);

  const aHasNeutral = colorsA.some((c) => NEUTRAL_COLORS.includes(c));
  const bHasNeutral = colorsB.some((c) => NEUTRAL_COLORS.includes(c));

  if (aHasNeutral || bHasNeutral) return 15;

  const sameColor = colorsA.some((c) => colorsB.includes(c));
  if (sameColor) return 12;

  const multiA = colorsA.includes("multi");
  const multiB = colorsB.includes("multi");

  if (multiA && !bHasNeutral) return -10;
  if (multiB && !aHasNeutral) return -10;

  return 5;
};

/**
 * Pattern penalty
 */
const getPatternPenalty = (itemA, itemB = null) => {
  const patternA = safeLower(itemA.pattern);
  const colorsA = getItemColors(itemA);

  if (!itemB) {
    if (patternA && patternA !== "solid" && colorsA.includes("multi")) return -5;
    return 0;
  }

  const patternB = safeLower(itemB.pattern);
  const colorsB = getItemColors(itemB);

  const loudA = (patternA && patternA !== "solid") || colorsA.includes("multi");
  const loudB = (patternB && patternB !== "solid") || colorsB.includes("multi");

  if (loudA && loudB) return -15;
  return 0;
};

/**
 * Classify item group
 */
const classifyItem = (item) => {
  const sub = safeLower(item.subCategory);
  const type = safeLower(item.type);

  if (
    sub === "tops" ||
    ["t-shirt", "shirt", "blouse", "top", "polo", "crop top", "tunic"].includes(type)
  ) {
    return "top";
  }

  if (
    sub === "bottoms" ||
    ["jeans", "pants", "trouser", "trousers", "shorts", "skirt", "leggings"].includes(type)
  ) {
    return "bottom";
  }

  if (
    sub === "dresses" ||
    ["dress", "gown", "jumpsuit", "romper"].includes(type)
  ) {
    return "dress";
  }

  if (
    sub === "outerwear" ||
    ["jacket", "hoodie", "sweater", "coat", "blazer", "cardigan"].includes(type)
  ) {
    return "outerwear";
  }

  return "other";
};

/**
 * STRICT occasion hard rule
 */
const passesOccasionHardRule = (item, occasion) => {
  const reqOccasion = safeLower(occasion);
  const itemOccasion = safeLower(item.occasion);

  if (!reqOccasion) return true;

  if (itemOccasion !== reqOccasion) return false;

  const type = safeLower(item.type);
  const pattern = safeLower(item.pattern);
  const styleTags = Array.isArray(item.style_tags)
    ? item.style_tags.map((t) => safeLower(t))
    : [];

  if (reqOccasion === "office") {
    if (type === "shorts") return false;
    if (type === "hoodie") return false;
    if (type === "t-shirt" && pattern && pattern !== "solid") return false;
  }

  if (reqOccasion === "wedding") {
    if (type === "t-shirt" || type === "shorts") return false;
  }

  if (reqOccasion === "party") {
    if (styleTags.includes("casual") && type === "t-shirt" && pattern === "solid") {
      return false;
    }
  }

  return true;
};

/**
 * Score a single item
 */
const scoreSingleItem = (item, occasion, weatherInfo) => {
  let score = 0;

  score += getOccasionScore(item, occasion);
  score += getWeatherScore(item, weatherInfo);
  score += getStyleScore(item, occasion);
  score += getSeasonMaterialFitScore(item, weatherInfo, occasion);
  score += getColorHarmonyScore(item);
  score += getPatternPenalty(item);

  return score;
};

/**
 * Score top + bottom combo
 */
const scoreTopBottomCombo = (top, bottom, occasion, weatherInfo) => {
  let score = 0;

  score += scoreSingleItem(top, occasion, weatherInfo);
  score += scoreSingleItem(bottom, occasion, weatherInfo);

  score += getColorHarmonyScore(top, bottom);
  score += getPatternPenalty(top, bottom);

  const topStyle = Array.isArray(top.style_tags) ? top.style_tags.map((x) => safeLower(x)) : [];
  const bottomStyle = Array.isArray(bottom.style_tags) ? bottom.style_tags.map((x) => safeLower(x)) : [];
  const sharedStyle = topStyle.some((tag) => bottomStyle.includes(tag));
  if (sharedStyle) score += 10;

  const reqOccasion = safeLower(occasion);
  const bottomType = safeLower(bottom.type);

  if (reqOccasion === "office" && ["pants", "trouser", "trousers", "skirt"].includes(bottomType)) {
    score += 12;
  }

  if (reqOccasion === "casual" && ["jeans", "pants", "shorts"].includes(bottomType)) {
    score += 8;
  }

  return score;
};

/**
 * Score dress combo
 */
const scoreDressCombo = (dress, occasion, weatherInfo) => {
  let score = 0;
  score += scoreSingleItem(dress, occasion, weatherInfo);

  const reqOccasion = safeLower(occasion);
  const dressType = safeLower(dress.type);

  if (["party", "date", "wedding"].includes(reqOccasion) && ["dress", "gown"].includes(dressType)) {
    score += 20;
  }

  if (reqOccasion === "office" && dressType === "dress") {
    score += 5;
  }

  return score;
};

/**
 * Pick best outerwear
 */
const pickBestOuterwear = (outerwearItems, occasion, weatherInfo) => {
  if (!Array.isArray(outerwearItems) || outerwearItems.length === 0) return null;

  const reqOccasion = safeLower(occasion);
  const bucket = weatherInfo?.bucket;

  let candidates = outerwearItems.filter((item) => {
    const type = safeLower(item.type);

    if (bucket === "hot" && ["hoodie", "coat", "sweater", "jacket"].includes(type)) {
      return false;
    }

    if (reqOccasion === "office" && ["blazer", "cardigan"].includes(type)) {
      return true;
    }

    return true;
  });

  if (candidates.length === 0) return null;

  candidates = candidates
    .map((item) => ({
      item,
      score: scoreSingleItem(item, occasion, weatherInfo),
    }))
    .sort((a, b) => b.score - a.score);

  const best = candidates[0];
  if (!best) return null;

  if (
    bucket === "cold" ||
    bucket === "rain" ||
    (reqOccasion === "office" && ["blazer", "cardigan"].includes(safeLower(best.item.type)))
  ) {
    return best.item;
  }

  return null;
};

/**
 * Empty outfit helper
 */
const buildEmptyOutfit = ({ mood, occasion, weather, message }) => ({
  items: [],
  accessories: [],
  totalPrice: 0,
  mood: mood || null,
  occasion: occasion || null,
  weather: weather || null,
  mlPowered: false,
  message,
});

/**
 * Generate NOW outfit from closetitems only - STRICT OCCASION
 */
const generate_closet = async ({
  userId,
  mood,
  occasion,
  weather,
}) => {
  const weatherInfo = parseWeatherBucket(weather);

  const closetItems = await ClosetItem.find({
    user: userId,
    isActive: true,
  }).lean();

  if (!closetItems || closetItems.length === 0) {
    return buildEmptyOutfit({
      mood,
      occasion,
      weather,
      message: "No clothes found in your closet.",
    });
  }

  const validItems = closetItems.filter((item) => passesOccasionHardRule(item, occasion));

  if (validItems.length === 0) {
    return buildEmptyOutfit({
      mood,
      occasion,
      weather,
      message: "No matching clothes found for the selected occasion.",
    });
  }

  const grouped = {
    tops: [],
    bottoms: [],
    dresses: [],
    outerwear: [],
    others: [],
  };

  for (const item of validItems) {
    const group = classifyItem(item);

    if (group === "top") grouped.tops.push(item);
    else if (group === "bottom") grouped.bottoms.push(item);
    else if (group === "dress") grouped.dresses.push(item);
    else if (group === "outerwear") grouped.outerwear.push(item);
    else grouped.others.push(item);
  }

  let bestCombo = null;

  if (grouped.tops.length > 0 && grouped.bottoms.length > 0) {
    for (const top of grouped.tops) {
      for (const bottom of grouped.bottoms) {
        const score = scoreTopBottomCombo(top, bottom, occasion, weatherInfo);

        if (!bestCombo || score > bestCombo.score) {
          bestCombo = {
            type: "top-bottom",
            score,
            items: [top, bottom],
          };
        }
      }
    }
  }

  if (grouped.dresses.length > 0) {
    for (const dress of grouped.dresses) {
      const score = scoreDressCombo(dress, occasion, weatherInfo);

      if (!bestCombo || score > bestCombo.score) {
        bestCombo = {
          type: "dress",
          score,
          items: [dress],
        };
      }
    }
  }

  if (!bestCombo) {
    return buildEmptyOutfit({
      mood,
      occasion,
      weather,
      message: "Not enough matching clothes found to build an outfit for the selected occasion.",
    });
  }

  const selectedItems = [...bestCombo.items];

  const bestOuterwear = pickBestOuterwear(grouped.outerwear, occasion, weatherInfo);
  if (bestOuterwear) {
    const alreadySelected = selectedItems.some(
      (x) => String(x._id) === String(bestOuterwear._id)
    );
    if (!alreadySelected) {
      selectedItems.push(bestOuterwear);
    }
  }

  const normalizedItems = selectedItems.map(normalizeClosetItem);
  const totalPrice = normalizedItems.reduce((sum, item) => sum + Number(item.price || 0), 0);

  return {
    items: normalizedItems,
    accessories: [],
    totalPrice,
    mood: mood || null,
    occasion: occasion || null,
    weather: weather || null,
    mlPowered: false,
  };
};

module.exports = {
  generate_closet,
};