export type TSorterProps = {
  readonly label: string;
  readonly propPath: string;
  readonly direction: 'desc' | 'asc';
};

export type TSortOption = {
  readonly label: string;
  readonly value: string;
};
