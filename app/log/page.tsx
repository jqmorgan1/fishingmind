'use client'

import { useState, useEffect } from 'react';
import Link from "next/link";
import { Plus, Fish, Ruler, Calendar, MapPin, Thermometer, Cloud, Trash2, Edit } from "lucide-react";

interface FishingLog {
  id: number;
  fishType: string;
  weight: string;
  length: string;
  spot: string;
  date: string;
  time: string;
  weather: string;
  bait: string;
  photo?: string;
}

export default function LogPage() {
  const [logs, setLogs] = useState<FishingLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 从本地存储加载
    const savedLogs = localStorage.getItem('fishing_logs');
    if (savedLogs) {
      try {
        setLogs(JSON.parse(savedLogs));
      } catch (e) {
        console.error('Failed to parse logs', e);
      }
    }
    setLoading(false);
  }, []);

  const deleteLog = (id: number) => {
    if (confirm('确定删除这条记录吗？')) {
      const newLogs = logs.filter(log => log.id !== id);
      setLogs(newLogs);
      localStorage.setItem('fishing_logs', JSON.stringify(newLogs));
    }
  };

  const totalFish = logs.length;
  const totalWeight = logs.reduce((acc, log) => acc + (parseFloat(log.weight) || 0), 0);

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6B35]"></div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* 头部 */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">🎣 我的渔获</h1>
        <Link 
          href="/log/add"
          className="bg-[#FF6B35] text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
        >
          <Plus className="h-4 w-4" />
          添加
        </Link>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-[#1A2832] rounded-xl p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-1">
            <Fish className="h-5 w-5 text-[#FF6B35]" />
            <span className="text-sm text-gray-400">捕获</span>
          </div>
          <p className="text-2xl font-bold">{totalFish} <span className="text-sm font-normal text-gray-400">条</span></p>
        </div>
        <div className="bg-[#1A2832] rounded-xl p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-1">
            <Ruler className="h-5 w-5 text-[#FF6B35]" />
            <span className="text-sm text-gray-400">总重</span>
          </div>
          <p className="text-2xl font-bold">{totalWeight.toFixed(1)} <span className="text-sm font-normal text-gray-400">kg</span></p>
        </div>
      </div>

      {/* 筛选 */}
      <div className="flex gap-2 mb-4 overflow-x-auto">
        {['全部', '翘嘴', '鲫鱼', '鲤鱼', '草鱼'].map((filter) => (
          <button
            key={filter}
            className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap ${
              filter === '全部' 
                ? 'bg-[#FF6B35] text-white' 
                : 'bg-[#1A2832] text-gray-300 border border-gray-700'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* 渔获列表 */}
      {logs.length === 0 ? (
        <div className="text-center py-12">
          <Fish className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">还没有渔获记录</p>
          <Link 
            href="/log/add"
            className="text-[#FF6B35] hover:underline"
          >
            添加第一条渔获
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {logs.map((log) => (
            <div key={log.id} className="bg-[#1A2832] rounded-xl p-4 border border-gray-700">
              <div className="flex gap-4">
                {/* 照片 */}
                <div className="w-24 h-24 bg-gray-700 rounded-lg flex-shrink-0 overflow-hidden">
                  {log.photo ? (
                    <img src={log.photo} alt={log.fishType} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Fish className="h-8 w-8 text-gray-500" />
                    </div>
                  )}
                </div>
                
                {/* 信息 */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{log.fishType}</h3>
                      <p className="text-sm text-gray-400">{log.weight}kg | {log.length}cm</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-gray-500 hover:text-[#FF6B35]">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => deleteLog(log.id)}
                        className="text-gray-500 hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {log.spot}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {log.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Thermometer className="h-3 w-3" />
                      {log.weather}
                    </div>
                    {log.bait && (
                      <div className="flex items-center gap-1">
                        🪤 {log.bait}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
