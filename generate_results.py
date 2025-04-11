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




# === EXPORT FULL DIVISION RESULTS ===
division_data = {}

for division in df_individual['Division'].dropna().unique():
    div_df = df_individual[df_individual['Division'] == division].copy()
    div_df['Top 5'] = pd.to_numeric(div_df['Top 5'], errors='coerce')
    div_df = div_df.sort_values(by='Top 5', ascending=False).reset_index(drop=True)

    # Convert NaN safely and assign to the dictionary
    division_data[division] = json.loads(
        div_df.fillna("").to_json(orient='records')
    )

# Print the list of divisions to verify
print("Divisions found:", df_individual['Division'].dropna().unique())

with open("data/division_results.json", "w") as f:
    json.dump(division_data, f, indent=2)

print("✅ division_results.json created at: data/division_results.json")

# === EXPORT SCHOOL RESULTS ===
school_data = {}

# Group riders by school
for division in df_individual['Division'].dropna().unique():
    div_df = df_individual[df_individual['Division'] == division].copy()
    div_df['Top 5'] = pd.to_numeric(div_df['Top 5'], errors='coerce')
    div_df = div_df.sort_values(by='Top 5', ascending=False).reset_index(drop=True)

    for _, row in div_df.iterrows():
        school = row['School']
        if school not in school_data:
            school_data[school] = []

        # Replace NaN with a safe value (like an empty string or None)
        school_data[school].append({
            "name": row['Student Name'],
            "plate": row['Plate #'],
            "division": division,
            "R1 Place": row['R1 Place'] if pd.notna(row['R1 Place']) else '',
            "R1 Pts": row['R1 Pts'] if pd.notna(row['R1 Pts']) else '',
            "R2 Place": row['R2 Place'] if pd.notna(row['R2 Place']) else '',
            "R2 Pts": row['R2 Pts'] if pd.notna(row['R2 Pts']) else '',
            "R3 Place": row['R3 Place'] if pd.notna(row['R3 Place']) else '',
            "R3 Pts": row['R3 Pts'] if pd.notna(row['R3 Pts']) else '',
            "R4 Place": row['R4 Place'] if pd.notna(row['R4 Place']) else '',
            "R4 Pts": row['R4 Pts'] if pd.notna(row['R4 Pts']) else '',
            "R5 Place": row['R5 Place'] if pd.notna(row['R5 Place']) else '',
            "R5 Pts": row['R5 Pts'] if pd.notna(row['R5 Pts']) else '',
            "R6 Place": row['R6 Place'] if pd.notna(row['R6 Place']) else '',
            "R6 Pts": row['R6 Pts'] if pd.notna(row['R6 Pts']) else '',
            "Top 5": row['Top 5'],
            "points": row['Top 5']  # This will be calculated directly from the Top 5 column
        })
        
# Print the list of schools to verify
print("Schools found:", list(school_data.keys()))

# Export the school data to a JSON file
with open("data/school_results.json", "w") as f:
    json.dump(school_data, f, indent=2)

print("✅ school_results.json created at: data/school_results.json")
