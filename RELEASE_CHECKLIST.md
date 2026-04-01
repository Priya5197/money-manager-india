# Release Checklist for Money Manager India

Use this checklist when preparing a new release of Money Manager India.

## Pre-Release (1-2 weeks before)

- [ ] Review all merged PRs since last release
- [ ] Update CHANGELOG.md with all changes
- [ ] Review and update README.md if needed
- [ ] Verify all dependencies are up to date: `npm update`
- [ ] Check for security vulnerabilities: `npm audit`
- [ ] Plan database migrations if any schema changes
- [ ] Create a release branch: `git checkout -b release/v1.x.x`

## Testing & QA (1 week before)

- [ ] Run full test suite: `npm run test`
- [ ] Achieve target code coverage (minimum 80%)
- [ ] Run linter: `npm run lint`
- [ ] Run type-check: `npm run type-check`
- [ ] Run production build: `npm run build`
- [ ] Manual testing of all critical features:
  - [ ] Authentication (signup, login, logout)
  - [ ] Budget creation and management
  - [ ] Expense tracking and filtering
  - [ ] EMI calculator
  - [ ] Tax calculator
  - [ ] Reports and exports (PDF, CSV)
  - [ ] Settings and profile management
- [ ] Test on multiple browsers:
  - [ ] Chrome/Chromium
  - [ ] Firefox
  - [ ] Safari
  - [ ] Edge
- [ ] Test responsive design (mobile, tablet, desktop)
- [ ] Test on slow network conditions (use DevTools throttling)
- [ ] Verify email notifications work correctly
- [ ] Test data export and import
- [ ] Performance testing:
  - [ ] PageSpeed Insights score acceptable
  - [ ] Core Web Vitals within targets
  - [ ] No memory leaks detected

## Documentation (3-5 days before)

- [ ] Update docs/ARCHITECTURE.md if there are structural changes
- [ ] Update docs/API.md with any endpoint changes
- [ ] Review and update all code comments
- [ ] Verify all links in documentation are working
- [ ] Update CONTRIBUTING.md if contribution process changed
- [ ] Create release notes with highlights
- [ ] Update version number in:
  - [ ] package.json
  - [ ] package-lock.json
  - [ ] Any version files

## Environment & Deployment (2-3 days before)

- [ ] Verify production environment variables are configured
- [ ] Ensure database backups are in place
- [ ] Review Supabase:
  - [ ] Backup database: `pg_dump`
  - [ ] Verify RLS policies are correct
  - [ ] Check for any pending migrations
  - [ ] Test auth flow in production
- [ ] Verify Vercel deployment:
  - [ ] Check deployment preview works
  - [ ] Verify all secrets are set
  - [ ] Confirm build settings are correct
  - [ ] Test preview environment thoroughly
- [ ] Create database migration scripts (if needed)
- [ ] Document any manual deployment steps

## Final Release Day

### Code & Build
- [ ] Merge release branch to main via pull request
- [ ] Ensure all CI/CD checks pass
- [ ] Tag the release: `git tag -a v1.x.x -m "Release version 1.x.x"`
- [ ] Push tag: `git push origin v1.x.x`
- [ ] Final production build verification

### Deployment
- [ ] Deploy to production staging environment
- [ ] Smoke test staging deployment:
  - [ ] Can users log in
  - [ ] Can create budgets
  - [ ] Can track expenses
  - [ ] Can export data
  - [ ] No console errors
- [ ] Deploy to production
- [ ] Verify production deployment:
  - [ ] Website loads correctly
  - [ ] All pages are accessible
  - [ ] No 404 or 500 errors
  - [ ] Database connections working
  - [ ] Authentication working

### Database (if migrations)
- [ ] Verify migrations applied successfully
- [ ] Check data integrity
- [ ] Monitor for any migration errors
- [ ] Run rollback test (from backup)

### Monitoring
- [ ] Monitor error tracking (e.g., Sentry)
- [ ] Monitor server logs for errors
- [ ] Check performance metrics:
  - [ ] Server response times normal
  - [ ] Database query performance acceptable
  - [ ] No memory leaks
- [ ] Monitor user sessions and activity

## Post-Release (After deployment)

### Communication
- [ ] Post release announcement on GitHub Releases
- [ ] Update GitHub project board
- [ ] Update website/blog if applicable
- [ ] Notify users via email (if applicable)
- [ ] Post on social media/community channels
- [ ] Thank contributors in release notes

### Monitoring (48-72 hours)
- [ ] Monitor for critical issues and bugs
- [ ] Be ready for emergency hotfix if needed
- [ ] Check user feedback and support channels
- [ ] Monitor error rates and performance metrics
- [ ] Verify all analytics data is being collected

### Cleanup
- [ ] Delete release branch: `git branch -d release/v1.x.x`
- [ ] Archive old documentation if needed
- [ ] Update version indicators in code comments
- [ ] Create next development version tag (if using)
- [ ] Update project roadmap
- [ ] Plan next release cycle

## Emergency Rollback Plan

If critical issues occur post-release:

1. **Identify Issue**: Determine severity and impact
2. **Notify Team**: Alert relevant team members immediately
3. **Decision**: Decide between hotfix or rollback
4. **Rollback Steps** (if needed):
   - [ ] Notify users of issue and ETA for fix
   - [ ] Trigger rollback via Vercel dashboard
   - [ ] Verify rollback successful
   - [ ] Revert database migrations if needed
   - [ ] Verify system is stable
   - [ ] Post-mortem analysis

## Hotfix Process (if needed)

If a hotfix is needed:

1. Create hotfix branch: `git checkout -b hotfix/v1.x.1`
2. Fix the issue
3. Update version to v1.x.1
4. Update CHANGELOG.md
5. Run full test suite
6. Create pull request with label "hotfix"
7. Fast-track review and merge
8. Deploy to production
9. Tag and release: `git tag -a v1.x.1 -m "Hotfix release v1.x.1"`
10. Notify users of the fix

## Version Numbering

Follow Semantic Versioning: MAJOR.MINOR.PATCH

- **MAJOR**: Breaking changes or major features
- **MINOR**: New features, backward compatible
- **PATCH**: Bug fixes, hotfixes

Example: v1.2.3

## Sign-Off

Release completed by: _________________ Date: _________

Approved by: _________________ Date: _________

All checklist items completed: [ ] Yes [ ] No

Notes:
___________________________________________________________________________
___________________________________________________________________________
___________________________________________________________________________
