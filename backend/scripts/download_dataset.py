import urllib.request
import zipfile
import os

url = "https://archive.ics.uci.edu/static/public/501/beijing+multi+site+air+quality+data.zip"
dataset_dir = r"C:\Users\shash\.gemini\antigravity\scratch\TerraCast\backend\dataset"
zip_path = os.path.join(dataset_dir, "beijing_aqi.zip")

print("Creating directories...")
os.makedirs(dataset_dir, exist_ok=True)

print(f"Downloading dataset from {url}...")
urllib.request.urlretrieve(url, zip_path)
print("Download complete.")

print("Extracting zip file...")
with zipfile.ZipFile(zip_path, 'r') as zip_ref:
    zip_ref.extractall(dataset_dir)
print("Extraction complete.")

print("Cleaning up zip file...")
os.remove(zip_path)

# Verify extraction
extracted_files = os.listdir(dataset_dir)
print(f"Successfully prepared dataset. Found {len(extracted_files)} files/folders.")
