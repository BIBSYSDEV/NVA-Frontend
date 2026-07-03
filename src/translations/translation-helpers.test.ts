import { describe, expect, it } from 'vitest';
import { normalizeToIso6391, normalizeToIso6393 } from './translation-helpers';

describe('normalizeToIso6393', () => {
  it('maps ISO 639-1 Bokmål codes to nob', () => {
    expect(normalizeToIso6393('nb')).toBe('nob');
    expect(normalizeToIso6393('nb-NO')).toBe('nob');
    expect(normalizeToIso6393('no')).toBe('nob');
    expect(normalizeToIso6393('nor')).toBe('nob');
  });

  it('maps ISO 639-1 Nynorsk codes to nno', () => {
    expect(normalizeToIso6393('nn')).toBe('nno');
    expect(normalizeToIso6393('nn-NO')).toBe('nno');
  });

  it('maps ISO 639-1 English codes to eng', () => {
    expect(normalizeToIso6393('en')).toBe('eng');
    expect(normalizeToIso6393('en-US')).toBe('eng');
  });

  it('maps ISO 639-3 codes to themselves', () => {
    expect(normalizeToIso6393('nob')).toBe('nob');
    expect(normalizeToIso6393('nno')).toBe('nno');
    expect(normalizeToIso6393('eng')).toBe('eng');
  });

  it('defaults to nob when no language code is provided', () => {
    expect(normalizeToIso6393(undefined)).toBe('nob');
    expect(normalizeToIso6393(null)).toBe('nob');
    expect(normalizeToIso6393('')).toBe('nob');
    expect(normalizeToIso6393('undefined')).toBe('nob');
    expect(normalizeToIso6393('null')).toBe('nob');
  });

  it('defaults to eng for unrecognised language codes', () => {
    expect(normalizeToIso6393('fr')).toBe('eng');
    expect(normalizeToIso6393('de-DE')).toBe('eng');
  });
});

describe('normalizeToIso6391', () => {
  it('maps Bokmål codes to nb', () => {
    expect(normalizeToIso6391('nb')).toBe('nb');
    expect(normalizeToIso6391('nb-NO')).toBe('nb');
    expect(normalizeToIso6391('nob')).toBe('nb');
    expect(normalizeToIso6391('no')).toBe('nb');
  });

  it('maps Nynorsk codes to nn', () => {
    expect(normalizeToIso6391('nn')).toBe('nn');
    expect(normalizeToIso6391('nn-NO')).toBe('nn');
    expect(normalizeToIso6391('nno')).toBe('nn');
  });

  it('maps English codes to en', () => {
    expect(normalizeToIso6391('en')).toBe('en');
    expect(normalizeToIso6391('en-US')).toBe('en');
    expect(normalizeToIso6391('eng')).toBe('en');
  });

  it('defaults to nb when no language code is provided', () => {
    expect(normalizeToIso6391(undefined)).toBe('nb');
    expect(normalizeToIso6391(null)).toBe('nb');
    expect(normalizeToIso6391('')).toBe('nb');
    expect(normalizeToIso6391('undefined')).toBe('nb');
    expect(normalizeToIso6391('null')).toBe('nb');
  });

  it('defaults to en for unrecognised language codes', () => {
    expect(normalizeToIso6391('fr')).toBe('en');
    expect(normalizeToIso6391('de-DE')).toBe('en');
  });
});
