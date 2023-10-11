# Change Log

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added

- Initial project setup.
- Basic CRUD operations for products, courses, and blogs.
- Role-Based Access Control (RBAC) implementation.
- Integration with ZarinPal payment gateway.
- API documentation using Swagger.
- Add host server url to swagger severs 

### Changed
- Updated README.md with detailed project information.
- Set Redis Url
- Change guard strategy when rolesDocument not found 
- Change permission title regex in schema

### BugFix
- Fix default user profile image url
- Fix remove old profile image path
- Fix set undefined username 
- Fix set undefined email