import Link from 'next/link'
function  Logo ()  {
    return (
      <Link href="/">
      <div className=' w-[200px]'>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60">
          <polygon points="10,30 30,10 50,30 30,50" fill="rgb(24 123 157)" />
          <circle cx="30" cy="30" r="10" fill="white" />
          <circle cx="30" cy="30" r="5" fill="rgb(239 31 200)" />
          <text x="60" y="40" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold" fill="black">InpuTron</text>
        </svg>
      </div>
      </Link>
    )
  }
  



function LogoLight() {
    return (
      <Link href="/">
      <div className=' w-[200px]'>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60">
          <polygon points="10,30 30,10 50,30 30,50" fill="rgb(24 123 157)" />
          <circle cx="30" cy="30" r="10" fill="white" />
          <circle cx="30" cy="30" r="5" fill="rgb(239 31 200)" />
          <text x="60" y="40" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold" fill="white">InpuTron</text>
        </svg>
      </div>
      </Link>
    )
  }
  

  function LogoPink() {
    return (
      <Link href="/">
      <div className=' w-[200px]'>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60">
          <polygon points="10,30 30,10 50,30 30,50" fill="rgb(239 31 200)" />
          <circle cx="30" cy="30" r="10" fill="white" />
          <circle cx="30" cy="30" r="5" fill="rgb(239 31 200)" />
          <text x="60" y="40" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold" fill="black">InpuTron</text>
        </svg>
      </div>
      </Link>
    )
  }
  


export { Logo, LogoLight,LogoPink }
