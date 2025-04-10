import pandas as pd
import json

# === CONFIG ===
EXCEL_FILE = "Results 2025.xlsx"
OUTPUT_FILE = "public/data/results.json"  # adjust this path to match your site layout

# === LOAD SHEETS ===
print("Loading data from:", EXCEL_FILE)
df_individual = pd.read_excel(EXCEL_FILE, sheet_name="Individual Results")
df_teams = pd.read_excel(EXCEL_FILE, sheet_name="TeamsExport", header=1)

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
