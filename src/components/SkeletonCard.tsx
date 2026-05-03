export default function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-white border border-ccg-border overflow-hidden animate-pulse">
      <div className="aspect-square bg-ccg-surface" />
      <div className="p-3.5 space-y-2.5">
        <div className="h-2 bg-ccg-purple/10 rounded-full w-1/3" />
        <div className="h-3.5 bg-ccg-surface rounded-full w-4/5" />
        <div className="h-3.5 bg-ccg-surface rounded-full w-2/3" />
        <div className="h-4 bg-ccg-purple/10 rounded-full w-1/2 mt-1" />
      </div>
    </div>
  );
}
