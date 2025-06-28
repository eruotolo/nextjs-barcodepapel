import Image from 'next/image';
import { getPostFromHome } from '@/actions/Administration/Blogs/queries';

export default async function NewsHome() {
    const initialPosts = await getPostFromHome(0, 6);

    return (
        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {initialPosts.map((post) => (
                <article key={post.id}>
                    <div className="mb-[10px]">
                        <h3 className="font-basic-sans font-semibold text-[#f50a86] uppercase md:text-[18px]">
                            {post.primaryCategory.name}
                        </h3>
                    </div>

                    {post.image && (
                        <div className="relative w-full md:h-[280px]">
                            <Image
                                src={post.image}
                                alt={post.name}
                                fill
                                className="rounded-[10px] object-cover"
                            />
                        </div>
                    )}

                    <div className="px-[6px] py-[16px]">
                        <h2 className="font-basic-sans text-negro font-normal md:text-[20px] md:leading-[24px]">
                            {post.name}
                        </h2>

                        <div className="flex flex-row md:py-[15px]">
                            <h4 className="font-basic-sans text-negro mr-[5px] font-normal md:text-[18px] md:leading-[18px]">
                                Por:
                            </h4>
                            <h4 className="font-basic-sans text-negro font-normal italic md:text-[18px] md:leading-[18px]">
                                {post.author}
                            </h4>
                        </div>
                        <div>
                            <p className="font-basic-sans text-[#575756] md:text-[14px] md:leading-[14px]">
                                {post.createdAt}
                            </p>
                        </div>
                    </div>
                </article>
            ))}
        </div>
    );
}
