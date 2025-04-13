// WhatToDoAI/mobile/src/types/location.ts

export interface Location {
  latitude: number;
  longitude: number;
  radius?: number; // in km
  address?: string; // Optional address details
  city?: string;
  country?: string;
}

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  formatted?: string; // Full formatted address
}

export interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export interface LocationSearchResult {
  id: string;
  name: string;
  address: Address;
  location: Location;
  type: 'city' | 'address' | 'poi' | 'region';
}

export default Location;
