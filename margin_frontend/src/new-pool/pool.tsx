import  { useState } from 'react';
import { EllipsisVertical, SlidersHorizontal, Equal,Search } from 'lucide-react';
const PoolPage = () => {
  // Pool data
  const [activeTab, setActiveTab] = useState('All');
  

  const poolData = [
    { pair: 'STRK - ETH', apy: '8.9%', risk: 'Low', liquidity: '$1,250,000', type: 'All' },
    { pair: 'STRK - ETH', apy: '0.00%', risk: 'Low', liquidity: '$1,250,000', type: 'Statute' },
    { pair: 'STRK - ETH', apy: '~2.39%', risk: 'High', liquidity: '$1,250,000', type: 'All' },
    { pair: 'STRK - ETH', apy: '~2.39%', risk: 'High', liquidity: '$1,250,000', type: 'Volatile' },
    { pair: 'STRK - ETH', apy: '~2.39%', risk: 'High', liquidity: '$1,250,000', type: 'All' },
    { pair: 'STRK - ETH', apy: '0.00%', risk: 'High', liquidity: '$1,250,000', type: 'Statute' },
    { pair: 'STRK - ETH', apy: '0.00%', risk: 'Low', liquidity: '$1,250,000', type: 'All' },
    { pair: 'STRK - ETH', apy: '~2.39%', risk: 'High', liquidity: '$1,250,000', type: 'Volatile' },
    { pair: 'STRK - ETH', apy: '~2.39%', risk: 'High', liquidity: '$1,250,000', type: 'All' },
    { pair: 'STRK - ETH', apy: '~2.39%', risk: 'High', liquidity: '$1,250,000', type: 'Statute' },
    { pair: 'STRK - ETH', apy: '0.00%', risk: 'Low', liquidity: '$1,250,000', type: 'All' },
  
];

  

  const filteredPools = poolData.filter(pool => 
    activeTab === 'All' || pool.type === activeTab
  );

  

  return (
    <div className="min-h-screen bg-[#0E1115] text-[#F1F7FF] p-4 md:p-8">
      <div className="">
        {/* MARGIN Section */}
       
        <div className="  flex justify-between items-center py-8">
          <h2 className="text-xl font-semibold ">MARGIN</h2>
          <div className=" p-4 md:flex hidden items-center gap-8">
            <p className="text-sm ">Pool</p>
            <p className="text-sm  text-gray-600">Trade</p>
          </div>
       

        {/* GOSTER Section */}
        <div className="flex items-center justify-between gap-4 ">
         <div className='flex items-center md:gap-2 gap-1 w-fit bg-[#12181F] md:px-6 px-2 py-3 rounded-lg'>
            <img src='/pool/trust.png' className='' />
            <p className="md:text-sm text-xs">0.00 ETH</p>
            </div> 
          <div className="flex items-center gap-2 w-fit bg-[#12181F] md:px-6 px-2 py-3 rounded-lg">
            <img src='/pool/avarter.png' className='' />
            <p className="md:text-sm text-xs">0xA3b5...F9C2</p>
            <EllipsisVertical size={16}/>

          </div>
        </div>
        </div>

        {/* First PODLS Section */}
        <div className="hidden md:block">
        <div className='md:hidden flex items-center justify-between'>  
        <div className='bg-[#12181F] w-fit px-4 py-3 rounded-full flex items-center gap-2'>
            <Search size={20} className='text-gray-400'/>
        <input type="text" placeholder="Search Pools" className=" bg-transparent outline-none text-white text-sm  " />
      
        </div>
        
          <Equal className='text-gray-400'/>
        </div>
          <h2 className="text-2xl text-left font-semibold text-gray-800 my-4">POOLS</h2>
          <p className=" md:mb-6 text-gray-300 mb-10 text-left text-sm md:w-[50%]">
            Earn positive income by providing liquidity to top trading ports.
            Choose a pool, deposit funds, and store earnings.
          </p>

          {/* Tabs */}
         <div className='md:flex hidden overflow-x-auto justify-between  border-b border-gray-600 mb-4'>
         <div className="flex overflow-x-auto gap-4 ">
            {['All', 'Statute', 'Volatile'].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 whitespace-nowrap font-medium text-sm ${activeTab === tab ? 'text-[#00D1FF] border-b-2 border-t-2 border-[#00D1FF]' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}

          </div>

          <div className='bg-[#12181F] w-fit px-4 py-3 rounded-full flex items-center gap-2'>
            <Search size={20} className='text-gray-400'/>
        <input type="text" placeholder="Search Pools" className=" bg-transparent outline-none text-white text-sm  " />
      
        </div>
         </div>
          {/* Pool Table */}
          <div className="overflow-x-auto hidden md:block ">
            <table className="min-w-full divide-y divide-gray-800">
              <thead className="">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pool</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">APY %</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Liquidity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className=" divide-y divide-gray-800">
                {filteredPools.map((pool, index) => (
                  <tr key={index}>
                   <div className='flex items-center gap-3'>
                   <div className="relative flex items-center">
  <img src="/pool/strk.png" className="absolute " />
  <img src="/pool/trustb.png" className="relative left-8" />
</div>

                   <td className="px-6 py-4 whitespace-nowrap font-medium ">{pool.pair} <p className='text-xs pt-1 text-gray-600 flex gap-3'>
                   Stable <span>0.500%</span> </p>  </td>
                   </div>
                    <td className={`px-6 py-4 text-xs whitespace-nowrap font-bold ${pool.apy.includes('~') ? 'text-red-500' : 'text-[#00D1FF]'}`}>
                      {pool.apy}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {pool.risk === 'Low' ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold ">
                          {pool.risk}
                        </span>
                      ) : pool.risk === 'High' ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold  ">
                          {pool.risk}
                        </span>
                      ) : null}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs">{pool.liquidity}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {pool.liquidity && (
                        <button className="px-4 py-2 bg-[#12181F]  text-gray-600 text-sm font-medium rounded-full   focus:outline-none   ">
                          DEPOSIT
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>


        {/* Second MARGIN Section Mobile */}
        <div className='md:hidden'>
        <div className='flex  justify-between  items-center  border-b border-gray-600 mb-4 '>
         <div className="flex  gap-4 ">
            {['All', 'Statute', 'Volatile'].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 whitespace-nowrap font-medium text-sm ${activeTab === tab ? 'text-[#00D1FF] border-b-2 border-t-2 border-[#00D1FF]' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}

          </div>
          <SlidersHorizontal size={20} className=' text-gray-400 md:hidden'/>

          <input type="text" placeholder="Search Pools" className="bg-[#12181F] w-fit outline-none text-white text-sm px-4 py-3 rounded-full  hidden md:block" />

         </div>
          {/* Pool Table */}
          <div className="overflow-x-auto ">
            <table className="min-w-full divide-y divide-gray-800">
             
              <tbody className=" divide-y divide-gray-800">
                {filteredPools.map((pool, index) => (
                  <tr key={index} className='flex flex-col justify-center'>
                  <div className='flex justify-between'>
                  <div className='flex items-center gap-6'>
                   <div className="relative flex items-center">
  <img src="/pool/strk.png" className="absolute " />
  <img src="/pool/trustb.png" className="relative left-8" />
</div>

                   <td className="px-6 py-4 whitespace-nowrap font-medium ">{pool.pair} <p className='text-xs pt-1 text-gray-600 flex gap-3'>
                   Stable <span>0.500%</span> </p>  </td>
                   </div>
                   <div className='text-gray-500 text-xs flex items-center gap-1'>
                    <div className='bg-gray-500 h-3 w-3 rounded'></div>
                    <p>Degen</p>
                   </div>
                  </div>

                  <thead className="">
                <tr className=''>
                <th className="px-7 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Liquidity</th>
                  <th className="px-7 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">APY %</th>
                  <th className="px-7 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
                    </tr>
              </thead>

                    <div>
                   <div>
                   <td className={`px-7 py-4 text-xs whitespace-nowrap font-bold ${pool.apy.includes('~') ? 'text-red-500' : 'text-[#00D1FF]'}`}>
                      {pool.apy}
                    </td>
                    <td className="px-7 py-4 whitespace-nowrap">
                      {pool.risk === 'Low' ? (
                        <span className="px-7 inline-flex text-xs leading-5 font-semibold ">
                          {pool.risk}
                        </span>
                      ) : pool.risk === 'High' ? (
                        <span className="px-7 inline-flex text-xs leading-5 font-semibold  ">
                          {pool.risk}
                        </span>
                      ) : null}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs">{pool.liquidity}</td>

                   </div>
                   
                    <td className="px-6 py-4 whitespace-nowrap flex justify-center w-full">
                      {pool.liquidity && (
                        <button className="px-4 py-2 bg-[#12181F] w-[90%]  mx-auto text-gray-600 text-sm font-medium rounded-full   focus:outline-none   ">
                          DEPOSIT
                        </button>
                      )}
                    </td>
                    </div>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        
        </div>
       


      </div>
    </div>
  );
};

export default PoolPage;