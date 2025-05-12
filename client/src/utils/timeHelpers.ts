export const isCurrentlyOpen = (openTime: string, closeTime: string): boolean => {
    try {
        if (
            typeof openTime !== 'string' ||
            typeof closeTime !== 'string' ||
            !/^\d{1,2}:\d{2}$/.test(openTime) ||
            !/^\d{1,2}:\d{2}$/.test(closeTime)
        ) {
            return false;
        }

        const [openHour, openMinute] = openTime.split(':').map(Number);
        const [closeHour, closeMinute] = closeTime.split(':').map(Number);

        // Validate time ranges
        if (
            openHour < 0 || openHour > 23 || openMinute < 0 || openMinute > 59 ||
            closeHour < 0 || closeHour > 23 || closeMinute < 0 || closeMinute > 59
        ) {
            return false;
        }

        // Handle 24-hour open case
        if (openHour === closeHour && openMinute === closeMinute) {
            return true;
        }

        const now = new Date();
        let currentMinutes = now.getHours() * 60 + now.getMinutes();

        const openMinutes = openHour * 60 + openMinute;
        let closeMinutes = closeHour * 60 + closeMinute;

        // Handle next-day close times
        if (closeMinutes <= openMinutes) {
            closeMinutes += 24 * 60;
            if (currentMinutes < openMinutes) {
                currentMinutes += 24 * 60;
            }
        }

        return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
    } catch (err: any) {
        console.warn(`[WARN] isCurrentlyOpen failed: ${err.message}`);
        return false;
    }
};