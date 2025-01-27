import React, { useState } from "react";
import "./ReportBugModal.css";
import telegramIcon from "../../assets/icons/telegram.svg";
import { Button } from "components/ui/custom-button/Button";
import { useWalletStore } from "stores/useWalletStore";
import { useBugReport } from "hooks/useBugReport";

export function ReportBugModal({ onClose }) {
    const { walletId } = useWalletStore();
    const [bugDescription, setBugDescription] = useState("");
    const { mutation, handleSubmit } = useBugReport(walletId, bugDescription, onClose);

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50 p-24"
        >
            <form
                className="relative rounded-md w-full max-w-xl bg-[#120721] p-6"
                onClick={(e) => e.stopPropagation()}
                onSubmit={handleSubmit}
            >
                <div className="space-y-6">
                    <div className="text-center">
                        <h3 className="text-[#798795] text-lg font-normal pb-2 border-b border-[#22153A]">
                            Report Bug
                        </h3>
                        <p className="text-[#f0f0f0] text-sm font-normal mt-2 mb-4">
                            Please describe the bug you've encountered
                        </p>
                        <textarea
                            value={bugDescription}
                            onChange={(e) => setBugDescription(e.target.value)}
                            placeholder="The bug I'm experiencing..."
                            className="w-full min-h-[135px] bg-[#120721] border border-[#22153A] rounded-lg p-4 text-white resize-none outline-none placeholder:text-[#f0f0f0] placeholder:text-sm"
                        />
                        <a
                            className="flex items-center gap-2 text-[#f0f0f0] text-sm font-normal mb-6 hover:text-white"
                            href="https://t.me/spotnet_dev"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <img
                                src={telegramIcon}
                                alt="telegram-icon"
                                className="w-5 h-5"
                            />
                            Ask in our Dev group
                        </a>
                    </div>

                    <div className="flex gap-4 justify-center mt-4">
                        <Button
                            variant="secondary"
                            type="button"
                            className="px-6 py-2 text-sm text-[#f0f0f0] border border-[#22153A] bg-transparent rounded-lg hover:bg-[#22153A]"
                            onClick={(e) => {
                                e.stopPropagation();
                                onClose();
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            type="submit"
                            className="px-6 py-2 text-sm text-white bg-[#798795] rounded-lg hover:bg-[#5c6c7b]"
                        >
                            {mutation.isPending ? "Sending..." : "Send Report"}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
