import React from 'react'
import Link from 'next/link'
import { MoreHorizontal } from 'lucide-react'

// --- Sub-components ---

const SalesOverviewChart = () => {
  return (
    <div className="bar-chart-container">
      {/* Mocking a Bar Chart with CSS */}
      {[60, 75, 50, 65, 45, 80, 55, 70].map((h, i) => (
        <div key={i} className="bar-group">
          <div className="bar bar-primary" style={{ height: `${h}%` }}></div>
          <div className="bar bar-secondary" style={{ height: `${h - 20}%` }}></div>
        </div>
      ))}
    </div>
  )
}

const YearlyBreakup = () => {
  return (
    <div className="flex flex-row items-center gap-4">
      <div className="flex-1">
        <h3 className="text-2xl font-bold text-[#2A3547]">$36,358</h3>
        <div className="flex items-center gap-2 mt-2 mb-4">
          <span className="bg-[#E6FFFA] text-[#13DEB9] text-xs font-bold px-2 py-1 rounded-full">
            +9%
          </span>
          <span className="text-[#5A6A85] text-sm">last year</span>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#5D87FF]"></span>
            <span className="text-xs text-[#5A6A85]">2023</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#EAEFF4]"></span>
            <span className="text-xs text-[#5A6A85]">2022</span>
          </div>
        </div>
      </div>
      <div className="donut-chart-container">
        {/* Simple CSS Donut */}
        <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
          <path
            className="text-[#EAEFF4]"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="text-[#5D87FF]"
            strokeDasharray="70, 100"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
          />
        </svg>
      </div>
    </div>
  )
}

const MonthlyEarnings = () => {
  return (
    <div>
      <div className="mb-4">
        <h3 className="text-2xl font-bold text-[#2A3547]">$6,820</h3>
        <div className="flex items-center gap-2 mt-2">
          <span className="bg-[#FBF2EF] text-[#FA896B] text-xs font-bold px-2 py-1 rounded-full">
            +9%
          </span>
          <span className="text-[#5A6A85] text-sm">last year</span>
        </div>
      </div>
      <div className="h-[60px]">
        {/* Wavy Sparkline */}
        <svg viewBox="0 0 100 25" className="w-full h-full" preserveAspectRatio="none">
          <path
            d="M0,25 C20,25 20,10 40,10 C60,10 60,20 80,20 C100,20 100,5 120,5"
            fill="none"
            stroke="#5D87FF"
            strokeWidth="3"
          />
          <path
            d="M0,25 C20,25 20,10 40,10 C60,10 60,20 80,20 C100,20 100,5 120,5 L120,25 L0,25"
            fill="rgba(93, 135, 255, 0.1)"
            stroke="none"
          />
        </svg>
      </div>
    </div>
  )
}

const RecentTransactions = () => {
  const transactions = [
    { time: '09:30 am', text: 'Payment received from John Doe of $385.90', color: '#5D87FF' },
    { time: '10:00 am', text: 'New sale recorded #ML-3467', color: '#13DEB9' },
    { time: '12:00 am', text: 'Payment was made of $64.95 to Michael', color: '#FFAE1F' },
    { time: '09:30 am', text: 'New sale recorded #ML-3467', color: '#FA896B' },
    { time: '09:30 am', text: 'Project meeting', color: '#5D87FF' },
  ]

  return (
    <div className="mt-4">
      {transactions.map((t, i) => (
        <div key={i} className="timeline-item">
          <div className="timeline-time">{t.time}</div>
          <div className="timeline-dot" style={{ backgroundColor: t.color, boxShadow: `0 0 0 2px ${t.color}` }}></div>
          <div className="timeline-content">{t.text}</div>
        </div>
      ))}
    </div>
  )
}

const ProductPerformance = ({ products = [] }: { products?: any[] }) => {
  // If no products passed (yet), show loading or empty state
  // But for now, we'll try to fetch or receive props.
  // Ideally this component receives data from the parent.
  
  const displayProducts = products.length > 0 ? products : [
      { id: 1, name: 'Sunil Joshi', role: 'Web Designer', project: 'Elite Admin', priority: 'Low', budget: '$3.9k', color: 'badge-low' },
      { id: 2, name: 'Andrew McDownland', role: 'Project Manager', project: 'Real Homes WP Theme', priority: 'Medium', budget: '$24.5k', color: 'badge-medium' },
  ]

  return (
    <div className="overflow-x-auto">
      <table className="mod-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Price</th>
            <th>Status</th>
            <th>Featured</th>
          </tr>
        </thead>
        <tbody>
          {displayProducts.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>
                <div className="flex flex-col">
                  <span className="font-bold text-[#2A3547]">{p.name}</span>
                </div>
              </td>
              <td className="text-[#5A6A85]">${p.price}</td>
              <td>
                <span className={`mod-badge ${p.status === 'active' ? 'badge-high' : 'badge-low'}`}>{p.status}</span>
              </td>
              <td className="font-bold text-[#2A3547]">{p.featured ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// --- Main Dashboard Component ---

export const CustomDashboard = async () => {
    // In Payload 3.0 (and Next.js App Router), we can fetch data directly in server components.
    // However, the exact way to fetch local API in Payload depends on context.
    // We will use the 'payload' local API if available or fetch from REST.
    
    // For now, to keep it simple and safe without breaking build if payload local API isn't exposed here:
    // We will assume this is a Server Component.
    
    let products = []
    let totalSales = 0;
    
    try {
        const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
        
        // Fetch products
        const productsRes = await fetch(`${baseUrl}/api/products?limit=5&sort=-createdAt`, {
            cache: 'no-store'
        })
        if (productsRes.ok) {
            const data = await productsRes.json()
            products = data.docs
        }
        
        // Fetch total sales (mock calculation from products for now as we don't have Orders collection yet)
        // In real app, fetch from Orders collection
        if (products.length > 0) {
             totalSales = products.reduce((acc: number, p: any) => acc + (p.price || 0), 0);
        }

    } catch (e) {
        console.error("Failed to fetch data for dashboard", e)
    }

  return (
    <div className="modernize-dashboard">
      {/* Top Row: Charts */}
      <div className="mod-grid-top">
        {/* Main Chart */}
        <div className="mod-card">
          <div className="mod-card-header">
            <div>
              <h2 className="mod-card-title">Sales Overview</h2>
            </div>
            <select className="mod-select">
              <option>This Month</option>
            </select>
          </div>
          <SalesOverviewChart />
        </div>

        {/* Side Stats */}
        <div className="mod-grid-right-col">
          <div className="mod-card">
            <div className="mod-card-header">
              <h2 className="mod-card-title">Total Revenue</h2>
            </div>
            <div className="flex flex-row items-center gap-4">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-[#2A3547]">${totalSales.toLocaleString()}</h3>
                <div className="flex items-center gap-2 mt-2 mb-4">
                  <span className="bg-[#E6FFFA] text-[#13DEB9] text-xs font-bold px-2 py-1 rounded-full">
                    Active
                  </span>
                  <span className="text-[#5A6A85] text-sm">Products Value</span>
                </div>
              </div>
               <div className="donut-chart-container">
                {/* Simple CSS Donut */}
                <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                  <path
                    className="text-[#EAEFF4]"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="text-[#5D87FF]"
                    strokeDasharray="70, 100"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="mod-card">
            <div className="mod-card-header">
              <h2 className="mod-card-title">Monthly Earnings</h2>
              <div className="w-8 h-8 rounded-full bg-[#5D87FF] flex items-center justify-center text-white font-bold">$</div>
            </div>
            <MonthlyEarnings />
          </div>
        </div>
      </div>

      {/* Bottom Row: Data */}
      <div className="mod-grid-bottom">
        {/* Recent Transactions */}
        <div className="mod-card">
          <div className="mod-card-header">
            <h2 className="mod-card-title">Recent Transactions</h2>
          </div>
          <RecentTransactions />
        </div>

        {/* Product Performance */}
        <div className="mod-card">
          <div className="mod-card-header">
            <h2 className="mod-card-title">Latest Products</h2>
            <select className="mod-select">
              <option>Recent</option>
            </select>
          </div>
          <ProductPerformance products={products} />
        </div>
      </div>
    </div>
  )
}
