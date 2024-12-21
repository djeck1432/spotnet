import { useMutation } from "@tanstack/react-query";
import { subscribeToNotification, generateTelegramLink } from "../services/telegram";
import { notify } from "../components/layout/notifier/Notifier";

const useTelegramNotification = () => {
    const mutation = useMutation({
        mutationFn: async ({ telegramId, walletId }) => {
            if (!telegramId) {
                // Get subscription link from backend
                const { subscription_link } = await generateTelegramLink(walletId);
                window.open(subscription_link, '_blank');
                return;
            }
            return await subscribeToNotification(telegramId, walletId);
        },
        onSuccess: () => {
            notify("Subscribed to notifications successfully!", "success");
        },
        onError: (error) => {
            notify(error?.message || "Failed to subscribe. Please try again.", "error");
        },
    });

    return {
        subscribe: mutation.mutate,
        isLoading: mutation.isPending,
    };
};

export default useTelegramNotification;
