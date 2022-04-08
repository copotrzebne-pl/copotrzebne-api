import { Model } from 'sequelize-typescript';
import { BuildOptions } from 'sequelize';

export type ModelStatic<T> = typeof Model & {
  new (values?: Record<string, unknown>, options?: BuildOptions): T;
};
