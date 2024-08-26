import { ArrowRightEndOnRectangleIcon } from "@heroicons/react/24/solid";
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
                        <div className="lg:flex-1">
                            <h1 className="mt-10 text-4xl font-bold tracking-tight text-white sm:text-6xl">
                                Project10K
                            </h1>
                            <p className="mt-6 text-lg leading-8 text-gray-300">
                                Project10k is a personal project. It was built as a development playground, to
                                experiment with new design patterns, methodologies, technologies and frameworks.
                            </p>
                            <p className="mt-6 text-lg leading-8 text-gray-300">
                                At its heart, it is a fintech research tool for equity analysts. Project10K is a
                                research tool, that allows analysts and investors to create comprehensive research notes
                                (Journals) on public companies.
                            </p>
                            <p className="mt-6 text-lg leading-8 text-gray-300">
                                Currently, it features powerful highlight and citation tools allowing users to reference
                                back to original company filings.
                            </p>
                            <p className="mt-6 text-lg leading-8 text-gray-300">Frontend built using:</p>
                            <ul className="list-disc pl-6">
                                <li>React + Next.js</li>
                                <li>Typescript</li>
                                <li>Apollo GraphQL</li>
                                <li>Tailwind CSS</li>
                            </ul>
                            <p className="mt-6 text-lg leading-8 text-gray-300">Backend built using:</p>
                            <ul className="list-disc pl-6">
                                <li>NextJS</li>
                                <li>Typescript</li>
                                <li>Microservices (TCP)</li>
                                <li>Apollo GraphQL</li>
                                <li>JWT + Guards via Passport</li>
                                <li>Mongoose + MongoDB</li>
                                <li>Docker - Nginx - AWS</li>
                            </ul>
                        </div>
                        <div className="mx-auto flex lg:flex-1 lg:pt-8">
                            <div className="lg:flex lg:flex-col lg:mt-10 lg:justify-center lg:mb-40 w-full mt-16 lg:px-32">
                                <Link legacyBehavior={true} passHref href="/login">
                                    <a className="justify-center leading-10 flex font-semibold text-white hover:text-gray-400 text-4xl rounded p-4 border-dashed border-2 border-gray-400">
                                        <ArrowRightEndOnRectangleIcon className="h-10 w-10 mr-2 flex-none" />
                                        <div className="flex-none mr-2">Sign In</div>
                                    </a>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <footer aria-labelledby="footer-heading" className="relative"></footer>
        </div>
    );
}
