export enum SiteCategory {
    SOCIAL = 'Social',
    DEV = 'Developer',
    GAMING = 'Gaming',
    VIDEO = 'Video',
    ADULT = 'Adult',
    BLOG = 'Blogging',
    REGIONAL_CN = 'China',
    OTHER = 'Other'
}

export interface Site {
    name: string;
    url: string; // Use {} as placeholder for username
    checkUrl?: string; // Optional: specific URL for API checking if different from profile
    category: SiteCategory;
    checkType?: 'status' | 'message' | 'redirect';
    errorMsg?: string | string[]; // Strings to look for indicating 404 even if 200 OK
}

export enum ScanStatus {
    IDLE = 'IDLE',
    SCANNING = 'SCANNING',
    COMPLETED = 'COMPLETED'
}

export enum ResultStatus {
    FOUND = 'FOUND', // 200 OK
    NOT_FOUND = 'NOT_FOUND', // 404
    ERROR = 'ERROR', // Network error / timeout
    BLOCKED = 'BLOCKED', // 403/429
    UNKNOWN = 'UNKNOWN' // CORS issue mostly
}

export interface ScanResult {
    site: Site;
    status: ResultStatus;
    profileUrl: string;
    latency: number;
}