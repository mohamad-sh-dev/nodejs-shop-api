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
- create text index for description of roles

### Changed
- Updated README.md with detailed project information.
- Set Redis Url
- Change guard strategy when rolesDocument not found 
- Change permission title regex in schema
- Change swagger loader location
- Improve setHostUrl function
- Remove console logs

### BugFix
- Fix default user profile image url
- Fix remove old profile image path
- Fix set undefined username 
- Fix set undefined email
- Fix payment total amount problem
- Fix unlink file path resolve
- Fix permissionSchema title bug
- Fix RBAC guard segment bug
- Fix remove user bug (find user for delete)
- Fix course content in swagger response 