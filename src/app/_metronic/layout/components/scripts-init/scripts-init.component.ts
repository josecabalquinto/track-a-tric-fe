import { Component, OnDestroy, OnInit } from '@angular/core';
import { ResolveEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { LayoutService } from '../../core/layout.service';
import {
  ToggleComponent,
  ScrollTopComponent,
  DrawerComponent,
  StickyComponent,
  MenuComponent,
  ScrollComponent,
} from '../../../kt/components';
import { PageInfoService } from '../../core/page-info.service';
import { Title } from '@angular/platform-browser';
import { SplashScreenService } from '../../../partials';

@Component({
  selector: 'app-scripts-init',
  templateUrl: './scripts-init.component.html',
  standalone: false
})
export class ScriptsInitComponent implements OnInit, OnDestroy {
  private unsubscribe: Subscription[] = [];
  constructor(
    private layout: LayoutService,
    private pageInfo: PageInfoService,
    private router: Router,
    private titleService: Title,
    private splashScreenService: SplashScreenService,
  ) {
    const initPageInfo = () => {
      setTimeout(() => {
        this.pageInfo.calculateTitle();
        this.pageInfo.calculateBreadcrumbs();

        this.pageInfo.title.asObservable().subscribe((title) => {
          this.titleService.setTitle(title + ' - Metronic');
        });
      }, 10);
    };

    initPageInfo();
    // subscribe to router events
    this.router.events
      .pipe(filter((event) => event instanceof ResolveEnd))
      .subscribe(initPageInfo);
  }

  ngOnInit(): void {
    this.pluginsInitialization();
    this.hideSplashScreen();
    const layoutUpdateSubscription = this.layout.layoutConfigSubject
      .asObservable()
      .subscribe(() => {
        this.pluginsReInitialization();
      });
    this.unsubscribe.push(layoutUpdateSubscription);
  }

  pluginsInitialization() {
    setTimeout(() => {
      ToggleComponent.bootstrap();
      ScrollTopComponent.bootstrap();
      DrawerComponent.bootstrap();
      StickyComponent.bootstrap();
      MenuComponent.bootstrap();
      ScrollComponent.bootstrap();
      this.hideSplashScreen();
    }, 200);
  }

  pluginsReInitialization() {
    setTimeout(() => {
      ToggleComponent.reinitialization();
      ScrollTopComponent.reinitialization();
      DrawerComponent.reinitialization();
      StickyComponent.bootstrap();
      MenuComponent.reinitialization();
      ScrollComponent.reinitialization();
      this.hideSplashScreen();
    }, 100);
  }

  private hideSplashScreen(): void {
    this.splashScreenService.hide();

    const splashScreen = document.getElementById('splash-screen');
    if (!splashScreen) {
      return;
    }

    splashScreen.classList.add('hidden');
    splashScreen.setAttribute('aria-hidden', 'true');

    setTimeout(() => {
      splashScreen.remove();
    }, 900);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
