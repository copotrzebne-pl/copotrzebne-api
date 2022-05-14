import { DateComparator } from '../types/date-comparator.type';
import DateParseError from '../error/date-parse.error';

export const date: DateComparator = (baseDate: Date | string) => {
  function compare(date1: Date | string, date2: Date | string): number {
    const timestamp1 = new Date(date1).getTime();
    const timestamp2 = new Date(date2).getTime();

    if (isNaN(timestamp1) || isNaN(timestamp2)) {
      throw new DateParseError('Cannot parse date');
    }

    if (timestamp1 === timestamp2) {
      return 0;
    }

    return timestamp1 > timestamp2 ? 1 : -1;
  }

  function equals(secondDate: Date | string): boolean {
    return compare(baseDate, secondDate) === 0;
  }

  function earlierThan(secondDate: Date | string): boolean {
    return compare(baseDate, secondDate) === -1;
  }

  function laterThan(secondDate: Date | string): boolean {
    return compare(baseDate, secondDate) === 1;
  }

  function earlierThanOrEquals(secondDate: Date | string): boolean {
    const comparationResult = compare(baseDate, secondDate);
    return comparationResult === -1 || comparationResult === 0;
  }

  function laterThanOrEquals(secondDate: Date | string): boolean {
    const comparationResult = compare(baseDate, secondDate);
    return comparationResult === 1 || comparationResult === 0;
  }

  return {
    equals,
    earlierThan,
    laterThan,
    earlierThanOrEquals,
    laterThanOrEquals,
  };
};
