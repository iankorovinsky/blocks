  <div className="space-y-2 relative">
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 rounded-full bg-pink-400" />
      <label className="text-sm text-gray-400">Structure</label>
    </div>
    {storageVariable ? (
      <div className="w-full bg-[#2a2a2a] rounded-md px-3 py-1.5 text-sm border border-gray-700">
        {storageVariable}
      </div>
    ) : (
      <div className="w-full bg-[#2a2a2a] rounded-md px-3 py-1.5 text-sm border border-gray-800 text-gray-500">
        Connect to StructNode
      </div>
    )}
  </div> 