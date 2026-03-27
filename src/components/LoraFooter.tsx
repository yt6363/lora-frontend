interface LoraFooterProps {
  fixed?: boolean
}

export default function LoraFooter({ fixed = true }: LoraFooterProps) {
  return (
    <footer className={`${fixed ? 'fixed bottom-0 left-0 z-40' : ''} w-full px-6 py-3 text-xs font-body tracking-wide`}>
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <a
          href="https://www.getlora.com/ourworld"
          target="_blank"
          rel="noopener noreferrer"
          className="opacity-50 hover:opacity-80 transition-opacity uppercase tracking-widest font-bold flex-1"
        >
          world
        </a>
        <div className="flex items-center gap-1.5 opacity-50 flex-1 justify-center">
          <span>made by</span>
          <img src="/lora-logo.png" alt="Lora" className="h-4 w-auto object-contain inline-block" />
          <span>with &#9825;</span>
        </div>
        <a
          href="https://www.getlora.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="opacity-50 hover:opacity-80 transition-opacity flex-1 text-right"
        >
          learn more at <span className="font-bold">Getlora.com</span>
        </a>
      </div>
    </footer>
  )
}
