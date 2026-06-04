import React from 'react';

const RoomDetails = () => {
  return (
    <main className="flex-1 w-full md:ml-64 mt-0 md:mt-20 h-screen md:h-[calc(100vh-5rem)] overflow-y-auto px-margin-mobile md:px-margin-desktop py-gutter pb-32">
      {/* Breadcrumb / Back Navigation */}
      <nav className="flex items-center gap-2 mb-6 text-on-surface-variant font-label-md text-label-md">
        <a className="hover:text-primary transition-colors flex items-center" href="#">
          <span className="material-symbols-outlined text-[18px] mr-1">arrow_back</span>
          Meeting Rooms
        </a>
        <span className="text-outline-variant">/</span>
        <span className="text-on-surface">The Obsidian Suite</span>
      </nav>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left Column: Room Details & Gallery */}
        <div className="xl:col-span-7 space-y-8">
          {/* Room Header info */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-display-lg text-display-lg text-on-surface">The Obsidian Suite</h2>
              <span className="px-3 py-1 rounded-full border border-outline-variant bg-surface-container font-label-sm text-label-sm text-primary flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(190,198,224,0.6)]"></span>
                Available Now
              </span>
            </div>
            <p className="font-body-lg text-body-lg text-on-surface-variant flex items-center gap-4">
              <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[18px]">location_on</span> Floor 42, North Wing</span>
              <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[18px]">group</span> Capacity: 14</span>
            </p>
          </div>

          {/* Bento Gallery Grid */}
          <div className="grid grid-cols-2 grid-rows-2 gap-4 h-[400px]">
            {/* Main Hero Image */}
            <div className="col-span-2 row-span-1 md:col-span-1 md:row-span-2 rounded-xl overflow-hidden border border-outline-variant/30 relative group">
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/80 to-transparent z-10"></div>
              <img alt="Obsidian Suite Main" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwk554G1qr0BpPIHVqmSp_14W3-ahF8sKHhG-qB_fmWGU4wU5WjnaMXrl8tuNOPLd2okwZdEqMnBqBiFHWCV3Bgg1mj_KeDgSJFgSixDtRHVmda9egY2RZU6xjDG35v5JH0l8xMm_dZTx6Ky82Pm7fOMV7oZJIvu_Pt5QkNzHiYthtekDYOYPX-PjsIEw4TxniBkKfyYy8bkMowZgT7DrHKkXeo-_U0E1KzWCYnsUa5RW63BK-koXoKV40qkQGe3YiWKTkGUSw4C8"/>
              <button className="absolute bottom-4 right-4 z-20 glass-panel border border-outline-variant rounded-full p-2 text-on-surface hover:text-primary transition-colors backdrop-blur-md bg-surface-container/30">
                <span className="material-symbols-outlined">fullscreen</span>
              </button>
            </div>
            {/* Secondary Image 1 */}
            <div className="col-span-1 row-span-1 rounded-xl overflow-hidden border border-outline-variant/30 relative group hidden md:block">
              <img alt="Tech Panel Detail" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNSLFFJMd5Mk6WK7WzWVSZJv2_fArbVHoke8UUp17C1PI9Yo4ZJoj9iOmyZvy3Nkpz2eCc8yxN-in2C1AXrIHexH9PPoEmuGICzbfdfQW0Bhc4J5ZX-dhOia8zNWbwebYutt0xyVZ9rZ3kOwojDyFS_okwDOE6Wu12KKyPQE_VuNyUKlBcIDqWM96QwZz3NLmtr7_llK0-FgZfjL7a0BPsios_bJkPEvJyOmpKOtGVGCyRfu2HVcjiLV4OdQUnfQSf60VV3HMZDq8"/>
            </div>
            {/* Secondary Image 2 */}
            <div className="col-span-1 row-span-1 rounded-xl overflow-hidden border border-outline-variant/30 relative group hidden md:block">
              <img alt="View from Room" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWP1MZEpVftau11L0RdIybBNFFuJ7K09XYfCxiWnnnQMKzgk0hEeK3sO6NU6HUTf1Rg9ozPU6ct5ZPDgFdAV5iLlUzm2aNyaefpowxfXPcuxMc7Fv17QVh4wCz_mhSjrVnfSBxGVbLlnCme3EMy6mFCJ-Ofh6lAeoxAsdyC7W4mrdbcMqZ4vFTUJg85kZPuJtbB_gfXwADFJ5IbGItmCpXFUssvYjpJuFIgDZV5CWNIldfLP6xUVqX0PE4vrmaHBSUA9s8gmAhT2o"/>
            </div>
          </div>

          {/* Room Description & Amenities */}
          <div className="glass-panel border border-outline-variant/30 rounded-xl p-6">
            <h3 className="font-headline-md text-headline-md text-on-surface mb-4">About this space</h3>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-6">
              Designed for high-stakes executive briefings, The Obsidian Suite features cutting-edge acoustics, dual 8K telepresence displays, and a zero-glare environmental lighting system. The integrated AI concierge can manage atmospheric controls and presentation pacing seamlessly.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-container-low border border-outline-variant/20">
                <span className="material-symbols-outlined text-primary text-[20px]">videocam</span>
                <span className="font-label-md text-label-md text-on-surface">Dual 8K Displays</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-container-low border border-outline-variant/20">
                <span className="material-symbols-outlined text-primary text-[20px]">wifi_tethering</span>
                <span className="font-label-md text-label-md text-on-surface">Dedicated Fiber</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-container-low border border-outline-variant/20">
                <span className="material-symbols-outlined text-primary text-[20px]">coffee_maker</span>
                <span className="font-label-md text-label-md text-on-surface">Catering Prep</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-container-low border border-outline-variant/20">
                <span className="material-symbols-outlined text-primary text-[20px]">air</span>
                <span className="font-label-md text-label-md text-on-surface">Climate Control</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-container-low border border-outline-variant/20">
                <span className="material-symbols-outlined text-primary text-[20px]">lock</span>
                <span className="font-label-md text-label-md text-on-surface">Secure Audio</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Booking Form & Timeline */}
        <div className="xl:col-span-5 space-y-6">
          {/* Booking Form Card */}
          <div className="glass-panel border border-outline-variant/50 rounded-xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative overflow-hidden">
            {/* Subtle top-left shine effect */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-white/10 to-transparent"></div>
            <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-white/10 to-transparent"></div>
            
            <h3 className="font-headline-md text-headline-md text-on-surface mb-6 flex items-center justify-between">
              Initialize Booking
              <span className="material-symbols-outlined text-primary">edit_calendar</span>
            </h3>
            
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              {/* Meeting Title */}
              <div className="space-y-2">
                <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Event Designation</label>
                <input className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-outline-variant" placeholder="e.g., Q3 Strategy Alignment" type="text"/>
              </div>
              
              {/* Date Picker (Visual Simulation) */}
              <div className="space-y-2">
                <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Select Cycle</label>
                <button className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface flex items-center justify-between hover:border-primary/50 transition-colors group" type="button">
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors text-[20px]">calendar_month</span>
                    October 24, 2024
                  </span>
                  <span className="material-symbols-outlined text-outline-variant text-[20px]">expand_more</span>
                </button>
              </div>

              {/* Time Range Slider (High-End Visual) */}
              <div className="space-y-4 pt-2">
                <div className="flex justify-between items-center">
                  <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Temporal Window</label>
                  <span className="font-body-md text-body-md text-primary font-bold">14:00 - 16:00</span>
                </div>
                
                {/* Custom Track Visual */}
                <div className="relative h-12 flex items-center w-full px-2">
                  <div className="absolute left-0 right-0 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                    <div className="absolute left-[30%] right-[40%] h-full bg-primary"></div>
                  </div>
                  <div className="absolute left-[30%] -ml-3 w-6 h-6 rounded-full bg-surface border-2 border-primary shadow-[0_0_10px_rgba(190,198,224,0.3)] cursor-pointer hover:scale-110 transition-transform flex items-center justify-center z-10">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  </div>
                  <div className="absolute right-[40%] -mr-3 w-6 h-6 rounded-full bg-surface border-2 border-primary shadow-[0_0_10px_rgba(190,198,224,0.3)] cursor-pointer hover:scale-110 transition-transform flex items-center justify-center z-10">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  </div>
                </div>
                
                {/* Time Labels */}
                <div className="flex justify-between text-outline-variant font-label-sm text-label-sm px-2">
                  <span>08:00</span>
                  <span>12:00</span>
                  <span>18:00</span>
                </div>
              </div>

              {/* Participants */}
              <div className="space-y-2 pt-2">
                <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Personnel Invite</label>
                <div className="p-2 border border-outline-variant rounded-lg bg-surface-container-lowest focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all flex flex-wrap gap-2">
                  {/* Tags */}
                  <div className="flex items-center gap-1.5 bg-surface-container-high px-2 py-1 rounded-md border border-outline-variant/50">
                    <img alt="S. Connor" className="w-5 h-5 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcGbgdVR8iA93LPQ8BGSwrwH9CdJZcl-TMsF88_GCdZP1C8wTA-pDYisalk7NQZ5uf7z2os_bP4V6wfjFcXwrG4oYsH6b5dSQiLpxFqONl5hXHt1LX_KuSaTVNjvxKpWmCqMi9XmPZhDRhMrVq5br9KEPA6fNDuGS4Pv-s5xblF4uDC0yyXqbN4fXRP-VjjGn8EEMZObyHGkEYQIN4cxYphhvY1IEd8pHkP90KUVNlQXqo0CdyrJmG9xp0VHVn6ljcH5b-o7DdYJo"/>
                    <span className="font-label-sm text-label-sm text-on-surface">S. Connor</span>
                    <button className="text-on-surface-variant hover:text-error ml-1" type="button"><span className="material-symbols-outlined text-[14px]">close</span></button>
                  </div>
                  <div className="flex items-center gap-1.5 bg-surface-container-high px-2 py-1 rounded-md border border-outline-variant/50">
                    <img alt="J. Reese" className="w-5 h-5 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIEridn3r2OY9aQNNECvrxP3AOV_hluxmawOsGGqluzBGCLW39Ecua-UOuz83ObHq1Sou_r0yfYBpo1ziEAMP8_mHGDUDie955XBQrG7mK9JmUg6IVHWJ9hzteaFMKzXs_JSvkgeRHAhGkaRd3wmNsGcE5IGMCPPWNtBZ2AKMJbIrtBFQeayFlnlyg9mB3OA0xaLlcv2f-ViyFtSvoYFSWDiKqiPGPGKJlsPtXuWp2Q78K3056EPXYHrTR9fPLQMhjq2RzdiCx46o"/>
                    <span className="font-label-sm text-label-sm text-on-surface">J. Reese</span>
                    <button className="text-on-surface-variant hover:text-error ml-1" type="button"><span className="material-symbols-outlined text-[14px]">close</span></button>
                  </div>
                  {/* Input */}
                  <input className="bg-transparent border-none focus:ring-0 text-on-surface font-body-md text-body-md flex-1 min-w-[120px] placeholder:text-outline-variant outline-none" placeholder="Add email or ID..." type="text"/>
                </div>
              </div>

              {/* Submit CTA */}
              <button className="w-full mt-6 bg-primary text-primary-container font-headline-md text-[16px] py-4 rounded-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(190,198,224,0.2)]" type="submit">
                Confirm Reservation
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
            </form>
          </div>

          {/* Availability Timeline Visual */}
          <div className="p-6 rounded-xl border border-outline-variant/20 bg-surface-container-low">
            <h4 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-4">Daily Schedule Vector</h4>
            
            <div className="relative h-16 w-full flex bg-surface-container-highest rounded-lg overflow-hidden border border-outline-variant/30">
              {/* Grid lines (background) */}
              <div className="absolute inset-0 flex justify-between px-4 z-0">
                <div className="w-px h-full bg-outline-variant/20"></div>
                <div className="w-px h-full bg-outline-variant/20"></div>
                <div className="w-px h-full bg-outline-variant/20"></div>
                <div className="w-px h-full bg-outline-variant/20"></div>
              </div>
              
              {/* Blocks */}
              {/* 08:00 - 10:00 (Busy) */}
              <div className="relative h-full bg-surface-variant w-[20%] border-r border-outline-variant/50 flex items-center justify-center z-10 group cursor-not-allowed">
                <span className="material-symbols-outlined text-outline-variant text-[16px] opacity-50">block</span>
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 hidden group-hover:block whitespace-nowrap bg-inverse-surface text-inverse-on-surface font-label-sm px-2 py-1 rounded shadow-lg z-50">
                  08:00 - 10:00 (Maintenance)
                </div>
              </div>
              
              {/* 10:00 - 12:00 (Available) */}
              <div className="relative h-full w-[20%] border-r border-outline-variant/50 hover:bg-primary/5 transition-colors z-10 group cursor-pointer">
                <div className="absolute bottom-full mb-2 hidden group-hover:block whitespace-nowrap bg-primary text-primary-container font-label-sm px-2 py-1 rounded shadow-lg z-50">
                  10:00 - 12:00 (Available)
                </div>
              </div>
              
              {/* 12:00 - 14:00 (Busy - Selected style for visual variety) */}
              <div className="relative h-full w-[20%] border-r border-outline-variant/50 bg-primary/10 border-b-2 border-b-primary z-10 group">
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <span className="font-label-sm text-[10px] text-primary uppercase">Board Mtg</span>
                </div>
              </div>
              
              {/* 14:00 - 16:00 (Current Selection) */}
              <div className="relative h-full w-[20%] bg-primary border-r border-outline-variant/50 z-10 shadow-[0_0_12px_rgba(190,198,224,0.4)] flex items-center justify-center">
                <span className="material-symbols-outlined text-primary-container text-[20px]">done</span>
              </div>
              
              {/* 16:00 - 18:00 (Available) */}
              <div className="relative h-full w-[20%] hover:bg-primary/5 transition-colors z-10 group cursor-pointer"></div>
            </div>
            
            {/* Legend */}
            <div className="flex gap-6 mt-4 justify-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-surface-variant border border-outline-variant"></div>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Occupied</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-transparent border border-outline-variant"></div>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Open</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-primary"></div>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Selected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default RoomDetails;
