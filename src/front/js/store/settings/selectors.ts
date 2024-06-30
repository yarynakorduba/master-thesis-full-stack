import { useBoundStore } from '..';

export const useGetAreSimplifiedUIDescriptionsShown = (): boolean =>
  useBoundStore((state) => state.areSimplifiedUIDescriptionsShown);

export const useSetAreSimplifiedUIDescriptionsShown = (): ((
  areSimplified: boolean,
) => void) => useBoundStore((state) => state.setAreSimplifiedDescriptionsShown);

export const useAreSimplifiedUIDescriptionsShown = (): [
  boolean,
  (areSimplified: boolean) => void,
] => [
  useGetAreSimplifiedUIDescriptionsShown(),
  useSetAreSimplifiedUIDescriptionsShown(),
];
