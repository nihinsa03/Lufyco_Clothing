/**
 * Supported email providers
 */
export const SUPPORTED_EMAIL_PROVIDERS = [
    '@gmail.com',
    '@yahoo.com',
    '@outlook.com',
    '@hotmail.com',
    '@icloud.com',
    '@protonmail.com',
    '@aol.com'
];

/**
 * Validate email format
 * @param email - Email address to validate
 * @returns true if email is valid format
 */
export const isValidEmailFormat = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Check if email is from a supported provider
 * @param email - Email address to check
 * @returns true if email is from supported provider
 */
export const isSupportedEmailProvider = (email: string): boolean => {
    const emailLower = email.toLowerCase();
    return SUPPORTED_EMAIL_PROVIDERS.some(provider =>
        emailLower.endsWith(provider)
    );
};

/**
 * Check if email is a Gmail address
 * @param email - Email address to check
 * @returns true if email ends with @gmail.com
 */
export const isGmailEmail = (email: string): boolean => {
    return email.toLowerCase().endsWith('@gmail.com');
};

/**
 * Comprehensive email validation
 * @param email - Email address to validate
 * @returns Object with validation result and error message
 */
export const validateEmail = (email: string): { valid: boolean; message?: string } => {
    if (!email || email.trim() === '') {
        return { valid: false, message: 'Email is required' };
    }

    if (!isValidEmailFormat(email)) {
        return { valid: false, message: 'Invalid email format' };
    }

    if (!isSupportedEmailProvider(email)) {
        return {
            valid: false,
            message: 'Email must be from a supported provider (Gmail, Yahoo, Outlook, etc.)'
        };
    }

    return { valid: true };
};

/**
 * Get email provider name from email address
 * @param email - Email address
 * @returns Provider name (e.g., "Gmail", "Yahoo") or "Unknown"
 */
export const getEmailProvider = (email: string): string => {
    const emailLower = email.toLowerCase();

    if (emailLower.endsWith('@gmail.com')) return 'Gmail';
    if (emailLower.endsWith('@yahoo.com')) return 'Yahoo';
    if (emailLower.endsWith('@outlook.com') || emailLower.endsWith('@hotmail.com')) return 'Outlook';
    if (emailLower.endsWith('@icloud.com')) return 'iCloud';
    if (emailLower.endsWith('@protonmail.com')) return 'ProtonMail';
    if (emailLower.endsWith('@aol.com')) return 'AOL';

    return 'Unknown';
};
