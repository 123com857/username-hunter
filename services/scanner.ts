import { Site, ScanResult, ResultStatus } from '../types';

// Proxy is essential for browser-based OSINT due to CORS. 
// Using a reliable public CORS proxy for demo purposes.
const CORS_PROXY = "https://api.allorigins.win/raw?url=";

export const checkSite = async (site: Site, username: string, useProxy: boolean = true): Promise<ScanResult> => {
    const targetUrl = site.url.replace('{}', username);
    // If site has a specific API check URL (like Reddit/Github), use that, otherwise use profile URL
    const checkUrl = site.checkUrl ? site.checkUrl.replace('{}', username) : targetUrl;
    
    const finalUrl = useProxy ? `${CORS_PROXY}${encodeURIComponent(checkUrl)}` : checkUrl;

    const start = performance.now();

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

        const response = await fetch(finalUrl, {
            method: 'GET',
            signal: controller.signal,
            // header tweaks to try and pass as a real browser
            headers: useProxy ? undefined : {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        clearTimeout(timeoutId);
        const latency = Math.round(performance.now() - start);

        // Logic for determining existence
        let status: ResultStatus = ResultStatus.UNKNOWN;

        if (response.status === 200) {
            // Deep content check if defined
            if (site.errorMsg) {
                const text = await response.text();
                const errorStrings = Array.isArray(site.errorMsg) ? site.errorMsg : [site.errorMsg];
                const hasError = errorStrings.some(err => text.includes(err));
                status = hasError ? ResultStatus.NOT_FOUND : ResultStatus.FOUND;
            } else {
                status = ResultStatus.FOUND;
            }
        } else if (response.status === 404) {
            status = ResultStatus.NOT_FOUND;
        } else if (response.status === 403 || response.status === 429) {
            status = ResultStatus.BLOCKED;
        } else {
            // 5xx or other
            status = ResultStatus.ERROR;
        }

        // Edge case: Redirects often mean found, but fetch follows redirects automatically. 
        // If final URL is significantly different (e.g., login page), it might be a false positive.
        // This simple logic assumes if we got 200, it's good, unless filtered above.

        return {
            site,
            status,
            profileUrl: targetUrl,
            latency
        };

    } catch (error: unknown) {
        return {
            site,
            status: ResultStatus.ERROR,
            profileUrl: targetUrl,
            latency: 0
        };
    }
};

// Concurrency manager
export const scanAllSites = async (
    sites: Site[], 
    username: string, 
    useProxy: boolean,
    onResult: (result: ScanResult) => void
): Promise<void> => {
    const CONCURRENCY_LIMIT = 15;
    const queue = [...sites];
    let active = 0;

    return new Promise((resolve) => {
        const next = () => {
            if (queue.length === 0 && active === 0) {
                resolve();
                return;
            }

            while (active < CONCURRENCY_LIMIT && queue.length > 0) {
                const site = queue.shift();
                if (site) {
                    active++;
                    checkSite(site, username, useProxy).then((result) => {
                        onResult(result);
                        active--;
                        next();
                    });
                }
            }
        };

        next();
    });
};