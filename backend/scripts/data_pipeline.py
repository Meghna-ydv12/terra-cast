import os
import zipfile
import pandas as pd
import glob

dataset_dir = r"C:\Users\shash\.gemini\antigravity\scratch\TerraCast\backend\dataset"
nested_zip = os.path.join(dataset_dir, "PRSA2017_Data_20130301-20170228.zip")
extract_folder = os.path.join(dataset_dir, "PRSA_Data_20130301-20170228")
output_csv = os.path.join(dataset_dir, "beijing_aqi_merged.csv")

# 1. Extract the nested zip if not already extracted
if os.path.exists(nested_zip) and not os.path.exists(extract_folder):
    print("Extracting nested zip...")
    with zipfile.ZipFile(nested_zip, 'r') as zip_ref:
        zip_ref.extractall(dataset_dir)
    print("Extraction complete.")

# 2. Merge all 12 station CSV files
print("Locating station CSV files...")
csv_files = glob.glob(os.path.join(extract_folder, "*.csv"))

if not csv_files:
    print("No CSV files found! Please check extraction.")
    exit(1)

print(f"Found {len(csv_files)} station files. Merging...")
dfs = []
for file in csv_files:
    df = pd.read_csv(file)
    dfs.append(df)

merged_df = pd.concat(dfs, ignore_index=True)
print(f"Merged dataset shape: {merged_df.shape}")

# 3. Basic Data Cleaning (Handling Missing Values)
print("Handling missing values...")
# Forward fill for time-series data makes sense for meteorological/pollution gaps
merged_df.ffill(inplace=True)
merged_df.bfill(inplace=True) # Catch any remaining NaNs at the very beginning

# 4. Save the cleaned dataset
print(f"Saving merged dataset to {output_csv}...")
merged_df.to_csv(output_csv, index=False)
print("Data preprocessing complete!")
