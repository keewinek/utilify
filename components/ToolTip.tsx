import { VNode } from "preact";

export default function ToolTip({children, message, delay=100}:{children:VNode | VNode[], message:string, delay?:number}) {
    return (
        <div className="group relative flex cursor-pointer">
            {children}
            <span className={`absolute bottom-6 scale-0 z-30 whitespace-nowrap left-1/2 scale scale-x-0 -translate-x-1/2 max-w-96 delay-${delay} transition-all rounded bg-gray-900 p-2 text-xs text-white group-hover:scale-100`}>{message}</span>
        </div>
    )
}

export function ToolTipInline({children, message, delay=100, position="top"}:{children:VNode | VNode[], message:string, delay?:number, position?:'top' | 'bottom' | 'left' | 'right'}) {
    const positionClasses = {
        top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
        bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
        left: "right-full top-1/2 -translate-y-1/2 mr-2",
        right: "left-full top-1/2 -translate-y-1/2 ml-2"
    };

    return (
        <div className="group relative inline-block cursor-pointer">
            {children}
            <span className={`absolute scale-0 z-30 whitespace-nowrap scale scale-x-0 overflow-hidden delay-${delay} transition-all rounded bg-gray-900 p-2 text-xs text-white group-hover:scale-100 ${positionClasses[position]}`} style={{ whiteSpace: 'nowrap', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {message}
            </span>
        </div>
    )
}