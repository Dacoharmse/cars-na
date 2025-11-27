# Notification Components

## NotificationDialog

A reusable dialog component for displaying important notifications, confirmations, and messages to users.

### Features

- **Multiple variants**: success, error, warning, info
- **Customizable actions**: Primary and secondary action buttons
- **Icon-based design**: Visual indicators for different notification types
- **Accessible**: Built on Radix UI Dialog primitives
- **Responsive**: Works on all screen sizes

### Usage

```tsx
import { NotificationDialog } from '@/components/notifications/NotificationDialog';
import { useState } from 'react';

function MyComponent() {
  const [notification, setNotification] = useState({
    isOpen: false,
    variant: 'success',
    title: '',
    message: '',
  });

  const showSuccess = () => {
    setNotification({
      isOpen: true,
      variant: 'success',
      title: 'Success!',
      message: 'Your action was completed successfully.',
    });
  };

  return (
    <>
      <button onClick={showSuccess}>Show Notification</button>

      <NotificationDialog
        isOpen={notification.isOpen}
        onClose={() => setNotification(prev => ({ ...prev, isOpen: false }))}
        variant={notification.variant}
        title={notification.title}
        message={notification.message}
      />
    </>
  );
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | required | Controls dialog visibility |
| `onClose` | `() => void` | required | Callback when dialog is closed |
| `variant` | `'success' \| 'error' \| 'warning' \| 'info'` | `'info'` | Visual style of the notification |
| `title` | `string` | required | Main heading text |
| `message` | `string` | required | Detailed message text |
| `primaryAction` | `{ label: string, onClick: () => void }` | optional | Primary action button |
| `secondaryAction` | `{ label: string, onClick: () => void }` | optional | Secondary action button |

### Variants

#### Success
Used for successful operations, confirmations, and positive feedback.

```tsx
<NotificationDialog
  isOpen={true}
  onClose={handleClose}
  variant="success"
  title="Registration Successful!"
  message="Your application is pending admin approval."
/>
```

#### Error
Used for errors, failed operations, and critical issues.

```tsx
<NotificationDialog
  isOpen={true}
  onClose={handleClose}
  variant="error"
  title="Registration Failed"
  message="Please check your information and try again."
/>
```

#### Warning
Used for warnings, cautions, and important notices.

```tsx
<NotificationDialog
  isOpen={true}
  onClose={handleClose}
  variant="warning"
  title="Pending Action Required"
  message="Your subscription will expire in 3 days."
/>
```

#### Info
Used for general information and announcements.

```tsx
<NotificationDialog
  isOpen={true}
  onClose={handleClose}
  variant="info"
  title="New Feature Available"
  message="Check out our new vehicle comparison tool!"
/>
```

### With Custom Actions

```tsx
<NotificationDialog
  isOpen={true}
  onClose={handleClose}
  variant="success"
  title="Payment Successful"
  message="Your subscription has been activated."
  primaryAction={{
    label: 'View Dashboard',
    onClick: () => router.push('/dealer/dashboard')
  }}
  secondaryAction={{
    label: 'Download Receipt',
    onClick: handleDownloadReceipt
  }}
/>
```

### Examples

#### Form Submission Success
```tsx
const handleSubmit = async () => {
  try {
    await submitForm();
    setNotification({
      isOpen: true,
      variant: 'success',
      title: 'Form Submitted',
      message: 'Your information has been saved successfully.',
    });
  } catch (error) {
    setNotification({
      isOpen: true,
      variant: 'error',
      title: 'Submission Failed',
      message: error.message,
    });
  }
};
```

#### Confirmation Dialog
```tsx
const handleDelete = () => {
  setNotification({
    isOpen: true,
    variant: 'warning',
    title: 'Confirm Deletion',
    message: 'Are you sure you want to delete this item?',
  });
};
```

### Integration with Existing Pages

The NotificationDialog has been integrated into:
- **Dealer Registration** (`src/app/dealers/register/page.tsx`) - Shows success/error messages after registration

### Styling

The component uses Tailwind CSS and follows the design system defined in:
- `tailwind.config.ts` - Color tokens and theme configuration
- `src/app/globals.css` - Global styles and CSS variables

### Accessibility

- Keyboard navigation support (ESC to close)
- Focus management
- ARIA labels and roles
- Screen reader friendly

### Related Components

- `Dialog` - Base dialog component from Radix UI
- `Button` - Button component for actions
- `Alert` - For inline alerts and messages
- `Toast` - For temporary notifications
