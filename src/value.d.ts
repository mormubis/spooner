type Literal = boolean | number | string | undefined;

export type List = Literal[] | Value[];

export type Collection =
  | { [key: string]: Literal }
  | { [key: string]: List }
  | { [key: string]: Value };

export type Value = Literal | List | Collection;
