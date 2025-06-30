import Image from 'next/image';
import { getPostFromHome } from '@/actions/Administration/Blogs/queries';

export default async function NewsHome() {
    const initialPosts = await getPostFromHome(0, 6);

    return (
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 md:mb-12 md:gap-8">
            {initialPosts.map((post) => (
                <article key={post.id}>
                    <div className="mb-[8px] md:mb-[10px]">
                        <h3 className="font-basic-sans font-semibold text-[#f50a86] uppercase text-[16px] sm:text-[17px] md:text-[18px]">
                            {post.primaryCategory.name}
                        </h3>
                    </div>

                    {post.image && (
                        <div className="relative w-full overflow-hidden rounded-[10px] border-2 border-black h-[200px] sm:h-[240px] md:h-[280px]">
                            <Image src={post.image} alt={post.name} fill className="object-cover" />
                        </div>
                    )}

                    <div className="px-[4px] py-[12px] sm:px-[5px] sm:py-[14px] md:px-[6px] md:py-[16px]">
                        <h2 className="font-basic-sans text-negro font-normal text-[18px] leading-[22px] sm:text-[19px] sm:leading-[23px] md:text-[20px] md:leading-[24px]">
                            {post.name}
                        </h2>

                        <div className="flex flex-row py-[10px] sm:py-[12px] md:py-[15px]">
                            <h4 className="font-basic-sans text-negro mr-[5px] font-normal text-[16px] leading-[16px] sm:text-[17px] sm:leading-[17px] md:text-[18px] md:leading-[18px]">
                                Por:
                            </h4>
                            <h4 className="font-basic-sans text-negro font-normal italic text-[16px] leading-[16px] sm:text-[17px] sm:leading-[17px] md:text-[18px] md:leading-[18px]">
                                {post.author}
                            </h4>
                        </div>
                        <div>
                            <p className="font-basic-sans text-[#575756] text-[13px] leading-[13px] sm:text-[13.5px] sm:leading-[13.5px] md:text-[14px] md:leading-[14px]">
                                {post.createdAt}
                            </p>
                        </div>
                    </div>
                </article>
            ))}
        </div>
    );
}
