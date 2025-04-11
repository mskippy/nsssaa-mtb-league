import openpyxl
import pandas as pd
import json

# Load the Excel workbook
workbook = openpyxl.load_workbook("Results 2025.xlsx")

# Load Excel file
excel_data = pd.read_excel("Results 2025.xlsx", sheet_name=None)

# === CONFIG ===
EXCEL_FILE = "Results 2025.xlsx"
OUTPUT_FILE = "data/results.json"  # adjust this path to match your site layout

# === LOAD SHEETS ===
print("Loading data from:", EXCEL_FILE)
df_individual = pd.read_excel(EXCEL_FILE, sheet_name="Individual Results")
df_teams = pd.read_excel(EXCEL_FILE, sheet_name="TeamPoints", header=1)

# === CLEAN TEAMS DATA ===
left = df_teams.iloc[1:, [0, 1, 8]]  # Left table
left.columns = ['Division', 'School', 'Total']

right = df_teams.iloc[1:, [11, 12, 19]]  # Right table
right.columns = ['Division', 'School', 'Total']

teams_combined = pd.concat([left, right], ignore_index=True)
teams_combined = teams_combined.dropna(subset=['Division', 'School', 'Total'])
teams_combined['Total'] = pd.to_numeric(teams_combined['Total'], errors='coerce')
teams_combined = teams_combined.drop_duplicates(subset=['Division', 'School'])

# Top 3 teams per division
teams_output = {}
for division in teams_combined['Division'].unique():
    top3 = (
        teams_combined[teams_combined['Division'] == division]
        .sort_values(by='Total', ascending=False)
        .head(3)
        .rename(columns={'School': 'name', 'Total': 'points'})
        [['name', 'points']]
        .reset_index(drop=True)
    )
    teams_output[division] = top3.to_dict(orient='records')

# === CLEAN RIDERS DATA ===
df_individual['Top 5'] = pd.to_numeric(df_individual['Top 5'], errors='coerce')
riders_output = {}
for division in df_individual['Division'].dropna().unique():
    top5 = (
        df_individual[df_individual['Division'] == division]
        .sort_values(by='Top 5', ascending=False)
        .head(5)
        .rename(columns={'Student Name': 'name', 'School': 'school', 'Top 5': 'points'})
        [['name', 'school', 'points']]
        .reset_index(drop=True)
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

import pandas as pd
import json

# === CONFIG ===
EXCEL_FILE = "Results 2025.xlsx"
OUTPUT_FILE = "data/team_results.json"  # Adjust this path as needed

# === LOAD SHEET ===
print("Loading data from:", EXCEL_FILE)
df_teams = pd.read_excel(EXCEL_FILE, sheet_name="TeamPoints", header=1)

# === CLEAN DATA ===
# Select columns A to I (columns 0 to 8 in 0-indexed pandas)
df_teams = df_teams.iloc[0:101, 0:9]
df_teams.columns = ['Division', 'School', 'Total', 'R1 Pts', 'R2 Pts', 'R3 Pts', 'R4 Pts', 'R5 Pts', 'R6 Pts']

# Remove rows with no points (Total == 0)
df_teams = df_teams[df_teams['Total'] != 0]

# Sort by division in your preferred order
division_order = ["Sr Boys", "Jr Boys", "Jr/Sr Girls", "Bant/Juv Girls", "Juv Boys", "Bant Boys"]
df_teams['Division'] = pd.Categorical(df_teams['Division'], categories=division_order, ordered=True)
df_teams = df_teams.sort_values(by='Division')

# === EXPORT TEAM RESULTS ===
team_data = {}

for division in df_teams['Division'].unique():
    div_teams = df_teams[df_teams['Division'] == division]
    
    # Append data for each team
    teams = div_teams[['School', 'R1 Pts', 'R2 Pts', 'R3 Pts', 'R4 Pts', 'R5 Pts', 'R6 Pts', 'Total']].to_dict(orient='records')
    team_data[division] = teams

# Write to JSON
with open(OUTPUT_FILE, "w") as f:
    json.dump(team_data, f, indent=2)

print("✅ team_results.json created at:", OUTPUT_FILE)
