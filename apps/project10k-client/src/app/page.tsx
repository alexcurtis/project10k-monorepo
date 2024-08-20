import Link from "next/link";

export default function LandingPage() {
    return (
        <div className="h-screen">
            <main>
                <div className="relative isolate overflow-hidden">
                    <div
                        aria-hidden="true"
                        className="absolute left-[calc(50%-4rem)] top-10 -z-10 transform-gpu blur-3xl sm:left-[calc(50%-18rem)] lg:left-48 lg:top-[calc(50%-30rem)] xl:left-[calc(50%-24rem)]"
                    >
                        <div
                            style={{
                                clipPath:
                                    "polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)",
                            }}
                            className="aspect-[1108/632] w-[69.25rem] bg-gradient-to-r from-[#80caff] to-[#4f46e5] opacity-20"
                        />
                    </div>
                    <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-40 lg:flex lg:px-8 lg:pt-40">
                        <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
                            <h1 className="mt-10 text-4xl font-bold tracking-tight text-white sm:text-6xl">
                                Project10K
                            </h1>
                            <p className="mt-6 text-lg leading-8 text-gray-300">
                                A very early stage project from Alexander Curtis.
                            </p>
                            <p className="mt-6 text-lg leading-8 text-gray-300">Built using:</p>
                            <ul className="list-disc pl-6">
                                <li>React</li>
                                <li>GraphQL</li>
                                <li>MongoDB</li>
                            </ul>
                            <div className="mt-10 flex items-center gap-x-6">
                                <Link legacyBehavior={true} passHref href="/login">
                                    <a className="rounded-md bg-indigo-500 px-3.5 py-2.5 text-base font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400">
                                        Login
                                    </a>
                                </Link>
                            </div>
                        </div>
                        <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
                            <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none"></div>
                        </div>
                    </div>
                </div>
            </main>
            <footer aria-labelledby="footer-heading" className="relative"></footer>
        </div>
    );
}
