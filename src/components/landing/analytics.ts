import { track } from '@vercel/analytics';

export type LandingEvent =
  | 'landing_cta_click'
  | 'landing_section_view'
  | 'landing_faq_open'
  | 'landing_showcase_swipe'
  | 'landing_menu_open';

export function trackLanding(event: LandingEvent, props?: Record<string, string | number>) {
  track(event, props);
}
