"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

type MediaTableProps = {
    children?: ReactNode
}

export default function MediaTable({ children }: MediaTableProps) {
    const pathname = usePathname()
    return (
        <div>
            <nav className="bg-gray-800 p-4">
                <div className="container mx-auto flex space-x-4">
                    <Link href="/reddish-reviews/movies" className={`text-white px-4 py-2 rounded ${pathname === '/reddish-reviews/movies' ? 'bg-gray-700' : ''}`}>
                        Movies
                    </Link>
                    <Link href="/reddish-reviews/books" className={`text-white px-4 py-2 rounded ${pathname === '/reddish-reviews/books' ? 'bg-gray-700' : ''}`}>
                        Books
                    </Link>
                    <Link href="/reddish-reviews/tv-shows" className={`text-white px-4 py-2 rounded ${pathname === '/reddish-reviews/tv-shows' ? 'bg-gray-700' : ''}`}>
                        TV Shows
                    </Link>
                    <Link href="/reddish-reviews/video-games" className={`text-white px-4 py-2 rounded ${pathname === '/reddish-reviews/video-games' ? 'bg-gray-700' : ''}`}>
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