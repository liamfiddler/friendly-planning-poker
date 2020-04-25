import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom';
import { Route, Switch, Redirect } from 'wouter';
import { setPragma } from 'goober';
import Loader from './components/Loader';

setPragma(React.createElement);

const Home = lazy(() => import('./pages/Home'));
const Game = lazy(() => import('./pages/Game'));

const App = () => (
  <Switch>
    <Route path="/" component={withLoader(Home)} />
    <Route path="/play/:gameId" component={withLoader(Game)} />
    <Redirect to="/" />
  </Switch>
);

const withLoader = (Component: any) => (props: any) => (
  <Suspense fallback={<Loader />}>
    <Component {...props} />
  </Suspense>
);

ReactDOM.render(<App />, document.getElementById('app'));
