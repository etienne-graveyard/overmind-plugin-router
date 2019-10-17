import { plugin, Plugin } from 'overmind-plugin';
import { Location } from 'history';
import createHistory from 'history/createBrowserHistory';
import pathMatch, { Match, Options as MatchOptions } from 'path-match';

type Routes = {
  [key: string]: string;
};

type DerivedRoutes<R extends Routes> = { [K in keyof R]: false | object };

type State<R extends Routes> = {
  location: Location;
  routes: DerivedRoutes<R>;
};

type Effects = {};

type Actions = {};

type RouterPlugin<R extends Routes> = Plugin<{ state: State<R>; effects: Effects; actions: Actions }>;

export default function createRouter<R extends Routes>(routes: R, matchOptions: MatchOptions = {}): RouterPlugin<R> {
  const history = createHistory();

  return plugin(path => {
    const createRoutes = pathMatch(matchOptions);

    const routeMatch = Object.keys(routes).reduce<{ [K in keyof R]: Match<object> }>(
      (acc, routeName) => {
        acc[routeName] = createRoutes(routes[routeName]);
        return acc;
      },
      {} as any
    );

    const stateAccess = (state: any): State<R> => path.reduce((acc, key) => acc[key], state);

    return {
      state: {
        location: history.location,
        routes: Object.keys(routes).reduce<DerivedRoutes<R>>(
          (acc, routeName) => {
            acc[routeName] = (state: any) => {
              return routeMatch[routeName](stateAccess(state).location.pathname);
            };
            return acc;
          },
          {} as any
        ),
      },
    };
  });
}
