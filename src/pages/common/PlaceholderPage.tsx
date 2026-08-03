import type React from "react";

export interface PlaceholderPageProps {
  title: string;
  icon: string;
  description?: string;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({
  title,
  icon,
  description = "Management panel under development.",
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-xl">
      <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-md">
        <span className="material-symbols-outlined text-[32px]">{icon}</span>
      </div>
      <h1 className="font-headline-lg text-headline-lg text-on-surface mb-xs">
        {title}
      </h1>
      <p className="text-secondary text-body-md max-w-fit mb-lg">
        {description}
      </p>
      <div className="inline-flex items-center gap-xs px-md py-sm bg-surface-container border border-outline-variant rounded-lg text-label-sm text-secondary">
        <span className="material-symbols-outlined text-sm">build</span>
        Module coming soon
      </div>
    </div>
  );
};

export default PlaceholderPage;
