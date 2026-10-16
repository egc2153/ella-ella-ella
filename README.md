# MoMA Artists Dataset Exploration

## Dataset Information
- Dataset name: Artists.csv
- Source/organization: Museum of Modern Art
- URL: https://github.com/MuseumofModernArt/collection https://github.com/MuseumofModernArt/collection/blob/main/Artists.csv
- Date accessed: October 8, 2026
- Brief description: Public dataset of artists represented in the MoMA collection. Contains 15,934 records, representing all the artists who have work in MoMA's collection and have been catalogued in the database.
- Time period covered: Artists from many historical periods, but mostly the 19th–21st centuries.
- Geographic coverage: Global
- Number of rows: 15,938
- Number of columns: 9
- File format: CSV
- Data license/terms: Public museum data; see the "Give Attribution to MoMA" section in the README file on MoMA's github.

## Data Overview
Important variables:
- DisplayName (Artist's Name)
- Nationality
- Gender
- BeginDate (Year Artist was Born)
- EndDate (Year Artist Died)
- Note: ConstituentID, Wiki QID, and ULAN are not relevant for the purposes of this data exploration and visualization.

Basic statistics:
- Most represented nationalities: American, French, German, etc.
- Birth years range from ...
- percentage of men vs women
- Missing values appear in BeginDate/EndDate and some metadata fields.

## Questions Explored
Which geographies and nationalities are most represented in the MoMA artists dataset? How does the geographic distribution of 19 "featured" artists in the MoMA Design Store compare to the geographic distribution of all artists in MoMA's collection?

## Chart
This project includes a chart showing the top geographies represented in the MoMA artist collection as compared to the top geographies represented in the select group of artists MoMA highlights in their Design Store.

## Data Source
Museum of Modern Art (MoMA), public collection dataset, accessed October 8, 2026. 

## Limitations 
- The dataset reflects museum collection choices, not a complete sample of all artists globally.
- Some rows have missing or placeholder values such as 0 for birth or death year. 
- A sizeable chunk have unclassified/ unknown nationalities according to the dataset.