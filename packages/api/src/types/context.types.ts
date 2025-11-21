export interface BaseContext {
  userId: string | undefined;
  setHeader: (name: string, value: string | string[]) => void;
  getHeader: (name: string) => string | string[] | undefined;
}

export interface ProtectedContext extends BaseContext {
  userId: string;
}
