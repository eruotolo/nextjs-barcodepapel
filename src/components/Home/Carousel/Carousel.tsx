'use client';

import Image from 'next/image';
import { getAllSponsorsForCarousel } from '@/actions/Administration/Sponsors/queries';
import { useEffect, useState } from 'react';
import type { SponsorsCarouselInterface } from '@/types/Administration/Sponsors/SponsorsCarouselInterface';

export default function CarouselSponsors() {
    const [originalSponsors, setOriginalSponsors] = useState<SponsorsCarouselInterface[]>([]);
    const [displaySponsors, setDisplaySponsors] = useState<SponsorsCarouselInterface[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const fetchSponsors = async () => {
            try {
                const data = await getAllSponsorsForCarousel();
                if (data && data.length > 0) {
                    setOriginalSponsors(data);
                    
                    const minItems = isMobile ? 2 : 4;
                    if (data.length > minItems) {
                        setDisplaySponsors([...data, ...data, ...data]);
                    } else {
                        setDisplaySponsors(data);
                    }
                }
            } catch (error) {
                console.error('Error loading sponsors:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSponsors();
    }, [isMobile]);

    useEffect(() => {
        const minItems = isMobile ? 2 : 4;
        
        if (originalSponsors.length === 0 || originalSponsors.length <= minItems) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => {
                const nextIndex = prevIndex + 1;
                const itemWidth = isMobile ? 50 : 25;
                if (nextIndex >= displaySponsors.length - minItems) {
                    return 0;
                }
                return nextIndex;
            });
        }, 3000);

        return () => clearInterval(interval);
    }, [originalSponsors.length, displaySponsors.length, isMobile]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fucsia"></div>
            </div>
        );
    }

    if (originalSponsors.length === 0) {
        return null;
    }

    const minItems = isMobile ? 2 : 4;
    const shouldAnimate = originalSponsors.length > minItems;
    const itemWidth = isMobile ? 50 : 25;

    return (
        <div className="w-full overflow-hidden py-8">
            <div className="flex justify-center">
                <div className={`w-full ${shouldAnimate ? 'max-w-4xl overflow-hidden' : 'max-w-2xl'}`}>
                    <div 
                        className={`flex ${shouldAnimate ? 'transition-transform duration-1000 ease-in-out' : 'justify-center'}`}
                        style={{ 
                            transform: shouldAnimate ? `translateX(-${currentIndex * itemWidth}%)` : 'none'
                        }}
                    >
                        {displaySponsors.map((sponsor, index) => (
                            <div
                                key={`${sponsor.id}-${index}`}
                                className={`flex-shrink-0 px-4 ${
                                    shouldAnimate 
                                        ? (isMobile ? 'w-1/2' : 'w-1/4')
                                        : (isMobile ? 'w-1/2' : 'w-1/4')
                                }`}
                            >
                                {sponsor.link ? (
                                    <a
                                        href={sponsor.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block h-24 w-full"
                                    >
                                        {sponsor.image ? (
                                            <Image
                                                src={sponsor.image}
                                                alt={sponsor.name}
                                                width={200}
                                                height={96}
                                                className="h-full w-full object-contain"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center">
                                                <span className="font-basic-sans text-sm text-gray-700">
                                                    {sponsor.name}
                                                </span>
                                            </div>
                                        )}
                                    </a>
                                ) : (
                                    <div className="h-24 w-full">
                                        {sponsor.image ? (
                                            <Image
                                                src={sponsor.image}
                                                alt={sponsor.name}
                                                width={200}
                                                height={96}
                                                className="h-full w-full object-contain"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center">
                                                <span className="font-basic-sans text-sm text-gray-700">
                                                    {sponsor.name}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
