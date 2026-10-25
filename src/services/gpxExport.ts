import { TrackedCoordinate } from './locationService';
import { encodePolyline } from '../utils/polyline';

export const generateGPX = (
  coordinates: TrackedCoordinate[],
  name: string,
  type: string,
): string => {
  const gpxHeader = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="dashFly" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>${name}</name>
    <desc>${type} activity recorded by dashFly</desc>
    <time>${new Date().toISOString()}</time>
  </metadata>
  <trk>
    <name>${name}</name>
    <type>${type}</type>
    <trkseg>`;

  const trackPoints = coordinates
    .map(
      (c) => `
      <trkpt lat="${c.lat}" lon="${c.lng}">
        ${c.altitude !== null ? `<ele>${c.altitude}</ele>` : ''}
        <time>${c.timestamp.toISOString()}</time>
        ${c.speed !== null ? `<extensions><speed>${c.speed}</speed></extensions>` : ''}
      </trkpt>`,
    )
    .join('');

  const gpxFooter = `
    </trkseg>
  </trk>
</gpx>`;

  return gpxHeader + trackPoints + gpxFooter;
};
