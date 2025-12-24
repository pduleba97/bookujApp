export async function getCoordsFromAddress(address) {
  if (!address) return;

  let normalizedAddress = address.trim(); //trim prefixes and suffixes spaces
  normalizedAddress = normalizedAddress.replace(
    /\b(ul|ulica|al|aleja|pl|plac)\.?\s*/gi,
    ""
  ); //remove common abbreviations (ul., al., pl., ulica, etc.)
  try {
    const response = await fetch(
      `https://photon.komoot.io/api/?q=${encodeURIComponent(normalizedAddress)}`
    );
    const data = await response.json();

    if (data && data.features && data.features.length > 0) {
      const coords = data.features[0].geometry.coordinates;

      return [coords[1], coords[0]];
    }

    return null; //no result
  } catch (err) {
    console.warn("Geocoding error:", err);
    return null;
  }
}
