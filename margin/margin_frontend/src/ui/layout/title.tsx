interface TitleProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function Title({ title, subtitle, className = "" }: TitleProps) {
  return (
    <div className={` ${className}`}>
      <h1 className="text-3xl font-bold text-[#313131] ">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-white">{subtitle}</p>}
    </div>
  );
}
