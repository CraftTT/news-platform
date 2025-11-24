interface EmptyStateProps {
  title: string;
  subtitle?: string;
}

export default function EmptyState({ title, subtitle }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      {subtitle && <p className="text-gray-600">{subtitle}</p>}
    </div>
  );
}
