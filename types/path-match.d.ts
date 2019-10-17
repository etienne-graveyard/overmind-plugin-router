declare module 'path-match' {
  export type Options = {
    sensitive?: boolean;
    strict?: boolean;
    end?: boolean;
  };

  export type Match<Params extends object> = (url: string) => false | Params;

  export type Route = <Params extends object>(path: string) => Match<Params>;

  export default function pathMatch(options?: Options): Route;
}
