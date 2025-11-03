import {Injectable} from '@angular/core';

export interface CookieSetOptions {
  path?: string; // varsayılan: '/'
  domain?: string; // örn: .example.com
  secure?: boolean; // HTTPS'de true
  sameSite?: 'Lax' | 'Strict' | 'None';
  expires?: Date | string | number; // Date | RFC1123 string | saniye cinsinden offset
  maxAge?: number; // saniye cinsinden
}

@Injectable({
    providedIn: 'root'
  })
export class CookieService {
  /** Tüm cookie'leri key→value sözlüğü olarak döndürür */
  getAll(): Record<string, string> {
    const header = typeof document !== 'undefined' ? document.cookie ?? '' : '';
    return this.parseCookieHeader(header);
  }


  /** Adı verilen cookie değerini döndürür */
  get(name: string): string | null {
    const all = this.getAll();
    return Object.prototype.hasOwnProperty.call(all, name) ? all[name] : null;
  }


  /** Cookie var mı? */
  has(name: string): boolean { return this.get(name) !== null; }


  /** Cookie yazar (HttpOnly verilemez; onu sadece backend Set-Cookie ile yazar) */
  set(name: string, value: string, opts: CookieSetOptions = {}): void {
    const serialized = this.serializeCookie(name, value, opts);
    if (typeof document !== 'undefined') {
      document.cookie = serialized;
    }
  }


  /** Cookie siler */
  delete(name: string, opts: Pick<CookieSetOptions, 'path'|'domain'|'sameSite'|'secure'> = {}): void {
    this.set(name, '', { ...opts, maxAge: 0 });
  }


// --- Yardımcılar ---


  private parseCookieHeader(header: string): Record<string, string> {
    const out: Record<string, string> = {};
    if (!header) return out;
    for (const part of header.split(';')) {
      const [rawK, ...rest] = part.split('=');
      const k = rawK?.trim();
      if (!k) continue;
      const v = rest.join('=');
      if (!v) continue;
      out[k] = decodeURIComponent(v.trim());
    }
    return out;
  }


  private serializeCookie(name: string, value: string, opts: CookieSetOptions = {}): string {
// Basit validasyon
    if (!name || /[\s;\n\r]/.test(name)) {
      throw new Error('Geçersiz cookie adı');
    }


    const enc = encodeURIComponent(String(value));
    const parts: string[] = [`${name}=${enc}`];


    if (opts.maxAge != null) {
      const max = Math.floor(opts.maxAge);
      if (!Number.isFinite(max)) throw new Error('maxAge sayı olmalı');
      parts.push(`Max-Age=${max}`);
    }


    if (opts.expires != null) {
      const exp = opts.expires instanceof Date
        ? opts.expires
        : typeof opts.expires === 'number' ? new Date(Date.now() + opts.expires * 1000)
          : new Date(opts.expires);
      parts.push(`Expires=${exp.toUTCString()}`);
    }


    if (opts.domain) parts.push(`Domain=${opts.domain}`);
    parts.push(`Path=${opts.path ?? '/'}`);


    if (opts.sameSite) {
      parts.push(`SameSite=${opts.sameSite}`);
    }


    if (opts.secure) parts.push('Secure');


    return parts.join('; ');
  }
}


