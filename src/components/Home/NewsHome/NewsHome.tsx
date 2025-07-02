import Image from 'next/image';
import Link from 'next/link';
import { getPostFromHome } from '@/actions/Administration/Blogs/queries';

export default async function NewsHome() {
    const initialPosts = await getPostFromHome(0, 6);

    return (
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:mb-12 md:gap-8 lg:grid-cols-3">
            {initialPosts.map((post) => (
                <article key={post.id}>
                    <div className="mb-[8px] md:mb-[10px]">
                        <h3 className="font-basic-sans text-[16px] font-semibold text-[#f50a86] uppercase sm:text-[17px] md:text-[18px]">
                            {post.primaryCategory.name}
                        </h3>
                    </div>

                    {post.image && (
                        <div className="relative h-[200px] w-full overflow-hidden rounded-[10px] border-2 border-black sm:h-[240px] md:h-[280px]">
                            <Image src={post.image} alt={post.name} fill className="object-cover" />
                        </div>
                    )}

                    <div className="px-[4px] py-[12px] sm:px-[5px] sm:py-[14px] md:px-[6px] md:py-[16px]">
                        <h2 className="font-basic-sans text-negro text-[18px] leading-[22px] font-normal transition-colors duration-200 hover:text-[#f50a86] sm:text-[19px] sm:leading-[23px] md:text-[20px] md:leading-[24px]">
                            <Link href={`/blogs/${post.slug}`}>{post.name}</Link>
                        </h2>

                        <div className="flex flex-row py-[10px] sm:py-[12px] md:py-[15px]">
                            <h4 className="font-basic-sans text-negro mr-[5px] text-[16px] leading-[16px] font-normal sm:text-[17px] sm:leading-[17px] md:text-[18px] md:leading-[18px]">
                                Por:
                            </h4>
                            <h4 className="font-basic-sans text-negro text-[16px] leading-[16px] font-normal italic sm:text-[17px] sm:leading-[17px] md:text-[18px] md:leading-[18px]">
                                {post.author}
                            </h4>
                        </div>
                        <div>
                            <p className="font-basic-sans text-[13px] leading-[13px] text-[#575756] sm:text-[13.5px] sm:leading-[13.5px] md:text-[14px] md:leading-[14px]">
                                {post.createdAt}
                            </p>
                        </div>
                    </div>
                </article>
            ))}
        </div>
    );
}
