import './Loader.css'


export default function Loader() {
    return (
      <div className='flex items-center justify-center h-[16rem]'>
      <div className="relative w-[60px] h-[60px]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin-smooth">
          <div className="flex space-x-2">
            <div className="w-[12px] h-[12px] bg-foreground rounded-full"></div>
            <div className="w-[12px] h-[12px] bg-foreground rounded-full"></div>
            <div className="w-[12px] h-[12px] bg-foreground rounded-full"></div>
          </div>
        </div>
      </div>
      </div>
    );
  }