import React from 'react';
import { Button } from '@/components/ui/custom-button/Button';
import useLockBodyScroll from '@/hooks/useLockBodyScroll';

const ActionModal = ({
  isOpen,
  title,
  subTitle,
  content = [],
  cancelLabel = 'Cancel',
  cancelAction,
  submitLabel,
  submitAction,
  isLoading = false,
}) => {
  useLockBodyScroll(isOpen);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-spinner-bgn backdrop-blur-sm z-[9999]"
      onClick={cancelAction}
    >
      <div
        className="flex items-center justify-center shadow-lg overflow-hidden w-full max-w-[700px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="rounded-2xl p-6 w-full flex flex-col gap-6 text-center max-w-[420px]">
          <div className="bg-header-button-bg p-4 border border-nav-divider-bg rounded-2xl h-[260px]">
            <div className="text-sm font-medium text-white border-b border-white/10 mb-6 pb-2">{title}</div>
            <h2 className={`text-lg font-semibold leading-1 mx-auto mb-4 ${!content.length && 'py-14'}`}>
              {subTitle}
            </h2>
            {content.map((item, i) => (
              <p key={i} className="text-second-primary text-base leading-6 max-w-[380px] mx-auto mb-3">
                {item}
              </p>
            ))}
          </div>
          <div className="flex gap-4 justify-center">
            <Button
              variant="secondary"
              size="md"
              className="relative text-white bg-second-gradient"
              onClick={cancelAction}
              disabled={isLoading}
            >
              {cancelLabel}
            </Button>
            <Button
              variant="primary"
              size="md"
              className="bg-button-gradient text-white"
              onClick={submitAction}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : submitLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionModal;
