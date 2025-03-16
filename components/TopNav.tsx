import TopNavUser from "../islands/TopNavUser.tsx"

export default function TopNav() {
    return (
        <>
            <div class="fixed top-0 left-0 flex justify-between items-center w-full px-4 bg-none border-b-1 border-gray-200 backdrop-blur-sm z-20">
                <div class="flex items-center">
                    <a href="/" class="text-xl font-semibold text-white">
                        <img src="/logo_text.png" class="h-12 mr-2 inline-block align-middle object-contain max-md:hidden" />
                        <img src="/logo.png" class="h-8 m-2 mr-2 inline-block align-middle object-contain md:hidden" />
                    </a>
                    <a href="https://keewinek.netlify.app/discord" target="_blank" class="text-white text-sm ml-2 hover:text-blue-200">
                        <i class="fa-brands fa-discord"></i>
                    </a>
                </div>
                <TopNavUser/>
            </div>
            <div class="h-12"></div>
        </>
    )
}