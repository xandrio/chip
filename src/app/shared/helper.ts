import { ActivatedRoute } from "@angular/router";

export class Helper {
    public static getDeepestChild(route: ActivatedRoute): ActivatedRoute {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }
}