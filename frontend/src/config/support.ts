/**
 * Support contact details.
 *
 * Kept in one place so they can be updated without touching components.
 * Use a shared team address, never a personal one — support requests
 * outlive individuals.
 */
export const SUPPORT = {
  email: 'support@aetherdesign.example',
  phone: '+91 80 4718 2200',
  hours: 'Monday to Friday, 9am to 6pm IST',
  responseTime: 'within one business day',
} as const;