import React, { useState } from 'react';
import telegramIcon from '@/assets/icons/telegram.svg';
import { Button } from '@/components/ui/custom-button/Button';
import { useWalletStore } from '@/stores/useWalletStore';
import { useBugReport } from '@/hooks/useBugReport';

export function ReportBugModal({ onClose }) {
  const { walletId } = useWalletStore();
  const [bugDescription, setBugDescription] = useState('');
  const { mutation, handleSubmit } = useBugReport(walletId, bugDescription, onClose);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-24 backdrop-blur-sm"
    >
      <form
        className="relative w-full max-w-xl rounded-xl"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <div className="space-y-6">
          <div className="bg-dark-purple p-6 text-center">
            <h3 className="text-gray border-border-color border-b pb-2 text-sm font-normal">Report Bug</h3>
            <p className="mt-2 mb-4 text-sm font-normal text-white">Please describe the bug you've encountered</p>
            <textarea
              value={bugDescription}
              onChange={(e) => setBugDescription(e.target.value)}
              placeholder="The bug I'm experiencing..."
              className="bg-dark-purple border-border-color placeholder:text-secondary min-h-[135px] w-full resize-none rounded-lg border-x border-y p-3 text-white outline-none placeholder:text-sm"
            />
            <a
              className="text-secondary mt-3 mb-6 flex items-center gap-2 text-sm font-normal hover:text-white"
              href="https://t.me/spotnet_dev"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={telegramIcon} alt="telegram-icon" className="h-5 w-5" />
              Ask in our Dev group
            </a>
          </div>

          <div className="mt-4 flex justify-center gap-4">
            <Button
              variant="secondary"
              type="button"
              className="border-border-color hover:border-dark-purple rounded-lg border-x border-y bg-transparent px-6 py-2 text-sm text-white"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" className="rounded-lg bg-[#798795] px-6 py-2 text-sm text-white">
              {mutation.isPending ? 'Sending...' : 'Send Report'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
