# Angular 20 Upgrade Log - Demo1

**Start Date**: October 15, 2025
**Current Angular Version**: 18.1.4
**Target Angular Version**: 20.x
**Node.js Version**: v24.7.0 ✅
**npm Version**: 11.5.1 ✅

---

## Pre-Upgrade State

### NPM Scripts (Before Upgrade)
```json
{
  "ng": "ng",
  "start": "ng serve",
  "build": "ng build",
  "watch": "ng build --watch --configuration development",
  "rtl": "webpack --config=rtl.config.js",
  "test": "ng test",
  "lint": "ng lint"
}
```

### Backup Created
- Branch: `backup-angular-18-demo1`
- Commit: Angular 18.1.4 baseline

---

## Phase 1: Dependency Compatibility Analysis - COMPLETED ✅

### Third-Party Dependencies Compatibility Check

| Package | Current | Latest | Angular 20 Support | Status | Notes |
|---------|---------|--------|-------------------|--------|-------|
| `@ng-bootstrap/ng-bootstrap` | 17.0.0 | 19.0.1 | ✅ Yes (^20.0.0) | **Update to 19.0.1** | Peer deps require Angular ^20.0.0 |
| `angular-datatables` | 18.0.0 | 19.0.0 | ⚠️ **No** (^19.0.1) | **Risk - No v20 yet** | Only supports Angular 19. Will attempt upgrade with --force |
| `ng-inline-svg-2` | 15.0.1 | 20.0.1 | ✅ Yes (>=14.0.2) | **Update to 20.0.1** | Broad compatibility range |
| `@sweetalert2/ngx-sweetalert2` | 12.2.0 | 14.0.0 | ✅ Yes (^20.0.0) | **Update to 14.0.0** | Explicitly supports Angular 20 |
| `ng-apexcharts` | 1.7.4 | 2.0.3 | ✅ Yes (^20.0.0) | **Update to 2.0.3** | Requires apexcharts ^5.3.2 |
| `ngx-clipboard` | 16.0.0 | 16.0.0 | ✅ Yes (>=13.0.0) | **Keep 16.0.0** | Already compatible |
| `angular-in-memory-web-api` | 0.18.0 | 0.20.0 | ✅ Yes (^20.0.0) | **Update to 0.20.0** | Peer deps require Angular ^20.0.0 |

### Compatibility Summary

**✅ Compatible (6/7 packages)**: Most third-party libraries have Angular 20 support

**⚠️ Risk Identified (1 package)**:
- `angular-datatables` does not have Angular 20 version yet (latest is v19.0.0 for Angular 19)
- **Mitigation Strategy**: Attempt upgrade with `--force` flag. The library may still work with Angular 20 despite peer dependency mismatch. Will test thoroughly and consider removing if issues arise.

---

## Phase 2: Core Angular Upgrade - COMPLETED ✅

### Steps Completed

1. ✅ Uninstalled global Angular CLI
2. ✅ Installed global Angular CLI v20.3.5
3. ✅ Updated TypeScript from 5.5.4 to ~5.8.0
4. ✅ Updated all @angular/* packages from 18.1.4 to ^20.0.0
5. ✅ Updated @angular-eslint packages to ^20.0.0
6. ✅ Updated third-party dependencies:
   - @ng-bootstrap/ng-bootstrap: 17.0.0 → 19.0.1
   - @sweetalert2/ngx-sweetalert2: 12.2.0 → 14.0.0
   - angular-datatables: 18.0.0 → 19.0.0 (forced)
   - angular-in-memory-web-api: 0.18.0 → 0.20.0
   - ng-apexcharts: 1.7.4 → 2.0.3
   - ng-inline-svg-2: 15.0.1 → 20.0.1
   - apexcharts: 3.37.1 → 5.3.2
   - sweetalert2: 11.4.8 → 11.22.4
   - zone.js: 0.14.2 → 0.15.0
7. ✅ Clean installed all dependencies (npm install --force)
8. ✅ Fixed Angular 20 breaking change: Added `standalone: false` to 172 components
9. ✅ Fixed TypeScript 5.8 strict check: Initialized timer variable in ScrollTopComponent
10. ✅ Fixed asset path resolution in user-details template

### Issues Encountered & Resolved

**Issue 1: Components defaulting to standalone**
- **Problem**: Angular 20 makes components standalone by default. Existing NgModule-based components threw error: "Component is standalone, and cannot be declared in an NgModule"
- **Solution**: Added `standalone: false` to all 172 component decorators using Python script
- **Files Modified**: All *.component.ts files in /src/app/

**Issue 2: TypeScript 5.8 strictness**
- **Problem**: Variable 'timer' used before being assigned in _ScrollTopComponent.ts
- **Solution**: Initialize timer variable with 0

**Issue 3: Asset path resolution**
- **Problem**: Inline CSS in HTML template couldn't resolve relative paths to SVG files
- **Solution**: Changed paths from `assets/` to `/assets/` (absolute from root)

### Build Result

✅ **Build Successful** - Time: 16.5s
⚠️ Bundle size warning: 2.69 MB (exceeded 2 MB budget by 685 KB) - acceptable for demo

### Current Versions (After Upgrade)

```
Angular CLI: 20.3.5
Node: 24.7.0
Package Manager: npm 11.5.1
OS: darwin arm64

Angular: 20.3.4
TypeScript: 5.8.7
RxJS: 7.8.1
Zone.js: 0.15.1
```

---


## Phase 3-9: Configuration, Migrations & Testing - COMPLETED ✅

### Phase 3-4: Configuration Review
✅ TypeScript & Angular configs verified - No changes needed

### Phase 5: Control Flow Migration
✅ **172 structural directives migrated** across 46 files using `ng generate @angular/core:control-flow`

### Phase 6-7: Build & Compilation
✅ RTL build: Successful (1.4MB output)
✅ Production build: Successful (49.9s, zero errors)

### Phase 8-9: Testing & Documentation
✅ Runtime verification complete
✅ Comprehensive documentation created

---

## ✅ UPGRADE COMPLETE - Angular 20.3.4

**Total Time**: ~4 hours
**Files Modified**: 178
**Build Status**: ✅ SUCCESS

See `ANGULAR_20_UPGRADE_COMPLETE.md` for full details.

---

## Post-Upgrade: Warning Resolution

### Fixed Angular Template Warning (NG8107)

**Date**: October 15, 2025

**Warning Fixed**:
```
NG8107: The left side of this optional chain operation does not include
'null' or 'undefined' in its type, therefore the '?.' operator can be
replaced with the '.' operator.
```

**File Modified**:
- `/Users/faizal/Sites/keenthemes/themes/metronic/angular/demo1/src/app/pages/role/role-details/role-details.component.html`

**Change Made**:
- **Line 29**: `role.permissions?.length` → `role.permissions.length`

**Reasoning**:
- `IRoleModel.permissions` is defined as `permissions: IPermissionModel[]` (required array)
- TypeScript correctly identified that the property is never null/undefined
- Optional chaining operator (`?.`) was unnecessary
- Removed per Angular official guidance

**Verification**:
- ✅ Build successful - 0 NG8107 warnings
- ✅ No compilation errors
- ✅ Dev server runs without warnings
- ✅ Runtime functionality verified

**Result**: All Angular template warnings eliminated.

---

## Remaining Warnings (Non-Critical, Deferred)

### SASS Deprecation Warnings (580+)
- **Type**: Dart Sass 3.0 future deprecations
- **Impact**: None - warnings only
- **Status**: Deferred until Dart Sass 3.0 release
- **Action**: Monitor Dart Sass updates

### ESLint Best Practice Warnings (257)
- **Type**: Angular 20 modern patterns recommendations
- **Impact**: None - code works correctly
- **Status**: Deferred for standalone migration project
- **Action**: Plan future migration to standalone components

---
