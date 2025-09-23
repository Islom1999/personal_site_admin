import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { FuseNavigationItem } from '@fuse/components/navigation';
import { Navigation } from 'app/core/navigation/navigation.types';
import { cloneDeep } from 'lodash';
import { Observable, of, ReplaySubject, tap } from 'rxjs';
import { defaultNavigation } from './navigation';
import { UserService } from '../user/user.service'
import { toSignal } from '@angular/core/rxjs-interop'

@Injectable({ providedIn: 'root' })
export class NavigationService {
    private _httpClient = inject(HttpClient);
    private _navigation: ReplaySubject<Navigation> = new ReplaySubject<Navigation>(1);
    private _userService = inject(UserService)
    private permissions = toSignal(this._userService.permissions$)

    private readonly _compactNavigation: FuseNavigationItem[] = defaultNavigation;
    private readonly _defaultNavigation: FuseNavigationItem[] = defaultNavigation;
    private readonly _futuristicNavigation: FuseNavigationItem[] = defaultNavigation;
    private readonly _horizontalNavigation: FuseNavigationItem[] = defaultNavigation;

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for navigation
     */
    get navigation$(): Observable<Navigation> {
        return this._navigation.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get all navigation data
     */
    get(): Observable<Navigation> {
      this._compactNavigation.forEach((compactNavItem) => {
        this._defaultNavigation.forEach((defaultNavItem) => {
          if (defaultNavItem.id === compactNavItem.id) {
            compactNavItem.children = cloneDeep(defaultNavItem.children)
          }
        })
      })
  
      // Fill futuristic navigation children using the default navigation
      this._futuristicNavigation.forEach((futuristicNavItem) => {
        this._defaultNavigation.forEach((defaultNavItem) => {
          if (defaultNavItem.id === futuristicNavItem.id) {
            futuristicNavItem.children = cloneDeep(defaultNavItem.children)
          }
        })
      })
  
      // Fill horizontal navigation children using the default navigation
      this._horizontalNavigation.forEach((horizontalNavItem) => {
        this._defaultNavigation.forEach((defaultNavItem) => {
          if (defaultNavItem.id === horizontalNavItem.id) {
            horizontalNavItem.children = cloneDeep(defaultNavItem.children)
          }
        })
      })
  
      const filterNav = (items: FuseNavigationItem[]): FuseNavigationItem[] => {
        return items
          .filter((item) => {
            // Agar itemda permissions yo‘q bo‘lsa — ko‘rsatamiz
            if (!item.permissions || item.permissions.length === 0) return true
            // Userda hech bo‘lmasa bitta mos permission bo‘lsa — ko‘rsatamiz
            return item.permissions.some((p) => this.permissions().includes(p))
          })
          .map((item) => ({
            ...item,
            children: item.children ? filterNav(item.children) : undefined,
          }))
      }
  
      return of({
        compact: filterNav(cloneDeep(this._compactNavigation)),
        default: filterNav(cloneDeep(this._defaultNavigation)),
        futuristic: filterNav(cloneDeep(this._futuristicNavigation)),
        horizontal: filterNav(cloneDeep(this._horizontalNavigation)),
      }).pipe(
        tap((navigation) => {
          this._navigation.next(navigation)
        }),
      )
    }
  
    // get(): Observable<Navigation> {
    //     this._compactNavigation.forEach((compactNavItem) => {
    //         this._defaultNavigation.forEach((defaultNavItem) => {
    //             if (defaultNavItem.id === compactNavItem.id) {
    //                 compactNavItem.children = cloneDeep(defaultNavItem.children);
    //             }
    //         });
    //     });

    //     // Fill futuristic navigation children using the default navigation
    //     this._futuristicNavigation.forEach((futuristicNavItem) => {
    //         this._defaultNavigation.forEach((defaultNavItem) => {
    //             if (defaultNavItem.id === futuristicNavItem.id) {
    //                 futuristicNavItem.children = cloneDeep(defaultNavItem.children);
    //             }
    //         });
    //     });

    //     // Fill horizontal navigation children using the default navigation
    //     this._horizontalNavigation.forEach((horizontalNavItem) => {
    //         this._defaultNavigation.forEach((defaultNavItem) => {
    //             if (defaultNavItem.id === horizontalNavItem.id) {
    //                 horizontalNavItem.children = cloneDeep(defaultNavItem.children);
    //             }
    //         });
    //     });

    //     return of({
    //         compact: cloneDeep(this._compactNavigation),
    //         default: cloneDeep(this._defaultNavigation),
    //         futuristic: cloneDeep(this._futuristicNavigation),
    //         horizontal: cloneDeep(this._horizontalNavigation),
    //     }).pipe(
    //         tap((navigation) => {
    //             this._navigation.next(navigation);
    //         })
    //     )
    // }
}
