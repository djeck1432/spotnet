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
            className="modall-overlay"
        >
            <form
                className="report-bug-form"
                onClick={(e) => e.stopPropagation()}
                onSubmit={handleSubmit}
            >
                <div className="modall-content">
                    <div className="text-group">
                        <h3>Report Bug</h3>
                        <p className="modal-paragraph-text">
                            Please describe the bug you've encountered
                        </p>
                        <textarea
                            value={bugDescription}
                            onChange={(e) => setBugDescription(e.target.value)}
                            placeholder="The bug I'm experiencing..."
                            className="bug-textarea"

                        />
                        <a
                            className="dev-group-link"
                            href="https://t.me/spotnet_dev"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <img
                                src={telegramIcon}
                                alt="telegram-icon"
                                className="telegram-icon"
                            />
                            Ask in our Dev group
                        </a>
                    </div>

                    <div className="button-group">
                        <Button
                            variant="secondary"
                            type="button"
                            className="cancel-button"
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
                            className="submit-button"
                        >
                            {mutation.isPending ? "Sending..." : "Send Report"}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
