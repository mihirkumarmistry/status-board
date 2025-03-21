// Angular import
import { CommonModule, Location, LocationStrategy } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RouterModule } from '@angular/router';

// project import
import { NavigationItem, NavigationItems } from '../navigation';
import { NavGroupComponent } from './nav-group/nav-group.component';

// icon
import { IconService } from '@ant-design/icons-angular';
import {
  AntDesignOutline,
  BgColorsOutline,
  CalendarOutline,
  ChromeOutline,
  CreditCardOutline,
  DashboardOutline,
  DollarOutline,
  FontSizeOutline,
  LoginOutline,
  PlusCircleOutline,
  PlusOutline,
  ProfileOutline,
  QuestionOutline,
} from '@ant-design/icons-angular/icons';
import { environment } from '../../../../../environments/environment.prod';
import { SystemUserType } from '../../../../core/enums/system-user-type.enum';
import { AuthService } from '@core/services/auth.service';
import { SharedModule } from '../../../../shared/shared.module';

@Component({
  selector: 'app-nav-content',
  standalone: true,
  imports: [SharedModule, CommonModule, RouterModule, NavGroupComponent],
  templateUrl: './nav-content.component.html',
  styleUrls: ['./nav-content.component.scss']
})
export class NavContentComponent implements OnInit, AfterViewInit {
  // public props
  @Output() NavCollapsedMob: EventEmitter<string> = new EventEmitter();

  navigations: NavigationItem[];

  // version
  title = 'Demo application for version numbering';
  currentApplicationVersion = environment.appVersion;

  navigation = NavigationItems;
  windowWidth = window.innerWidth;

  // Constructor
  constructor(
    private location: Location,
    private locationStrategy: LocationStrategy,
    private iconService: IconService,
    private authService: AuthService
  ) {
    this.iconService.addIcon(
      ...[
        DashboardOutline,
        CreditCardOutline,
        FontSizeOutline,
        LoginOutline,
        ProfileOutline,
        BgColorsOutline,
        AntDesignOutline,
        ChromeOutline,
        QuestionOutline,
        DollarOutline,
        CalendarOutline,
        PlusCircleOutline,
        PlusOutline,
      ]
    );
    this.navigations = NavigationItems;
    this.authService._loginSubject.subscribe((resp) => {
      if(resp) {
        this.processNavs();
        console.log('processNav');
      }
    });
  }

  // Life cycle events
  ngOnInit() {
    this.processNavs();
  }

  ngAfterViewInit() {
    if (this.windowWidth < 1025) {
      (document.querySelector('.coded-navbar') as HTMLDivElement).classList.add('menupos-static');
    }
  }

  fireOutClick() {
    let current_url = this.location.path();
    const baseHref = this.locationStrategy.getBaseHref();
    if (baseHref) {
      current_url = baseHref + this.location.path();
    }
    const link = "a.nav-link[ href='" + current_url + "' ]";
    const ele = document.querySelector(link);
    if (ele !== null && ele !== undefined) {
      const parent = ele.parentElement;
      const up_parent = parent?.parentElement?.parentElement;
      const last_parent = up_parent?.parentElement;
      if (parent?.classList.contains('coded-hasmenu')) {
        parent.classList.add('coded-trigger');
        parent.classList.add('active');
      } else if (up_parent?.classList.contains('coded-hasmenu')) {
        up_parent.classList.add('coded-trigger');
        up_parent.classList.add('active');
      } else if (last_parent?.classList.contains('coded-hasmenu')) {
        last_parent.classList.add('coded-trigger');
        last_parent.classList.add('active');
      }
    }
  }

  navMob() {
    if (this.windowWidth < 1025 && document.querySelector('app-navigation.coded-navbar').classList.contains('mob-open')) {
      this.NavCollapsedMob.emit();
    }
  }

  processNavs(): void {
    const userType = this.authService.getUserType();
    this.navigations.forEach(d => {
      if (d.isAdminOnly) {
        d.hidden = (userType != SystemUserType.Admin);
      }

      d.children.forEach(c => {
        if (c.isAdminOnly) {
          c.hidden = (userType != SystemUserType.Admin);
        }
      })
    })
  }
}
