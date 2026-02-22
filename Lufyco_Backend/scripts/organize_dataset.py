"""
DeepFashion Dataset Organization Script

This script organizes the DeepFashion dataset images into category subfolders
required for TensorFlow ImageDataGenerator.

Before: train_images/MEN-Denim-id_00000080-01_7_additional.png
After:  train_images/mens_bottoms/MEN-Denim-id_00000080-01_7_additional.png

Usage:
    python organize_dataset.py
"""

import os
import shutil
from pathlib import Path
from collections import defaultdict

# ========================================
# CONFIGURATION
# ========================================

# Paths
DATASET_ROOT = r"D:\My_PaidProjects\Lufyco_Clothing\datasets"
TRAIN_DIR = os.path.join(DATASET_ROOT, "train_images")
ORGANIZED_DIR = os.path.join(DATASET_ROOT, "train_images_organized")

# Category mappings - group similar items
CATEGORY_MAPPING = {
    # Men's categories
    'MEN-Denim': 'mens_bottoms',
    'MEN-Pants': 'mens_bottoms',
    'MEN-Shorts': 'mens_bottoms',
    'MEN-Jackets_Vests': 'mens_outerwear',
    'MEN-Shirts_Polos': 'mens_tops',
    'MEN-Tees_Tanks': 'mens_tops',
    'MEN-Sweaters': 'mens_tops',
    'MEN-Sweatshirts_Hoodies': 'mens_tops',
    'MEN-Suiting': 'mens_formal',
    
    # Women's categories
    'WOMEN-Dresses': 'womens_dresses',
    'WOMEN-Blouses_Shirts': 'womens_tops',
    'WOMEN-Tees_Tanks': 'womens_tops',
    'WOMEN-Sweaters': 'womens_tops',
    'WOMEN-Sweatshirts_Hoodies': 'womens_tops',
    'WOMEN-Denim': 'womens_bottoms',
    'WOMEN-Pants': 'womens_bottoms',
    'WOMEN-Shorts': 'womens_bottoms',
    'WOMEN-Skirts': 'womens_bottoms',
    'WOMEN-Jackets_Coats': 'womens_outerwear',
    'WOMEN-Cardigans': 'womens_topwear',
    'WOMEN-Rompers_Jumpsuits': 'womens_onepiece',
    'WOMEN-Suiting_Blazers': 'womens_formal',
}

# ========================================
# FUNCTIONS
# ========================================

def extract_category_from_filename(filename):
    """Extract category from DeepFashion filename"""
    # Format: "MEN-Denim-id_00000080-01_7_additional.png"
    # or "WOMEN-Blouses_Shirts-id_00000001-02_4_full.png"
    
    parts = filename.split('-')
    if len(parts) >= 2:
        # Get gender and category
        gender = parts[0]  # MEN or WOMEN
        category = parts[1]  # Denim, Jackets_Vests, etc.
        
        key = f"{gender}-{category}"
        return CATEGORY_MAPPING.get(key, 'other')
    
    return 'other'

def organize_dataset(dry_run=True):
    """
    Organize dataset into category folders
    
    Args:
        dry_run: If True, only print what would be done without moving files
    """
    print(f"\n{'DRY RUN - ' if dry_run else ''}Organizing DeepFashion Dataset")
    print("=" * 60)
    
    # Check if source directory exists
    if not os.path.exists(TRAIN_DIR):
        print(f"❌ Error: Source directory not found: {TRAIN_DIR}")
        return
    
    # Create output directory
    if not dry_run:
        os.makedirs(ORGANIZED_DIR, exist_ok=True)
        print(f"✅ Created output directory: {ORGANIZED_DIR}")
    
    # Get all image files
    image_extensions = {'.png', '.jpg', '.jpeg'}
    all_files = [f for f in os.listdir(TRAIN_DIR) 
                 if os.path.splitext(f)[1].lower() in image_extensions]
    
    print(f"\n📊 Found {len(all_files)} total images")
    
    # Group files by category
    category_counts = defaultdict(int)
    
    for i, filename in enumerate(all_files):
        if i % 1000 == 0:
            print(f"Processing: {i}/{len(all_files)}...")
        
        # Extract category
        category = extract_category_from_filename(filename)
        category_counts[category] += 1
        
        # Determine paths
        src_path = os.path.join(TRAIN_DIR, filename)
        dest_category_dir = os.path.join(ORGANIZED_DIR, category)
        dest_path = os.path.join(dest_category_dir, filename)
        
        if not dry_run:
            # Create category directory if it doesn't exist
            os.makedirs(dest_category_dir, exist_ok=True)
            
            # Copy file (use copy2 to preserve metadata)
            shutil.copy2(src_path, dest_path)
    
    # Print summary
    print("\n" + "=" * 60)
    print("📊 SUMMARY")
    print("=" * 60)
    print(f"\nCategories created: {len(category_counts)}")
    print("\nImages per category:")
    for category in sorted(category_counts.keys()):
        count = category_counts[category]
        print(f"  {category:20s}: {count:5d} images")
    
    print(f"\nTotal images: {sum(category_counts.values())}")
    
    if dry_run:
        print("\n⚠️  This was a DRY RUN - no files were moved")
        print("Set dry_run=False to actually organize the dataset")
    else:
        print(f"\n✅ Dataset organized successfully!")
        print(f"Output location: {ORGANIZED_DIR}")

def verify_organization():
    """Verify the organized dataset structure"""
    print("\n🔍 Verifying organized dataset...")
    
    if not os.path.exists(ORGANIZED_DIR):
        print(f"❌ Organized directory not found: {ORGANIZED_DIR}")
        return
    
    categories = [d for d in os.listdir(ORGANIZED_DIR) 
                  if os.path.isdir(os.path.join(ORGANIZED_DIR, d))]
    
    print(f"✅ Found {len(categories)} categories:")
    for cat in sorted(categories):
        cat_path = os.path.join(ORGANIZED_DIR, cat)
        num_images = len([f for f in os.listdir(cat_path) 
                         if f.endswith(('.png', '.jpg', '.jpeg'))])
        print(f"  {cat}: {num_images} images")

# ========================================
# MAIN
# ========================================

if __name__ == "__main__":
    print("""
╔═══════════════════════════════════════════════════════════╗
║     DeepFashion Dataset Organization Script              ║
╚═══════════════════════════════════════════════════════════╝
""")
    
    # Step 1: Dry run to preview
    print("\n📋 Step 1: Preview (Dry Run)")
    organize_dataset(dry_run=True)
    
    # Step 2: Confirm
    print("\n" + "=" * 60)
    response = input("\nProceed with actual organization? (yes/no): ").strip().lower()
    
    if response in ['yes', 'y']:
        # Step 3: Actual organization
        print("\n📋 Step 2: Organizing dataset...")
        organize_dataset(dry_run=False)
        
        # Step 4: Verify
        verify_organization()
        
        print("\n✅ All done! You can now use the organized dataset for training.")
        print(f"\nUpdate your training script to use:")
        print(f"TRAIN_DIR = r\"{ORGANIZED_DIR}\"")
    else:
        print("\n❌ Organization cancelled.")
