// components/Header.tsx
import Link from 'next/link'
import { ReactNode } from 'react'

type HeaderProps = {
    children?: ReactNode
}
// TO DO: Add shading to the current link
export default function Header({ children }: HeaderProps) {
    return (
        <div>
            <nav className="bg-gray-800 p-4">
                <div className="container mx-auto">
                    <Link href="/reddish-reviews/movies" className="text-white mr-4">
                        Movies
                    </Link>
                    <Link href="/reddish-reviews/books" className="text-white mr-4">
                        Books
                    </Link>
                    <Link href="/reddish-reviews/tv-shows" className="text-white mr-4">
                        TV Shows
                    </Link>
                    <Link href="/reddish-reviews/video-games" className="text-white mr-4">
                        Video Games
                    </Link>
                </div>
            </nav>
            <main className="container mx-auto p-4">
                {children}
            </main>
        </div>
    )
}