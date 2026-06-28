type AnnouncementBarProps = {
  message?: string;
};

export function AnnouncementBar({ message }: AnnouncementBarProps) {
  if (!message) {
    return null;
  }

  return (
    <div className="bg-zinc-950 px-4 py-2 text-center text-xs font-semibold uppercase tracking-wide text-white">
      {message}
    </div>
  );
}
