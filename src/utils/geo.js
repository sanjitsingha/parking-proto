import { parkingLots } from "../data/parkingLots";

export function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function findNearbyParkingLots(userLat, userLon, radiusKm = 5) {
  return parkingLots.filter((lot) => {
    const distance = getDistanceFromLatLonInKm(
      userLat,
      userLon,
      lot.lat,
      lot.lon
    );
    return distance <= radiusKm;
  });
}
