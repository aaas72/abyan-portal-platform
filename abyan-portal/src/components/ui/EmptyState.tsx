import React from "react";
import { SmartContainer } from "@/components/layout";

interface EmptyStateProps {
  title: string;
  message: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, message }) => {
  return (
    <SmartContainer>
      <div className="py-20 text-center flex flex-col items-center justify-center space-y-4">
        <h3 className="font-abyan-title text-xl text-slate-500">{title}</h3>
        <p className="text-sm text-slate-400 font-abyan-body max-w-lg mx-auto">
          {message}
        </p>
      </div>
    </SmartContainer>
  );
};
