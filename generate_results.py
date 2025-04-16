import openpyxl
import pandas as pd
import json

# === CONFIG ===
EXCEL_FILE = "Results 2025 MASTER.xlsx"
TEAM_RESULTS_FILE = "data/team_results.json"  # Export path for team results

# === LOAD SHEETS ===
print("Loading data from:", EXCEL_FILE)

# Load TeamPoints sheet with specific columns A to I (0 to 8) and use the first 101 rows (A1:I101)
df_teams = pd.read_excel(EXCEL_FILE, sheet_name="TeamPoints", header=0, usecols="A:I", nrows=101)

# Clean up column names: Remove leading/trailing spaces and ensure they are strings
df_teams.columns = df_teams.columns.astype(str).str.strip()

# Debug: Print out the first 10 rows to inspect the data
print(df_teams.head(10))

# Force 'Division' and 'School' columns to be strings (to handle potential formatting issues)
df_teams['Division'] = df_teams['Division'].astype(str).str.strip()
df_teams['School'] = df_teams['School'].astype(str).str.strip()

# Ensure 'Division' column exists
if 'Division' not in df_teams.columns:
    raise ValueError("Column 'Division' is missing in the TeamPoints sheet")

# === CLEAN TEAM DATA ===
# Select columns 0 (Division), 1 (School), and 8 (Total), with Race columns 2-7
left = df_teams.iloc[:, [0, 1, 8]]  # Left table (Division, School, Total)
left.columns = ['Division', 'School', 'Total']

# Organize top 3 teams per division
teams_output = {}
for division in df_teams['Division'].unique():
    top3 = (
        df_teams[df_teams['Division'] == division]
        .sort_values(by='Total', ascending=False)
        .head(3)
        .rename(columns={'School': 'name', 'Total': 'points'})
        [['name', 'points']].reset_index(drop=True)
    )
    teams_output[division] = top3.to_dict(orient='records')

# === EXPORT TEAM RESULTS TO JSON ===
with open(TEAM_RESULTS_FILE, "w") as f:
    json.dump(teams_output, f, indent=2)

print(f"✅ team_results.json created at: {TEAM_RESULTS_FILE}")


# === CLEAN RIDERS DATA ===
df_individual = pd.read_excel(EXCEL_FILE, sheet_name="Individual Results")
df_individual['Top 5'] = pd.to_numeric(df_individual['Top 5'], errors='coerce')
OUTPUT_FILE = "data/results.json"

riders_output = {}
for division in df_individual['Division'].dropna().unique():
    top5 = (
        df_individual[df_individual['Division'] == division]
        .sort_values(by='Top 5', ascending=False)
        .head(5)
        .rename(columns={'Student Name': 'name', 'School': 'school', 'Top 5': 'points'})
        [['name', 'school', 'points']].reset_index(drop=True)
    )
    riders_output[division] = top5.to_dict(orient='records')

# === EXPORT TO JSON ===
results_json = {
    "teams": teams_output,
    "riders": riders_output
}

with open(OUTPUT_FILE, "w") as f:
    json.dump(results_json, f, indent=2)

print("✅ results.json created at:", OUTPUT_FILE)


# === EXPORT DIVISION RESULTS ===
division_data = {}

# Clean up NaN and convert Top 5 to numeric for sorting
df_individual['Top 5'] = pd.to_numeric(df_individual['Top 5'], errors='coerce')
df_individual = df_individual.fillna("")  # Replace all NaNs with empty strings

for division in df_individual['Division'].unique():
    if not division:
        continue

    div_df = df_individual[df_individual['Division'] == division].copy()
    div_df = div_df.sort_values(by='Top 5', ascending=False).reset_index(drop=True)

    riders = []
    for _, row in div_df.iterrows():
        rider = {
            "name": row.get("Student Name", ""),
            "plate": row.get("Plate #", ""),
            "R1 Place": row.get("R1 Place", ""),
            "R1 Pts": row.get("R1 Pts", ""),
            "R2 Place": row.get("R2 Place", ""),
            "R2 Pts": row.get("R2 Pts", ""),
            "R3 Place": row.get("R3 Place", ""),
            "R3 Pts": row.get("R3 Pts", ""),
            "R4 Place": row.get("R4 Place", ""),
            "R4 Pts": row.get("R4 Pts", ""),
            "R5 Place": row.get("R5 Place", ""),
            "R5 Pts": row.get("R5 Pts", ""),
            "R6 Place": row.get("R6 Place", ""),
            "R6 Pts": row.get("R6 Pts", ""),
            "points": row.get("Top 5", "")
        }
        riders.append(rider)

    division_data[division] = riders

# Save to file
with open("data/division_results.json", "w") as f:
    json.dump(division_data, f, indent=2)

print("✅ division_results.json created at: data/division_results.json")


# === EXPORT SCHOOL RESULTS ===
school_data = {}

# Group by division first
for division in df_individual['Division'].dropna().unique():
    div_df = df_individual[df_individual['Division'] == division].copy()
    div_df['Top 5'] = pd.to_numeric(div_df['Top 5'], errors='coerce')

    # Replace NaN in all relevant fields with empty strings to make it JSON safe
    div_df = div_df.fillna("")

    div_df = div_df.sort_values(by='Top 5', ascending=False).reset_index(drop=True)

    for _, row in div_df.iterrows():
        school = row['School']
        if not school:
            continue

        if school not in school_data:
            school_data[school] = []

        school_data[school].append({
            "name": row.get("Student Name", ""),
            "plate": row.get("Plate #", ""),
            "division": division,
            "R1 Place": row.get("R1 Place", ""),
            "R1 Pts": row.get("R1 Pts", ""),
            "R2 Place": row.get("R2 Place", ""),
            "R2 Pts": row.get("R2 Pts", ""),
            "R3 Place": row.get("R3 Place", ""),
            "R3 Pts": row.get("R3 Pts", ""),
            "R4 Place": row.get("R4 Place", ""),
            "R4 Pts": row.get("R4 Pts", ""),
            "R5 Place": row.get("R5 Place", ""),
            "R5 Pts": row.get("R5 Pts", ""),
            "R6 Place": row.get("R6 Place", ""),
            "R6 Pts": row.get("R6 Pts", ""),
            "Top 5": row.get("Top 5", ""),
            "points": row.get("Top 5", "")
        })

# Write school data safely to JSON
with open("data/school_results.json", "w") as f:
    json.dump(school_data, f, indent=2)

print("✅ school_results.json created at: data/school_results.json")


