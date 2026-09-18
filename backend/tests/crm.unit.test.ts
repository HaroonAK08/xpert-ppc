import { describe, expect, it } from 'vitest';
import {
  checksumRow,
  invertMapping,
  MockSheetsStore,
  suggestColumnMapping,
} from '../src/services/googleSheets/sheetsService';
import { normalizeEmail, normalizePhone, isValidEmail } from '../../shared/crm/normalize';
import { normalizeLeadStatus } from '../../shared/crm/constants';

describe('phone/email normalization', () => {
  it('normalizes Pakistan phone formats', () => {
    expect(normalizePhone('03001234567')).toBe('+923001234567');
    expect(normalizePhone('+923001234567')).toBe('+923001234567');
    expect(normalizePhone('00923001234567')).toBe('+923001234567');
    expect(normalizePhone('3001234567')).toBe('+923001234567');
  });

  it('normalizes emails', () => {
    expect(normalizeEmail('  Ali@Gmail.COM ')).toBe('ali@gmail.com');
    expect(isValidEmail('bad@')).toBe(false);
    expect(isValidEmail('ok@xpertppc.com')).toBe(true);
  });
});

describe('lead status normalization', () => {
  it('maps legacy statuses', () => {
    expect(normalizeLeadStatus('qualified')).toBe('interested');
    expect(normalizeLeadStatus('won')).toBe('converted');
    expect(normalizeLeadStatus('lost')).toBe('not_interested');
    expect(normalizeLeadStatus('spam')).toBe('closed');
    expect(normalizeLeadStatus('follow_up')).toBe('follow_up');
  });
});

describe('google sheets mapping', () => {
  it('suggests column mapping from aliases', () => {
    const mapping = suggestColumnMapping([
      'Client Name',
      'Mobile',
      'Email Address',
      'Company',
      'Lead Message',
      'Reply',
      'Status',
    ]);
    expect(mapping.name).toBe('Client Name');
    expect(mapping.phone).toBe('Mobile');
    expect(mapping.email).toBe('Email Address');
    expect(mapping.business_name).toBe('Company');
    expect(mapping.message).toBe('Lead Message');
    expect(mapping.replied).toBe('Reply');
    expect(mapping.status).toBe('Status');
  });

  it('inverts mapping and checksums rows', () => {
    const inverted = invertMapping({ name: 'Client Name', phone: 'Mobile' });
    expect(inverted['client name']).toBe('name');
    const a = checksumRow({ Name: 'Ali', Phone: '1' });
    const b = checksumRow({ Name: 'Ali', Phone: '1' });
    const c = checksumRow({ Name: 'Ali', Phone: '2' });
    expect(a).toBe(b);
    expect(a).not.toBe(c);
  });

  it('mock sheet store updates rows', () => {
    const store = new MockSheetsStore();
    store.setTable(['Name', 'Phone'], [['Ali', '0300'], ['Sara', '0311']]);
    store.updateRow(2, ['Ali Khan', '03001234567']);
    expect(store.getValues()[1]).toEqual(['Ali Khan', '03001234567']);
  });
});
