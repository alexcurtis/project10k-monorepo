const LOGO_DEV_PUBLIC_KEY = "pk_ewo2-MGORAq6UKF9zp-ffA";

export function GenerateCompanyLogoSrcUrl(ticker: string) {
    return `https://img.logo.dev/ticker/${ticker}?token=${LOGO_DEV_PUBLIC_KEY}`;
}
