interface LoadingOverlayProps {
  isVisible: boolean;
}

export const LoadingOverlay = ({ isVisible }: LoadingOverlayProps) => {
  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${
        isVisible ? '' : 'hidden'
      }`}
    >
      <div className="bg-white dark:bg-dark-secondary p-6 rounded-lg shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-light"></div>
          <span className="text-gray-800 dark:text-light">Processando...</span>
        </div>
      </div>
    </div>
  );
};
