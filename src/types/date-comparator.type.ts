export type DateComparator = (baseDate: Date | string) => {
  equals: (secondDate: Date | string) => boolean;
  earlierThan: (secondDate: Date | string) => boolean;
  laterThan: (secondDate: Date | string) => boolean;
  earlierThanOrEquals: (secondDate: Date | string) => boolean;
  laterThanOrEquals: (secondDate: Date | string) => boolean;
};
