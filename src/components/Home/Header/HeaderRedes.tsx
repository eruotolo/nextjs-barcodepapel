import { Instagram, Mail } from 'lucide-react';

export default function HeaderRedes() {
    return (
        <>
            <div className="mt-[20px] flex">
                <a
                    href="https://www.instagram.com/revistabarcodepapel/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-fucsia mr-[8px] rounded-[50%] p-[5px]"
                >
                    <Instagram size={26} />
                </a>
                <a
                    href="mailto:catabilleke@gmail.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-fucsia ml-[8px] rounded-[50%] p-[5px]"
                >
                    <Mail size={26} />
                </a>
            </div>
        </>
    );
}
