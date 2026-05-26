import type { Request } from '@sap/cds';

/** Typed version of CDS Request — req.data is strongly typed instead of any */
export type TypedRequest<T> = Omit<Request, 'data'> & { data: T };