export const encodePolyline = (coords: { lat: number; lng: number }[]): string => {
  let result = '';
  let plat = 0;
  let plng = 0;

  for (const coord of coords) {
    const late5 = Math.round(coord.lat * 1e5);
    const lnge5 = Math.round(coord.lng * 1e5);
    const dlat = late5 - plat;
    const dlng = lnge5 - plng;
    plat = late5;
    plng = lnge5;

    result += encodeSignedNumber(dlat);
    result += encodeSignedNumber(dlng);
  }

  return result;
};

const encodeSignedNumber = (num: number): string => {
  const temp = num < 0 ? ~(num << 1) : num << 1;
  return encodeUnsignedNumber(temp);
};

const encodeUnsignedNumber = (num: number): string => {
  let result = '';
  let shift = num;
  while (shift >= 0x20) {
    result += String.fromCharCode((0x20 | (shift & 0x1f)) + 63);
    shift >>= 5;
  }
  result += String.fromCharCode(shift + 63);
  return result;
};

export const decodePolyline = (encoded: string): { lat: number; lng: number }[] => {
  const coords: { lat: number; lng: number }[] = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  while (index < encoded.length) {
    let shift = 0;
    let result = 0;
    let byte: number;
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    const dlat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    const dlng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    coords.push({ lat: lat / 1e5, lng: lng / 1e5 });
  }

  return coords;
};
