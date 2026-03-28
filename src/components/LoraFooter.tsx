interface LoraFooterProps {
  fixed?: boolean
}

export default function LoraFooter({ fixed = true }: LoraFooterProps) {
  return (
    <footer className={`${fixed ? 'fixed bottom-0 left-0 z-40' : ''} w-full px-4 py-1.5 text-[10px] font-body tracking-wide`}>
      <div className="max-w-5xl mx-auto flex items-center justify-center gap-3 opacity-40">
        <a
          href="https://www.getlora.com/ourworld"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-80 transition-opacity uppercase tracking-widest font-bold"
        >
          world
        </a>
        <span className="text-[8px]">·</span>
        <div className="flex items-center gap-1">
          <span>made by</span>
          <img src="/lora-logo.png" alt="Lora" className="h-3 w-auto object-contain inline-block" />
          <span>with &#9825;</span>
        </div>
        <span className="text-[8px]">·</span>
        <a
          href="https://www.getlora.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-80 transition-opacity"
        >
          <span className="font-bold">Getlora.com</span>
        </a>
      </div>
    </footer>
  )
}
