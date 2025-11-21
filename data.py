import geopandas as gpd
import pandas as pd

#county files
counties = gpd.read_file("counties2024.json")
print(counties.head)
county_data = pd.read_csv("measles_counties_cases.csv", dtype={'county_fips': str})
county_data = county_data.rename(columns={'county_fips':'GEOID'})
print(county_data.head)
counties["GEOID"] = counties["GEOID"].astype(str)
county_data["GEOID"] = county_data["GEOID"].astype(str)
counties = counties.merge(county_data, on="GEOID")
#print(counties.dtypes)
counties.to_file("counties.geojson", driver="GeoJSON")

#zip files
zips = gpd.read_file("zcta2018.json")
print(zips.head)
zip_data =pd.read_csv("measles_zips_cases_for_map.csv", dtype={'county_fips': str,'zcta5': str})
zips = zips.rename(columns={'ZCTA5CE10':'zcta5'})
print(zip_data.head)
zips["zcta5"] = zips["zcta5"].astype(str)
zip_data["zcta5"] = zip_data["zcta5"].astype(str)
zips = zips.merge(zip_data, on="zcta5")
#print(zips.dtypes)
zips.to_file("zipcodes.geojson", driver="GeoJSON")