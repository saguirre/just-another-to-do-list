import Link from 'next/link';

export default function ForOhFour() {
  return (
    <>
      <div className="min-h-full h-screen !overflow-hidden flex flex-col items-center justify-center bg-th-background">
        <main className="flex-grow flex flex-col justify-center max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex-shrink-0 flex justify-center">
            <h1 className="text-5xl font-semibold text-th-accent-dark uppercase tracking-wide">404</h1>
          </div>
          <div className="py-2">
            <div className="text-center">
              <h1 className="mt-2 text-4xl font-extrabold text-th-primary-dark tracking-tight sm:text-5xl">
                Page not found.
              </h1>
              <p className="mt-2 text-base text-th-primary-medium">
                Sorry, we couldn't find the page you're looking for.
              </p>
              <div className="mt-6">
                <Link href="/">
                  <div className="text-base font-medium text-th-accent-dark hover:text-th-accent-medium">
                    Go Back Home<span aria-hidden="true"> &rarr;</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
