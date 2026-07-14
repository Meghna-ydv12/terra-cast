import zipfile
import os

dataset_dir = r"C:\Users\shash\.gemini\antigravity\scratch\TerraCast\backend\dataset"
nested_zip = os.path.join(dataset_dir, "PRSA2017_Data_20130301-20170228.zip")

print("Extracting nested zip...")
with zipfile.ZipFile(nested_zip, 'r') as zip_ref:
    zip_ref.extractall(dataset_dir)
print("Done.")
