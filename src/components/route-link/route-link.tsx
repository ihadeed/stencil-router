import { Component, Prop, State } from '@stencil/core';
import matchPath from '../../utils/match-path';
import { RouterHistory, ActiveRouter, Listener, LocationSegments, MatchResults } from '../../global/interfaces';

/**
  * @name Route
  * @module ionic
  * @description
 */
@Component({
  tag: 'stencil-route-link'
})
export class RouteLink {
  @Prop({ context: 'activeRouter' }) activeRouter: ActiveRouter;
  unsubscribe: Listener = () => { return; };

  @Prop() url: string;
  @Prop() exact: boolean = false;
  @Prop() custom: boolean = false;
  @Prop() activeClass: string = 'link-active';

  @State() match: MatchResults | null = null;


  // Identify if the current route is a match.
  computeMatch(pathname?: string) {
    if (!pathname) {
      const location: LocationSegments = this.activeRouter.get('location');
      if (!location) {
        return null;
      }
      pathname = location.pathname;
    }

    return matchPath(pathname, {
      path: this.url,
      exact: this.exact,
      strict: true
    });
  }

  componentWillLoad() {
    // subscribe the project's active router and listen
    // for changes. Recompute the match if any updates get
    // pushed
    this.unsubscribe = this.activeRouter.subscribe(() => {
      this.match = this.computeMatch();
    });
    this.match = this.computeMatch();
  }

  componentWillUnmount() {
    // be sure to unsubscribe to the router so that we don't
    // get any memory leaks
    this.unsubscribe();
  }

  handleClick(e: MouseEvent) {
    e.preventDefault();
    if (!this.activeRouter) {
      console.warn(
        '<stencil-route-link> wasn\'t passed an instance of the router as the "router" prop!'
      );
      return;
    }

    (this.activeRouter.get('history') as RouterHistory).push(this.url, {});
  }

  render() {
    const classes = {
      [this.activeClass]: this.match !== null
    };

    if (this.custom) {
      return (
        <span class={classes} onClick={this.handleClick.bind(this)}>
          <slot />
        </span>
      );
    } else {
      return (
        <a class={classes} href={this.url} onClick={this.handleClick.bind(this)}>
          <slot />
        </a>
      );
    }
  }
}
