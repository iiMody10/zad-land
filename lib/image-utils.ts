import rawImageMap from "./image-map.json";

const imageMap: Record<string, string> = rawImageMap as Record<string, string>;

export const IMAGE_PLACEHOLDER_SRC = "/placeholder.svg";

export const isValidImageSrc = (url: string | null | undefined): boolean => {
    if (!url || typeof url !== 'string') return false;
    const trimmed = url.trim();
    if (!trimmed) return false;
    
    // Valid relative path
    if (trimmed.startsWith('/')) return true;
    
    // Valid data URI
    if (trimmed.startsWith('data:image/')) return true;

    // Must start with http:// or https://
    if (/^https?:\/\//i.test(trimmed)) {
        try {
            new URL(trimmed);
            return true;
        } catch {
            return false;
        }
    }

    return false;
};

const isRemoteImageUrl = (url: string) => /^https?:\/\//i.test(url);

export const getProxyImageUrl = (url: string) => `/image-proxy?url=${encodeURIComponent(url)}`;

const appendRetryParam = (url: string, attempt: number) =>
    `${url}${url.includes("?") ? "&" : "?"}retry=${attempt}`;

const cleanUrl = (url: string): string => {
    let cleaned = url.trim();
    if (cleaned.includes('/image-proxy?url=') || cleaned.includes('/api/image-proxy?url=')) {
        try {
            const urlParam = cleaned.split('url=')[1].split('&')[0];
            cleaned = decodeURIComponent(urlParam);
        } catch (e) {
            // ignore
        }
    }
    return cleaned;
};

/**
 * Resolves a remote image URL to its local pre-optimized WebP asset on the server/CDN.
 * This guarantees images load in Syria and other regions where remote hosts (e.g. postimg.cc) are blocked.
 */
export const resolveLocalImage = (url: string | null | undefined): string | null => {
    if (!url || typeof url !== 'string') return null;
    const trimmed = cleanUrl(url);
    if (!trimmed) return null;

    if (trimmed.startsWith('/') || trimmed.startsWith('data:')) {
        return trimmed;
    }

    if (imageMap[trimmed]) {
        return imageMap[trimmed];
    }

    try {
        const decoded = decodeURI(trimmed);
        if (imageMap[decoded]) return imageMap[decoded];
        const encoded = encodeURI(trimmed);
        if (imageMap[encoded]) return imageMap[encoded];
    } catch {
        // ignore
    }

    return null;
};

/**
 * Returns a safe image URL. Prioritizes local pre-optimized WebP assets,
 * falling back to /api/image-proxy for unmapped remote images.
 */
export const getSafeImageUrl = (url: string | null | undefined): string => {
    if (!url || !isValidImageSrc(url)) return IMAGE_PLACEHOLDER_SRC;

    const trimmedUrl = cleanUrl(url);

    // Local paths and data URIs are already on the domain
    if (trimmedUrl.startsWith('/') || trimmedUrl.startsWith('data:')) {
        return trimmedUrl;
    }

    // Check pre-optimized local asset map
    const localMatch = resolveLocalImage(trimmedUrl);
    if (localMatch) {
        return localMatch;
    }

    // Remote images: route through /api/image-proxy to guarantee delivery across all regions
    if (isRemoteImageUrl(trimmedUrl)) {
        return getProxyImageUrl(trimmedUrl);
    }

    return trimmedUrl || IMAGE_PLACEHOLDER_SRC;
};

export const parseImageList = (images: string | null | undefined): string[] => {
    if (!images) {
        return [];
    }

    return images
        .split(",")
        .map((img) => img.trim())
        .filter(isValidImageSrc);
};

export const getPrimaryImage = (images: string | null | undefined): string => {
    const first = parseImageList(images)[0];
    if (!first) return IMAGE_PLACEHOLDER_SRC;
    return getSafeImageUrl(first);
};

/**
 * Generates an ordered list of fallback candidates:
 * 1. Local pre-optimized WebP asset (zero-latency, instant load, works 100% in Syria)
 * 2. Proxied URL via Zad Land's server
 * 3. Fallback placeholder SVG
 */
export const getImageSourceCandidates = (
    url: string | null | undefined,
    fallbackSrc: string = IMAGE_PLACEHOLDER_SRC
): string[] => {
    if (!url || !isValidImageSrc(url)) {
        return [fallbackSrc];
    }

    const trimmedUrl = cleanUrl(url);

    if (!trimmedUrl || !isValidImageSrc(trimmedUrl)) {
        return [fallbackSrc];
    }

    // If already local or data URI, direct load is optimal
    if (trimmedUrl.startsWith('/') || trimmedUrl.startsWith('data:')) {
        return [trimmedUrl, fallbackSrc];
    }

    // Check if we have a pre-optimized local asset
    const localMatch = resolveLocalImage(trimmedUrl);
    if (localMatch) {
        return [localMatch, getProxyImageUrl(trimmedUrl), fallbackSrc];
    }

    const proxied = getProxyImageUrl(trimmedUrl);
    const candidates = [
        proxied,
        trimmedUrl,
        appendRetryParam(trimmedUrl, 1),
        fallbackSrc,
    ];

    return [...new Set(candidates.filter(isValidImageSrc))];
};
