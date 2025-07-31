# Cars.na UI Inventory & Audit

## Overview
This document provides a comprehensive inventory of UI components, screens, and design patterns used throughout the Cars.na application. It serves as a reference for developers and designers to maintain consistency across the platform.

## Base Components

### Typography
- **Headings**: H1-H6 with consistent sizing based on Tailwind config
- **Body Text**: Regular, medium, and bold weights
- **Captions**: Small text for supplementary information
- **Links**: Standard, hover, and visited states

### Form Elements
- **Button**: Primary, secondary, outline, ghost, link, and destructive variants
- **Input**: Text, number with validation states
- **Select**: Dropdown with options
- **Textarea**: Multi-line text input
- **Checkbox & Radio**: Selection controls
- **Toggle**: On/off state control

### Layout Components
- **Card**: Container for grouped content with header, content, and footer
- **Modal/Dialog**: For focused user interactions and confirmations
- **Toast/Notification**: For system feedback and alerts
- **Tabs**: For switching between related content sections
- **Accordion**: For expandable/collapsible content

### Navigation
- **Navbar**: Main navigation with logo, links, and user menu
- **Sidebar**: For dashboard navigation
- **Breadcrumbs**: For hierarchical navigation
- **Pagination**: For multi-page content
- **Stepper**: For multi-step processes like the Sell Your Car wizard

### Data Display
- **Table**: For structured data display with sorting and filtering
- **List**: For simpler data presentation
- **Badge**: For status indicators
- **Avatar**: For user representation
- **Progress**: For showing completion or loading state

## Screen Inventory

### Public Pages
1. **Homepage**
   - Hero section with search
   - Featured vehicles
   - Value proposition sections
   - Call-to-action for sellers

2. **Vehicle Listings**
   - Search/filter sidebar
   - Grid/list view toggle
   - Vehicle cards
   - Pagination
   - Sort controls

3. **Vehicle Detail**
   - Image gallery
   - Vehicle specifications
   - Pricing information
   - Seller information
   - Similar vehicles
   - Call-to-action buttons

4. **Sell Your Car Wizard**
   - Multi-step form with progress indicator
   - Vehicle information inputs
   - Photo upload
   - Pricing guidance
   - Contact information

5. **Authentication**
   - Login form
   - Registration form
   - Password reset
   - Social login options

### Dealer Dashboard
1. **Overview**
   - Key metrics
   - Recent activity
   - Quick actions
   - Notifications

2. **Inventory Management**
   - Vehicle list with filters
   - Bulk actions
   - Add/edit vehicle forms
   - Status indicators

3. **Lead Management**
   - Inquiry list
   - Lead details
   - Communication history
   - Status tracking

4. **Analytics**
   - Performance charts
   - Traffic sources
   - Conversion metrics
   - Inventory health

### Admin Dashboard
1. **User Management**
   - User list with filters
   - User details/edit
   - Permission controls
   - Activity logs

2. **Dealership Management**
   - Dealership list
   - Approval workflow
   - Performance metrics
   - Configuration options

3. **Platform Settings**
   - General settings
   - Feature toggles
   - Integration settings
   - Maintenance controls

## Design Inconsistencies & Recommendations

### Identified Issues
- No consistent spacing system applied across components
- Inconsistent border radius usage
- Color usage needs standardization for status indicators
- Form validation feedback varies across forms
- Mobile responsiveness needs improvement in dashboard views

### Recommendations
1. **Implement Design Token System**
   - Standardize spacing based on 8px grid
   - Consistent border radius scale
   - Formalize color usage for different states
   - Typography scale with clear hierarchy

2. **Component Standardization**
   - Create reusable form layouts with consistent validation
   - Standardize card layouts across the application
   - Unify button styles and hierarchy
   - Create consistent mobile-first responsive patterns

3. **Accessibility Improvements**
   - Ensure sufficient color contrast
   - Implement proper focus management
   - Add appropriate ARIA attributes
   - Support keyboard navigation
   - Provide text alternatives for non-text content

## Next Steps
1. Implement base component library with proper documentation
2. Create page templates using standardized components
3. Develop responsive design guidelines
4. Establish component testing procedures
5. Create design system documentation with usage examples
