interface LeafletMapClickEvent {
  latlng?: {
    lat: number;
    lng: number;
  };
}

interface LeafletMarkerDragEvent {
  target?: {
    getLatLng?: () => {
      lat: number;
      lng: number;
    };
  };
}

export type { LeafletMapClickEvent, LeafletMarkerDragEvent };
