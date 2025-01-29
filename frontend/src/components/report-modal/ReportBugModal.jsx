import React, { useState } from 'react';
import telegramIcon from '@/assets/icons/telegram.svg';
import { Button } from '@/components/ui/custom-button/Button';
import { useWalletStore } from '@/stores/useWalletStore';
import { useBugReport } from '@/hooks/useBugReport';

export function ReportBugModal({ onClose }) {
  const { walletId } = useWalletStore();
  const [bugDescription, setBugDescription] = useState('');
  const { mutation, handleSubmit } = useBugReport(walletId, bugDescription, onClose);
  const { walletId } = useWalletStore();
  const [bugDescription, setBugDescription] = useState('');
  const { mutation, handleSubmit } = useBugReport(walletId, bugDescription, onClose);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50 p-24"
    >
      <form
        className="relative rounded-xl w-full max-w-xl"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <div className="space-y-6">
          <div className="text-center bg-dark-purple p-6">
            <h3 className="text-gray text-sm font-normal pb-2 border-b border-border-color">Report Bug</h3>
            <p className="text-white text-sm font-normal mt-2 mb-4">Please describe the bug you've encountered</p>
            <textarea
              value={bugDescription}
              onChange={(e) => setBugDescription(e.target.value)}
              placeholder="The bug I'm experiencing..."
              className="w-full min-h-[135px] bg-dark-purple border-x border-y border-border-color rounded-lg p-3 text-white resize-none outline-none placeholder:text-secondary placeholder:text-sm"
            />
            <a
              className="flex items-center gap-2 text-secondary text-sm font-normal mt-3 mb-6 hover:text-white"
              href="https://t.me/spotnet_dev"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={telegramIcon} alt="telegram-icon" className="w-5 h-5" />
              Ask in our Dev group
            </a>
          </div>

          <div className="flex gap-4 justify-center mt-4">
            <Button
              variant="secondary"
              type="button"
              className="px-6 py-2 text-sm text-white border-x border-y border-border-color bg-transparent rounded-lg hover:border-dark-purple"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" className="px-6 py-2 text-sm text-white bg-[#798795] rounded-lg">
              {mutation.isPending ? 'Sending...' : 'Send Report'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
