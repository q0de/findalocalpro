type PlausibleProperty = string | number | boolean;
type PlausibleProperties = Record<string, PlausibleProperty | null | undefined>;

type PlausibleOptions = {
  props?: Record<string, PlausibleProperty>;
  callback?: () => void;
};

type PlausibleFunction = {
  (eventName: string, options?: PlausibleOptions): void;
  q?: Array<[string, PlausibleOptions?]>;
};

declare global {
  interface Window {
    plausible?: PlausibleFunction;
  }
}

function cleanProperties(properties: PlausibleProperties = {}) {
  return Object.fromEntries(
    Object.entries(properties).filter((entry): entry is [string, PlausibleProperty] => {
      const value = entry[1];
      return value !== undefined && value !== null && value !== '';
    }),
  );
}

function getPlausible() {
  if (typeof window === 'undefined') return null;
  if (typeof window.plausible === 'function') return window.plausible;

  const queuedPlausible = ((eventName: string, options?: PlausibleOptions) => {
    queuedPlausible.q = queuedPlausible.q || [];
    queuedPlausible.q.push([eventName, options]);
  }) as PlausibleFunction;
  queuedPlausible.q = [];
  window.plausible = queuedPlausible;
  return queuedPlausible;
}

export function trackPlausible(eventName: string, properties: PlausibleProperties = {}) {
  const plausible = getPlausible();
  if (!plausible) return;
  plausible(eventName, { props: cleanProperties(properties) });
}

export function trackPlausibleBeforeNavigation(
  eventName: string,
  properties: PlausibleProperties = {},
  timeoutMs = 500,
) {
  return new Promise<void>((resolve) => {
    const plausible = getPlausible();
    if (!plausible) {
      resolve();
      return;
    }

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      window.clearTimeout(timeout);
      resolve();
    };
    const timeout = window.setTimeout(finish, timeoutMs);
    plausible(eventName, {
      props: cleanProperties(properties),
      callback: finish,
    });
  });
}

export function getPartnerCampaignProperties(): PlausibleProperties {
  if (typeof window === 'undefined') return {};

  const params = new URLSearchParams(window.location.search);
  const content = params.get('utm_content');

  return {
    source: params.get('utm_source'),
    medium: params.get('utm_medium'),
    campaign: params.get('utm_campaign'),
    email_sequence: content,
    email_variant: content,
  };
}
