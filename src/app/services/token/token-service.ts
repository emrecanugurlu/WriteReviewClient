import {Injectable, inject, PLATFORM_ID, REQUEST} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';


@Injectable({ providedIn: 'root' })
export class TokenService {
  private platformId = inject(PLATFORM_ID);
  private req = inject(REQUEST, { optional: true }) as (Request & { headers?: any }) | null;

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const ls = localStorage.getItem('jwt');
        if (ls) return ls;
      } catch {}
      return readCookie(document.cookie, 'jwt');
    }
    const cookieHeader = this.req?.headers?.cookie ?? '';
    return readCookie(cookieHeader, 'jwt');
  }
}

function readCookie(cookieHeader: string, name: string): string | null {
  if (!cookieHeader) return null;
  const hit = cookieHeader.split(';').map(s => s.trim())
    .find(p => p.toLowerCase().startsWith(name.toLowerCase() + '='));
  return hit ? decodeURIComponent(hit.split('=').slice(1).join('=')) : null;
}
