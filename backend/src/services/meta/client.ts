import { env } from '../../config/env';

const GRAPH_BASE = 'https://graph.facebook.com';
const OAUTH_SCOPES = 'pages_show_list,pages_manage_metadata,pages_read_engagement,leads_retrieval';

export function isMetaConfigured(): boolean {
  return Boolean(
    env.meta.appId &&
      env.meta.appSecret &&
      env.meta.webhookVerifyToken &&
      env.meta.oauthRedirectUri &&
      env.meta.tokenEncryptionKey
  );
}

function graphUrl(path: string, params: Record<string, string>): string {
  const url = new URL(`${GRAPH_BASE}/${env.meta.graphVersion}${path}`);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
  return url.toString();
}

interface GraphErrorBody {
  error?: { message?: string };
}

async function graphFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  const body = (await res.json()) as T & GraphErrorBody;
  if (!res.ok || body?.error) {
    throw new Error(body?.error?.message || `Meta Graph API request failed (${res.status}).`);
  }
  return body;
}

export function buildOAuthUrl(state: string): string {
  const url = new URL(`https://www.facebook.com/${env.meta.graphVersion}/dialog/oauth`);
  url.searchParams.set('client_id', env.meta.appId);
  url.searchParams.set('redirect_uri', env.meta.oauthRedirectUri);
  url.searchParams.set('state', state);
  url.searchParams.set('scope', OAUTH_SCOPES);
  url.searchParams.set('response_type', 'code');
  return url.toString();
}

export async function exchangeCodeForUserToken(code: string): Promise<string> {
  const url = graphUrl('/oauth/access_token', {
    client_id: env.meta.appId,
    client_secret: env.meta.appSecret,
    redirect_uri: env.meta.oauthRedirectUri,
    code,
  });
  const body = await graphFetch<{ access_token: string }>(url);
  return body.access_token;
}

/** Short-lived user tokens expire in ~1-2h; the long-lived one lasts ~60 days. */
export async function exchangeForLongLivedToken(shortLivedToken: string): Promise<string> {
  const url = graphUrl('/oauth/access_token', {
    grant_type: 'fb_exchange_token',
    client_id: env.meta.appId,
    client_secret: env.meta.appSecret,
    fb_exchange_token: shortLivedToken,
  });
  const body = await graphFetch<{ access_token: string }>(url);
  return body.access_token;
}

export interface MetaPage {
  id: string;
  name: string;
  access_token: string;
}

/** Pages the token's owner administers, each with its own (effectively non-expiring) Page access token. */
export async function listPages(userAccessToken: string): Promise<MetaPage[]> {
  const url = graphUrl('/me/accounts', {
    access_token: userAccessToken,
    fields: 'id,name,access_token',
    limit: '200',
  });
  const body = await graphFetch<{ data: MetaPage[] }>(url);
  return body.data || [];
}

export interface MetaLeadForm {
  id: string;
  name: string;
}

export async function listLeadForms(pageId: string, pageAccessToken: string): Promise<MetaLeadForm[]> {
  const url = graphUrl(`/${pageId}/leadgen_forms`, {
    access_token: pageAccessToken,
    fields: 'id,name',
    limit: '200',
  });
  const body = await graphFetch<{ data: MetaLeadForm[] }>(url);
  return body.data || [];
}

/** Subscribes the Page to `leadgen` webhook events. Requires the app's own webhook to already be configured in the Meta dashboard. */
export async function subscribePageToLeadgen(pageId: string, pageAccessToken: string): Promise<void> {
  const url = graphUrl(`/${pageId}/subscribed_apps`, {
    access_token: pageAccessToken,
    subscribed_fields: 'leadgen',
  });
  await graphFetch(url, { method: 'POST' });
}

export interface MetaLeadField {
  name: string;
  values: string[];
}

export interface MetaLeadDetails {
  fieldData: MetaLeadField[];
  formId: string;
  pageId: string;
  createdTime: string;
}

export async function fetchLeadFields(leadgenId: string, pageAccessToken: string): Promise<MetaLeadDetails> {
  const url = graphUrl(`/${leadgenId}`, {
    access_token: pageAccessToken,
    fields: 'field_data,form_id,page_id,created_time',
  });
  const body = await graphFetch<{
    field_data: MetaLeadField[];
    form_id: string;
    page_id: string;
    created_time: string;
  }>(url);
  return {
    fieldData: body.field_data || [],
    formId: body.form_id,
    pageId: body.page_id,
    createdTime: body.created_time,
  };
}
