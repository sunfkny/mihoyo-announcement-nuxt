export function LoadingAnnouncement() {
  return (
    <div className="w-full animate-pulse">
      <div className="my-4">
        <div className="h-2 w-full rounded-sm bg-gray-200 dark:bg-gray-700" />
        <div className="my-1 h-4 w-[500px] max-w-full rounded-sm bg-gray-200 dark:bg-gray-700" />
      </div>
      {Array.from({ length: 3 }, (_, index) => (
        <div key={index}>
          <div className="my-1 h-[280px] w-full rounded-sm bg-gray-200 dark:bg-gray-700" />
          <div className="my-1 h-4 w-[400px] max-w-full rounded-sm bg-gray-200 dark:bg-gray-700" />
          <div className="my-1 h-4 w-[260px] max-w-full rounded-sm bg-gray-200 dark:bg-gray-700" />
          <div className="my-1 h-4 w-[360px] max-w-full rounded-sm bg-gray-200 dark:bg-gray-700" />
        </div>
      ))}
    </div>
  );
}
