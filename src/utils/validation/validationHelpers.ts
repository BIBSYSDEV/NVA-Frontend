import { AnySchema } from 'yup';

export type YupShape<T> = Partial<Record<keyof T, AnySchema>>;
