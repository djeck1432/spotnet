import React from 'react';
import { Button } from '@/components/ui/custom-button/Button';
import useLockBodyScroll from '@/hooks/useLockBodyScroll';
import { cn } from '@/utils/cn';

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
      className="fixed top-0 left-0 z-[55555] flex h-full w-full items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={cancelAction}
    >
      <div
        className="shadow-primary-color flex items-center justify-center overflow-hidden text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex w-[330px] flex-col gap-[18px] rounded-2xl text-center md:w-full md:max-w-[700px] md:gap-6">
          <div className="border-nav-divider-bg bg-bg h-fit rounded-2xl border p-6 py-4 pt-4 text-center text-sm md:rounded-2xl">
            <div className="text-primary mb-6 w-full border-b border-b-[rgba(255,255,255,0.1)] px-[10px] py-[10px] text-center text-base text-[13px] sm:mb-[14px] sm:py-[6px] md:mb-4 md:pb-4">
              {title}
            </div>
            <div className="grid min-h-28 place-content-center px-2">
              <h2 className={cn('mx-auto mb-4 text-sm font-semibold md:text-2xl', content.length && 'px-0 py-[55px]')}>
                {subTitle}
              </h2>
              {content.map((content, i) => (
                <p className="mx-auto mt-0 mb-3 max-w-96 text-base leading-6" key={i}>
                  {content}
                </p>
              ))}
            </div>
          </div>
          <div className="flex justify-between gap-2 md:gap-4">
            <Button variant="secondary" size="md" onClick={cancelAction} disabled={isLoading}>
              {cancelLabel}
            </Button>
            <Button variant="primary" size="md" onClick={submitAction} disabled={isLoading}>
              {isLoading ? 'Loading...' : submitLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionModal;
