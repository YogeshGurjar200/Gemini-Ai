const LoggingOut = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-base-200/70 backdrop-blur-sm z-50">
      <div className="card shadow-xl bg-base-100 p-6 animate-bounce">
        <div className="flex flex-col items-center gap-4">
          <span className="loading loading-spinner loading-lg text-error"></span>
          <h2 className="text-lg font-semibold text-error">Logging out...</h2>
          <p className="text-sm opacity-70 text-center">
            Please wait a moment while we securely sign you out.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoggingOut;
