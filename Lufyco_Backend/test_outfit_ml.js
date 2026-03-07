/**
 * test_outfit_ml.js
 * -----------------
 * Quick Node.js test to verify the outfit ML model loads and scores correctly.
 *
 * Run from Lufyco_Backend/:
 *   node test_outfit_ml.js
 */

const outfitMLService = require('./services/outfitMLService');
const { generateOutfit } = require('./services/outfitService');

async function runTests() {
    console.log('\n🧪 Testing Outfit ML Service\n' + '─'.repeat(45));

    // ── Test 1: Model loads ──────────────────────────────────────────
    console.log('\n[1] Warming up model...');
    await outfitMLService.warmup();
    const ready = outfitMLService.isReady();
    console.log(ready
        ? '   ✅ Model loaded successfully'
        : '   ⚠️  Model not loaded (run Python training scripts first) — fallback mode active'
    );

    // ── Test 2: Score a good Office outfit ───────────────────────────
    console.log('\n[2] Scoring a GOOD Office outfit (Shirt + Pants + Heels)...');
    const goodScore = await outfitMLService.scoreOutfitCombination(
        'Shirt', 'Pants', 'Heels', 'Office', 'Sunny', 26, 'Professional'
    );
    console.log(`   Score: ${goodScore !== null ? goodScore : 'N/A (model not loaded)'}`);
    if (goodScore !== null) {
        console.log(goodScore >= 0.55 ? '   ✅ Correctly rated as compatible' : '   ❌ Expected score ≥ 0.55');
    }

    // ── Test 3: Score a bad Office outfit ────────────────────────────
    console.log('\n[3] Scoring a BAD Office outfit (Hoodie + Shorts + Sports Shoes)...');
    const badScore = await outfitMLService.scoreOutfitCombination(
        'Hoodie', 'Shorts', 'Sports Shoes', 'Office', 'Sunny', 26, 'Relaxed'
    );
    console.log(`   Score: ${badScore !== null ? badScore : 'N/A (model not loaded)'}`);
    if (badScore !== null) {
        console.log(badScore < 0.55 ? '   ✅ Correctly rated as incompatible' : '   ❌ Expected score < 0.55');
    }

    // ── Test 4: Score a good Party outfit ────────────────────────────
    console.log('\n[4] Scoring a GOOD Party outfit (Dress + Heels)...');
    const partyScore = await outfitMLService.scoreOutfitCombination(
        'Dress', 'Skirt', 'Heels', 'Party', 'Clear', 24, 'Bold'
    );
    console.log(`   Score: ${partyScore !== null ? partyScore : 'N/A (model not loaded)'}`);

    // ── Test 5: Full outfit generation ───────────────────────────────
    console.log('\n[5] Full outfit generation — Office / Sunny / Professional...');
    try {
        const outfit = await generateOutfit({
            mood: 'Professional',
            occasion: 'Office',
            weather: { condition: 'Sunny', temperature: 28 },
            userId: 'test-user-001',
        });

        console.log(`   ✅ Outfit generated (${outfit.items.length} items)`);
        console.log(`   ML Powered: ${outfit.mlPowered}`);
        outfit.items.forEach((item, i) => {
            console.log(`   Item ${i + 1}: ${item.name || item.title || item.type || JSON.stringify(item).slice(0, 60)}`);
        });
    } catch (err) {
        console.log(`   ⚠️  ${err.message} (expected if no MongoDB connection)`);
    }

    console.log('\n' + '─'.repeat(45));
    console.log('Tests complete.\n');
    process.exit(0);
}

runTests().catch(err => {
    console.error('Test error:', err);
    process.exit(1);
});
