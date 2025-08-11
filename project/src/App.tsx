import React, { useState } from 'react';
import { Search, Download, MoreHorizontal, LogOut, ChevronDown, RefreshCw } from 'lucide-react';

interface DNSRecord {
  name: string;
  type: string;
  ttl: number;
  values: string[];
}

function App() {
  const [selectedZone, setSelectedZone] = useState('mithittest123.com. (Z10289442HMQ36I85BABC)');
  const [searchPrefix, setSearchPrefix] = useState('');
  const [showActionsMenu, setShowActionsMenu] = useState<number | null>(null);

  const dnsRecords: DNSRecord[] = [
    {
      name: 'mithittest123.com.',
      type: 'NS',
      ttl: 172800,
      values: [
        'ns-157.awsdns-19.com.',
        'ns-1587.awsdns-06.co.uk.',
        'ns-619.awsdns-13.net.',
        'ns-1366.awsdns-42.org.'
      ]
    },
    {
      name: 'mithittest123.com.',
      type: 'SOA',
      ttl: 900,
      values: [
        'ns-157.awsdns-19.com. awsdns-hostmaster.amazon.com. 1 7200 900 1209600 86400'
      ]
    },
    {
      name: 'customer1.mithittest123.com.',
      type: 'A',
      ttl: 300,
      values: ['192.168.1.60']
    }
  ];

  const zones = [
    'mithittest123.com. (Z10289442HMQ36I85BABC)',
    'example.com. (Z1D633PJN98FT9)',
    'test-domain.net. (Z2FDTNDATAQYW2)'
  ];

  const getRecordTypeColor = (type: string) => {
    switch (type) {
      case 'NS': return 'bg-blue-900/30 text-blue-300 border border-blue-700/50';
      case 'SOA': return 'bg-green-900/30 text-green-300 border border-green-700/50';
      case 'A': return 'bg-purple-900/30 text-purple-300 border border-purple-700/50';
      case 'CNAME': return 'bg-orange-900/30 text-orange-300 border border-orange-700/50';
      case 'MX': return 'bg-red-900/30 text-red-300 border border-red-700/50';
      default: return 'bg-gray-700/30 text-gray-300 border border-gray-600/50';
    }
  };

  const handleDownload = () => {
    const csvContent = dnsRecords.map(record => 
      `${record.name},${record.type},${record.ttl},"${record.values.join('; ')}"`
    ).join('\n');
    
    const blob = new Blob([`Record Name,Type,TTL,Values\n${csvContent}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dns-records.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-600 rounded-lg p-2">
                <Search className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-white">Route 53 DNS Viewer</h1>
            </div>
            <button className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 border border-gray-600">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-2">Search DNS Records</h2>
          <p className="text-gray-400 mb-6">Select a hosted zone and enter a prefix to filter records</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Hosted Zone Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Hosted Zone</label>
              <div className="relative">
                <select 
                  value={selectedZone}
                  onChange={(e) => setSelectedZone(e.target.value)}
                  className="block w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                >
                  {zones.map((zone) => (
                    <option key={zone} value={zone}>{zone}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-300 pointer-events-none" />
              </div>
            </div>

            {/* Search Prefix */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Search Prefix</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchPrefix}
                  onChange={(e) => setSearchPrefix(e.target.value)}
                  placeholder="e.g., www, api, subdomain"
                  className="block w-full bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg px-4 py-3 pr-12 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-300" />
              </div>
              <p className="text-sm text-gray-400 mt-1">Leave empty to show all records</p>
            </div>
          </div>

          <div className="mt-6">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2 shadow-lg">
              <RefreshCw className="h-4 w-4" />
              <span>Search Records</span>
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-white">DNS Records ({dnsRecords.length} found)</h3>
              <p className="text-sm text-gray-400">Showing records for {selectedZone.split(' ')[0]}</p>
            </div>
            <button 
              onClick={handleDownload}
              className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-lg"
            >
              <Download className="h-4 w-4" />
              <span>Download CSV</span>
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Record Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    TTL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Values
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {dnsRecords.map((record, index) => (
                  <tr key={index} className="hover:bg-gray-700/50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {record.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRecordTypeColor(record.type)}`}>
                        {record.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {record.ttl.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      <div className="space-y-1">
                        {record.values.map((value, i) => (
                          <div key={i} className="bg-gray-700 border border-gray-600 px-3 py-1 rounded text-xs font-mono text-gray-200">
                            {value}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="relative">
                        <button 
                          onClick={() => setShowActionsMenu(showActionsMenu === index ? null : index)}
                          className="text-gray-400 hover:text-gray-200 p-2 rounded-full hover:bg-gray-700 transition-colors duration-200"
                        >
                          <MoreHorizontal className="h-5 w-5" />
                        </button>
                        
                        {showActionsMenu === index && (
                          <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-xl border border-gray-600 z-10">
                            <div className="py-1">
                              <button className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white transition-colors duration-150">
                                Edit Record
                              </button>
                              <button className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white transition-colors duration-150">
                                Copy Record
                              </button>
                              <button className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white transition-colors duration-150">
                                View Details
                              </button>
                              <hr className="my-1 border-gray-600" />
                              <button className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-colors duration-150">
                                Delete Record
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;