import { LocationGeocodedAddress } from 'expo-location';

const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org';

export const reverseGeocodeOSM = async (
  lat: number,
  lng: number,
): Promise<LocationGeocodedAddress | null> => {
  try {
    const response = await fetch(
      `${NOMINATIM_BASE}/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=en`,
      {
        headers: {
          'User-Agent': 'dashFly/1.0 (fitness tracking app)',
        },
      },
    );
    const data = await response.json();

    if (!data || data.error) return null;

    const address = data.address || {};
    return {
      city: address.city || address.town || address.village || address.municipality || null,
      subregion: address.county || address.district || null,
      region: address.state || null,
      country: address.country || null,
      countryCode: address.country_code || null,
      name: data.display_name || null,
      street: address.road || null,
      district: address.suburb || address.neighbourhood || null,
      isoCountryCode: address.country_code?.toUpperCase() || null,
      postalCode: address.postcode || null,
      timesTamp: Date.now(),
    } as unknown as LocationGeocodedAddress;
  } catch {
    return null;
  }
};

export const searchPlaceOSM = async (
  query: string,
  limit: number = 10,
): Promise<{ lat: number; lng: number; name: string; type: string }[]> => {
  try {
    const response = await fetch(
      `${NOMINATIM_BASE}/search?q=${encodeURIComponent(query)}&format=json&limit=${limit}&accept-language=en`,
      {
        headers: {
          'User-Agent': 'dashFly/1.0 (fitness tracking app)',
        },
      },
    );
    const data = await response.json();

    if (!Array.isArray(data)) return [];

    return data.map((item: any) => ({
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      name: item.display_name,
      type: item.type,
    }));
  } catch {
    return [];
  }
};

export const getPlaceDetailsOSM = async (
  lat: number,
  lng: number,
): Promise<{ name: string; address: Record<string, string> } | null> => {
  try {
    const response = await fetch(
      `${NOMINATIM_BASE}/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1&accept-language=en`,
      {
        headers: {
          'User-Agent': 'dashFly/1.0 (fitness tracking app)',
        },
      },
    );
    const data = await response.json();
    if (!data || data.error) return null;
    return {
      name: data.display_name,
      address: data.address || {},
    };
  } catch {
    return null;
  }
};
