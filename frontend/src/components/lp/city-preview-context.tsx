'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

const DEFAULT_CITY = 'London';

const CityPreviewContext = createContext<{
  city: string;
  setCity: (city: string) => void;
}>({
  city: DEFAULT_CITY,
  setCity: () => {},
});

export function CityPreviewProvider({ children }: { children: ReactNode }) {
  const [city, setCity] = useState(DEFAULT_CITY);
  return (
    <CityPreviewContext.Provider value={{ city, setCity }}>{children}</CityPreviewContext.Provider>
  );
}

export function usePreviewCity() {
  return useContext(CityPreviewContext);
}

export { DEFAULT_CITY };
