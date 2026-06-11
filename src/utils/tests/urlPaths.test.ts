import { describe, expect, it } from 'vitest';
import { isPublicPage, UrlPathTemplate } from '../urlPaths';

describe('isPublicPage', () => {
  it.each([
    { label: 'root', path: '/' },
    { label: 'search', path: '/search' },
    { label: 'filter', path: '/filter' },
    { label: 'reports', path: '/reports' },
    { label: 'research profile root', path: '/research-profile' },
    { label: 'a research profile', path: '/research-profile/123' },
    { label: 'projects root', path: '/projects' },
    { label: 'a project page', path: '/projects/123' },
    { label: 'a registration landing page', path: '/registration/123' },
  ])('treats $label as public', ({ path }) => {
    expect(isPublicPage(path)).toBe(true);
  });

  it.each([
    { label: 'new project', path: '/projects/new' },
    { label: 'editing a project', path: '/projects/123/edit' },
    { label: 'new registration', path: '/registration' },
    { label: 'the registration wizard', path: '/registration/123/edit' },
    { label: 'my page', path: '/my-page' },
    { label: 'the tasks dialogue', path: '/tasks/dialogue' },
  ])('treats $label as protected', ({ path }) => {
    expect(isPublicPage(path)).toBe(false);
  });

  it('excludes protected routes that also match a broader public template', () => {
    // /projects/new matches the /projects/:identifier landing pattern, so it must be excluded first.
    expect(isPublicPage(UrlPathTemplate.ProjectsNew)).toBe(false);
    expect(isPublicPage(UrlPathTemplate.ProjectPage.replace(':identifier', '123'))).toBe(true);
    // /registration (new) and /registration/:id/edit must not be classified as the landing page.
    expect(isPublicPage(UrlPathTemplate.RegistrationNew)).toBe(false);
    expect(isPublicPage(UrlPathTemplate.RegistrationWizard.replace(':identifier', '123'))).toBe(false);
    expect(isPublicPage(UrlPathTemplate.RegistrationLandingPage.replace(':identifier', '123'))).toBe(true);
  });

  it('ignores query strings when matching', () => {
    expect(isPublicPage('/search?query=climate&page=2')).toBe(true);
    expect(isPublicPage('/registration/123?shouldNotAutoScroll=true')).toBe(true);
    expect(isPublicPage('/projects/new?foo=bar')).toBe(false);
  });

  it('does not treat unknown paths as public', () => {
    expect(isPublicPage('/some/unknown/path')).toBe(false);
  });
});
