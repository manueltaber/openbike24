export interface Route {
  uid: string;
  name: string;
  timestamp: Date;
  coordinates: Array<RouteCoordinates>;
}

export interface RouteCoordinates {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude: number | null;
  altutudeAccuracy: number | null;
  speed: number;
  timestamp: Date;
}
