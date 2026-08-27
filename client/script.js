const main = document.querySelector("feed");
const status = document.getElementById("status");

const stream = new EventSource("http://localhost:3000/gift");

const STORAGE_KEY = "tiktok_gifts";
const MAX_GIFTS = 10;
const GIFT_MAX_AGE = 5 * 60 * 1000; // 5 minutes
const DUPLICATE_WINDOW = 5000;

// giftId -> timestamp
const recentGiftIds = new Map();

/**
 * Format a timestamp as a relative time.
 *
 * Examples:
 * 1 second ago
 * 30 seconds ago
 * 1 min ago
 * 4 mins ago
 * 1 hour ago
 */
function formatRelativeTime(timestamp) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);

    if (seconds < 1) {
        return "just now";
    }

    if (seconds === 1) {
        return "1 second ago";
    }

    if (seconds < 60) {
        return `${seconds} seconds ago`;
    }

    const minutes = Math.floor(seconds / 60);

    if (minutes === 1) {
        return "1 min ago";
    }

    if (minutes < 60) {
        return `${minutes} mins ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours === 1) {
        return "1 hour ago";
    }

    return `${hours} hours ago`;
}

/**
 * Create a DOM element for a gift.
 */
function createGift(gift) {
    console.log("Creating gift...");

    const giftElement = document.createElement("div");
    giftElement.className = "gift-list-item";
    giftElement.dataset.giftId = gift.giftId;

    const giftIconContainer = document.createElement("div");
    giftIconContainer.className = "gift-icon-container";

    const giftIcon = document.createElement("img");
    giftIcon.src = gift.giftImageUrl;
    giftIcon.alt = gift.giftName;

    const pointsElement = document.createElement("h4");
    pointsElement.textContent = `+${gift.POINTS} pts`;

    console.log(gift);

    giftIconContainer.append(giftIcon);

    const iconsContainer = document.createElement("div");
    iconsContainer.className = "icons-container";

    iconsContainer.append(giftIconContainer);

    giftElement.append(
        iconsContainer
    );

    return giftElement;
}

/**
 * Remove gifts older than 5 minutes.
 */
function removeExpiredGifts() {
    const cutoff = Date.now() - GIFT_MAX_AGE;

    const originalLength = gifts.length;

    gifts = gifts.filter(gift => {
        return gift.createdAt > cutoff;
    });

    if (gifts.length !== originalLength) {
        saveGifts();
        renderGifts();
    }
}

/**
 * Keep only the newest 10 gifts.
 */
function trimGifts() {
    if (gifts.length > MAX_GIFTS) {
        gifts = gifts.slice(0, MAX_GIFTS);
    }
}

/**
 * Save gifts to localStorage.
 */
function saveGifts() {
    trimGifts();

    // 1 Diamond = $0.005

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(gifts)
    );
}

/**
 * Render all gifts.
 */
function renderGifts() {
    main.replaceChildren();

    for (const gift of gifts) {
        main.append(createGift(gift));
    }
}

/**
 * Update timestamps without rebuilding the gifts.
 */
function updateTimestamps() {
    const timestamps = document.querySelectorAll(
        ".gift-timestamp"
    );

    for (const element of timestamps) {
        const createdAt = Number(element.dataset.createdAt);

        element.textContent = formatRelativeTime(createdAt);
    }
}

/**
 * Load stored gifts.
 */
let gifts = [];

try {
    gifts = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
    );

    if (!Array.isArray(gifts)) {
        gifts = [];
    }

    const totalUsd =
        parseFloat(localStorage.getItem("totalUsd")) || 0;

    const totalUsdElement = document.getElementById("totalusd");

    totalUsdElement.textContent = `Face Reveal Tier 1 ... $${totalUsd.toFixed(2)} / $250`;
} catch (error) {
    console.error(
        "Failed to load stored gifts:",
        error
    );

    gifts = [];
}

// Remove expired gifts immediately when the page loads.
removeExpiredGifts();

// Make sure we never have more than 10.
trimGifts();
saveGifts();

renderGifts();

stream.onopen = () => {
    status.textContent = "● Connected";
    status.style.color = "#4ade80";
};

stream.onmessage = (event) => {
    try {
        const data = JSON.parse(event.data);

        console.log(data);

        const giftId = data.giftId;
        const message = data.common?.describe;

        // USER PFP
        const imageUrl =
            data.user?.avatarThumb?.urlList?.[0] ||
            "https://placehold.co/64x64";

        // GIFT ICON
        const giftImageUrl = data.gift?.image?.urlList[0] ||
            "https://placehold.co/32x32";

        // TIKTOK DIAMONDS
        const POINTS = data.gift?.diamondCount || 0;

        // CREATOR USD VALUE
        const usdAmount = Number((POINTS * 0.005).toFixed(2));

        const giftName =
            data?.gift?.describe ||
            "Gift";

        if (!giftId || !message) {
            return;
        }

        const now = Date.now();

        const previousTime =
            recentGiftIds.get(giftId);

        // Ignore duplicate event within 5 seconds.
        if (
            previousTime &&
            now - previousTime < DUPLICATE_WINDOW
        ) {
            console.log(
                "Duplicate gift ignored:",
                giftId
            );

            return;
        }

        recentGiftIds.set(giftId, now);

        const gift = {
            giftId,
            message,
            giftName,
            imageUrl,
            giftImageUrl,
            POINTS,
            usdAmount,
            createdAt: now
        };

        console.log("Gift received:", gift);

        // Add newest gift.
        gifts.unshift(gift);

        // Update total USD earned.
        const currentTotalUsd =
            parseFloat(localStorage.getItem("totalUsd")) || 0;

        const newTotalUsd =
            Number((currentTotalUsd + usdAmount).toFixed(2));

        localStorage.setItem(
            "totalUsd",
            newTotalUsd.toString()
        );

        // Remove anything older than 5 minutes.
        gifts = gifts.filter(gift => {
            return now - gift.createdAt < GIFT_MAX_AGE;
        });

        // Keep only the newest 10.
        trimGifts();

        saveGifts();
        renderGifts();

        const totalUsd =
            parseFloat(localStorage.getItem("totalUsd")) || 0;

        const totalUsdElement = document.getElementById("totalusd");

        totalUsdElement.textContent = `Face Reveal Tier 1 ... $${totalUsd.toFixed(2)} / $250`;

    } catch (error) {
        console.error(
            "Failed to process gift:",
            error
        );
    }
};

stream.onerror = (error) => {
    console.error(
        "Gift stream error:",
        error
    );

    status.textContent = "● Disconnected";
    status.style.color = "#f87171";
};

/**
 * Every second:
 *
 * 1. Remove gifts older than 5 minutes.
 * 2. Update "x seconds ago" timestamps.
 */
setInterval(() => {
    removeExpiredGifts();
    // updateTimestamps();
}, 1000);

/**
 * Clean old duplicate IDs.
 */
setInterval(() => {
    const now = Date.now();

    for (const [giftId, timestamp] of recentGiftIds) {
        if (
            now - timestamp >= DUPLICATE_WINDOW
        ) {
            recentGiftIds.delete(giftId);
        }
    }
}, 1000);