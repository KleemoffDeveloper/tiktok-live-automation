const videoPlayer = document.getElementById("videoplayer");
const main = document.getElementsByClassName("feed")[0];

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

    const textInfo = document.createElement("div");
    textInfo.className = "gift-text-info";

    const text = document.createElement("h2");
    text.textContent = gift.message;

    textInfo.append(text);

    console.log(gift);

    giftIconContainer.append(giftIcon);

    giftElement.append(
        giftIconContainer,
        textInfo
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

const playVideo = (src = "") => {
    videoPlayer.src = src;
    videoPlayer.playsInline = true;
    videoPlayer.autoPlay = true;

    videoPlayer.muted = true;
    videoPlayer.play().catch(console.error);
    videoPlayer.muted = false;

    videoPlayer.addEventListener("ended", () => {
        videoPlayer.pause();
        videoPlayer.currentTime = 0;
    }, { once: true });
};

const soundboard = {

    // ─────────────────────────────
    // COMMON / LOW-VALUE GIFTS
    // ─────────────────────────────

    "rose": "videos/fart.mp4",
    "heart me": "videos/fart.mp4",
    "like": "videos/fart.mp4",
    "finger heart": "videos/fart.mp4",
    "heart": "videos/fart.mp4",
    "love": "videos/fart.mp4",
    "gg": "videos/fart.mp4",
    "nice": "videos/fart.mp4",
    "clap": "videos/fart.mp4",
    "thumbs up": "videos/fart.mp4",
    "hand heart": "videos/boom.mp4",
    "tiny d": "videos/fart.mp4",
    "ice cream": "videos/fart.mp4",
    "coffee": "videos/fart.mp4",
    "doughnut": "videos/fart.mp4",
    "cake": "videos/fart.mp4",
    "candy": "videos/fart.mp4",
    "lollipop": "videos/fart.mp4",
    "popcorn": "videos/fart.mp4",
    "chili": "videos/fart.mp4",
    "barbecue": "videos/fart.mp4",
    "mic": "videos/fart.mp4",
    "cap": "videos/fart.mp4",
    "fire": "videos/fart.mp4",
    "ice": "videos/fart.mp4",
    "star": "videos/fart.mp4",
    "spark": "videos/fart.mp4",
    "confetti": "videos/fart.mp4",

    // ─────────────────────────────
    // FOOD / DRINKS
    // ─────────────────────────────

    "it's corn": "videos/fart.mp4",
    "corn": "videos/fart.mp4",
    "chocolate": "videos/fart.mp4",
    "rose cake": "videos/fart.mp4",
    "birthday cake": "videos/fart.mp4",
    "cupcake": "videos/fart.mp4",
    "ice cream cone": "videos/fart.mp4",
    "cookie": "videos/fart.mp4",
    "burger": "videos/fart.mp4",
    "pizza": "videos/fart.mp4",
    "fries": "videos/fart.mp4",
    "ramen": "videos/fart.mp4",
    "sushi": "videos/fart.mp4",
    "watermelon": "videos/fart.mp4",
    "strawberry": "videos/fart.mp4",
    "apple": "videos/fart.mp4",
    "banana": "videos/fart.mp4",
    "peach": "videos/fart.mp4",
    "lemon": "videos/fart.mp4",
    "coconut": "videos/fart.mp4",
    "orange": "videos/fart.mp4",
    "grapes": "videos/fart.mp4",
    "pineapple": "videos/fart.mp4",
    "taco": "videos/fart.mp4",
    "hot dog": "videos/fart.mp4",
    "beer": "videos/fart.mp4",
    "wine": "videos/fart.mp4",
    "champagne": "videos/fart.mp4",
    "cocktail": "videos/fart.mp4",

    // ─────────────────────────────
    // ANIMALS
    // ─────────────────────────────

    "panda": "videos/fart.mp4",
    "cat": "videos/fart.mp4",
    "dog": "videos/fart.mp4",
    "puppy": "videos/fart.mp4",
    "kitten": "videos/fart.mp4",
    "duck": "videos/fart.mp4",
    "chick": "videos/fart.mp4",
    "bunny": "videos/fart.mp4",
    "rabbit": "videos/fart.mp4",
    "bear": "videos/fart.mp4",
    "monkey": "videos/fart.mp4",
    "lion": "videos/fnaf.mp4",
    "tiger": "videos/fart.mp4",
    "whale": "videos/fart.mp4",
    "dolphin": "videos/fart.mp4",
    "butterfly": "videos/fart.mp4",
    "bee": "videos/fart.mp4",
    "ladybug": "videos/fart.mp4",
    "unicorn": "videos/fart.mp4",

    // ─────────────────────────────
    // LOVE / EMOTIONS
    // ─────────────────────────────

    "love you": "videos/fart.mp4",
    "love ya": "videos/fart.mp4",
    "i love you": "videos/fart.mp4",
    "you are amazing": "videos/fart.mp4",
    "best": "videos/fart.mp4",
    "awesome": "videos/fart.mp4",
    "you're awesome": "videos/fart.mp4",
    "good luck": "videos/fart.mp4",
    "thank you": "videos/fart.mp4",
    "thanks": "videos/fart.mp4",
    "you're the best": "videos/fart.mp4",
    "good job": "videos/fart.mp4",
    "well done": "videos/fart.mp4",

    // ─────────────────────────────
    // SPORTS
    // ─────────────────────────────

    "football": "videos/fart.mp4",
    "soccer": "videos/fart.mp4",
    "basketball": "videos/fart.mp4",
    "baseball": "videos/fart.mp4",
    "tennis": "videos/fart.mp4",
    "golf": "videos/fart.mp4",
    "boxing": "videos/fart.mp4",
    "trophy": "videos/fart.mp4",
    "medal": "videos/fart.mp4",
    "champion": "videos/fart.mp4",
    "goal": "videos/fart.mp4",
    "mvp": "videos/fart.mp4",

    // ─────────────────────────────
    // MUSIC / PERFORMANCE
    // ─────────────────────────────

    "music": "videos/fart.mp4",
    "dj": "videos/fart.mp4",
    "drum": "videos/fart.mp4",
    "guitar": "videos/fart.mp4",
    "piano": "videos/fart.mp4",
    "microphone": "videos/fart.mp4",
    "headphones": "videos/fart.mp4",
    "speaker": "videos/fart.mp4",
    "concert": "videos/fart.mp4",
    "rockstar": "videos/fart.mp4",
    "disco ball": "videos/fart.mp4",

    // ─────────────────────────────
    // TRAVEL / VEHICLES
    // ─────────────────────────────

    "car": "videos/fart.mp4",
    "sports car": "videos/fart.mp4",
    "race car": "videos/fart.mp4",
    "motorcycle": "videos/fart.mp4",
    "bike": "videos/fart.mp4",
    "scooter": "videos/fart.mp4",
    "train": "videos/fart.mp4",
    "airplane": "videos/fart.mp4",
    "jet": "videos/fart.mp4",
    "helicopter": "videos/fart.mp4",
    "rocket": "videos/fart.mp4",
    "yacht": "videos/fart.mp4",
    "ship": "videos/fart.mp4",
    "cruise ship": "videos/fart.mp4",

    // ─────────────────────────────
    // GAMING / INTERNET
    // ─────────────────────────────

    "gg": "videos/fart.mp4",
    "game": "videos/fart.mp4",
    "gaming": "videos/fart.mp4",
    "level up": "videos/fart.mp4",
    "power up": "videos/fart.mp4",
    "victory": "videos/fart.mp4",
    "win": "videos/fart.mp4",
    "winner": "videos/fart.mp4",
    "npc": "videos/fart.mp4",
    "viral": "videos/fart.mp4",
    "follow": "videos/fart.mp4",
    "share": "videos/fart.mp4",

    // ─────────────────────────────
    // HOLIDAYS / SEASONAL
    // ─────────────────────────────

    "autumn 2024": "videos/fart.mp4",
    "happy halloween": "videos/fart.mp4",
    "halloween": "videos/fart.mp4",
    "christmas": "videos/fart.mp4",
    "merry christmas": "videos/fart.mp4",
    "new year": "videos/fart.mp4",
    "happy new year": "videos/fart.mp4",
    "valentine": "videos/fart.mp4",
    "valentine's day": "videos/fart.mp4",
    "easter": "videos/fart.mp4",
    "thanksgiving": "videos/fart.mp4",
    "birthday": "videos/fart.mp4",
    "happy birthday": "videos/fart.mp4",

    // ─────────────────────────────
    // POPULAR / MID-TIER
    // ─────────────────────────────

    "finger heart": "videos/fart.mp4",
    "heart": "videos/fart.mp4",
    "heart balloon": "videos/fart.mp4",
    "love balloon": "videos/fart.mp4",
    "crown": "videos/fart.mp4",
    "diamond": "videos/fart.mp4",
    "diamond ring": "videos/fart.mp4",
    "fireworks": "videos/fart.mp4",
    "confetti": "videos/fart.mp4",
    "balloon": "videos/fart.mp4",
    "gift box": "videos/fart.mp4",
    "gift": "videos/fart.mp4",
    "magic wand": "videos/fart.mp4",
    "rainbow": "videos/fart.mp4",
    "universe": "videos/chika.mp4",
    "galaxy": "videos/chika.mp4",

    // ─────────────────────────────
    // HIGH-VALUE GIFTS
    // ─────────────────────────────

    "lion": "videos/fnaf.mp4",
    "lion's gift": "videos/chika.mp4",
    "lion": "videos/chika.mp4",
    "universe": "videos/fnaf.mp4",
    "galaxy": "videos/chika.mp4",
    "tiktok universe": "videos/chika.mp4",
    "planet": "videos/fart.mp4",
    "rocket": "videos/fart.mp4",
    "castle": "videos/fart.mp4",
    "yacht": "videos/fart.mp4",
    "sports car": "videos/fart.mp4",
    "luxury car": "videos/fart.mp4",
    "private jet": "videos/fart.mp4",
    "fireworks": "videos/fart.mp4",
    "diamond": "videos/fart.mp4",
    "diamond ring": "videos/fart.mp4",
    "crown": "videos/fart.mp4",
    "champagne": "videos/fart.mp4",

    // ─────────────────────────────
    // SPECIAL / EVENT GIFTS
    // ─────────────────────────────

    "popular vote": "videos/fart.mp4",
    "teamwork makes the dream work": "videos/fart.mp4",
    "teamwork": "videos/fart.mp4",
    "besties": "videos/fart.mp4",
    "you've got this": "videos/fart.mp4",
    "keep it up": "videos/fart.mp4",
    "let's go": "videos/fart.mp4",
    "go go go": "videos/fart.mp4",
    "you're on fire": "videos/fart.mp4",

};

const stream = new EventSource("http://localhost:3000/gift");

stream.onmessage = async (event) => {
    try {
        const data = JSON.parse(event.data);

        console.log(data);

        const sound = data.gift?.name?.toLowerCase();

        playVideo(soundboard[sound]);

        const giftId = data.giftId;
        const message = data.common?.describe;

        // // USER PFP
        const imageUrl =
            data.user?.avatarThumb?.urlList?.[0] ||
            "https://placehold.co/64x64";

        // // GIFT ICON
        const giftImageUrl = data.gift?.image?.urlList[0] ||
            "https://placehold.co/32x32";

        // const response = await fetch(giftImageUrl);
        // const buffer = Buffer.from(await response.arrayBuffer());

        // const base64 = buffer.toString("base64");

        // // TIKTOK DIAMONDS
        const POINTS = data.gift?.diamondCount || 0;

        // // CREATOR USD VALUE
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

    // status.textContent = "● Disconnected";
    // status.style.color = "#f87171";
};

playVideo("videos/fart.mp4");