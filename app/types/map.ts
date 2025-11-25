export interface GeoJsonLayer {
  id: string;
  name: string;
  url?: string; // optional
  data?: any;
  visible?: boolean;
  color?: string;
}
