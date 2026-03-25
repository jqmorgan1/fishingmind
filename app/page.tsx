'use client'

import { useState, useEffect } from 'react';
import Link from "next/link";
import { MapPin, Star, Clock, Navigation, Search, Fish, Layers, List, Filter } from "lucide-react";
import dynamic from 'next/dynamic';
import { createClient } from '@/lib/supabase-client';

// 动态导入地图（避免SSR问题）
const FishingMap = dynamic(() => import('@/components/FishingMap'), { 
  ssr: false,
  loading: () => <div className="h-64 bg-[#1A2832] rounded-xl flex items-center justify-center text-gray-500">地图加载中...</div>
});

// 模拟钓点数据
const mockSpots = [
  { id: '1', name: "东湖", latitude: 30.55, longitude: 114.35, fish_types: "鲫鱼/鲤鱼/翘嘴", rating: 4.5 },
  { id: '2', name: "长江二桥", latitude: 30.60, longitude: 114.25, fish_types: "翘嘴/鳜鱼", rating: 4.8 },
  { id: '3', name: "墨水湖", latitude: 30.52, longitude: 114.42, fish_types: "草鱼/青鱼", rating: 4.2 },
  { id: '4', name: "南湖", latitude: 30.50, longitude: 114.45, fish_types: "鲢鱼/鳙鱼", rating: 4.0 },
  { id: '5', name: "汉江", latitude: 30.58, longitude: 114.17, fish_types: "鲫鱼/黄颡", rating: 4.3 },
]

export default function Home() {
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [spots, setSpots] = useState(mockSpots);
  const [filter, setFilter] = useState('all');
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    // 获取用户位置
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        () => {
          // 默认武汉
          setUserLocation([30.58, 114.27]);
        }
      );
    }
  }, []);

  // 计算距离（简化版）
  const calculateDistance = (lat: number, lng: number): string | undefined => {
    if (!userLocation) return undefined;
    // 简化计算
    const dist = Math.sqrt(
      Math.pow((lat - userLocation[0]) * 111, 2) + 
      Math.pow((lng - userLocation[1]) * 111, 2)
    );
    return dist < 1 ? `${(dist * 1000).toFixed(0)}m` : `${dist.toFixed(1)}km`;
  };

  // 添加距离
  const spotsWithDistance = spots.map(spot => ({
    ...spot,
    distance: calculateDistance(spot.latitude, spot.longitude)
  }));

  // 筛选
  const filteredSpots = filter === 'all' 
    ? spotsWithDistance 
    : spotsWithDistance.filter(s => s.fish_types.includes(filter));

  return (
    <div className="p-4">
      {/* 顶部标题 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Fish className="h-8 w-8 text-[#FF6B35]" />
          <h1 className="text-2xl font-bold text-[#FF6B35]">钓鱼脑</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">
            📍 {userLocation ? '武汉' : '定位中...'}
          </span>
        </div>
      </div>

      {/* 搜索栏 */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input 
          type="text" 
          placeholder="搜索钓点..."
          className="w-full bg-[#1A2832] rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 border border-gray-700 focus:border-[#FF6B35] focus:outline-none"
        />
      </div>

      {/* 视图切换和筛选 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-full text-xs ${
              filter === 'all' ? 'bg-[#FF6B35] text-white' : 'bg-[#1A2832] text-gray-400 border border-gray-700'
            }`}
          >
            全部
          </button>
          <button
            onClick={() => setFilter('翘嘴')}
            className={`px-3 py-1.5 rounded-full text-xs ${
              filter === '翘嘴' ? 'bg-[#FF6B35] text-white' : 'bg-[#1A2832] text-gray-400 border border-gray-700'
            }`}
          >
            翘嘴
          </button>
          <button
            onClick={() => setFilter('鲫鱼')}
            className={`px-3 py-1.5 rounded-full text-xs ${
              filter === '鲫鱼' ? 'bg-[#FF6B35] text-white' : 'bg-[#1A2832] text-gray-400 border border-gray-700'
            }`}
          >
            鲫鱼
          </button>
        </div>
        
        <div className="flex bg-[#1A2832] rounded-lg p-1">
          <button
            onClick={() => setViewMode('map')}
            className={`p-2 rounded ${viewMode === 'map' ? 'bg-[#FF6B35] text-white' : 'text-gray-400'}`}
          >
            <Layers className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded ${viewMode === 'list' ? 'bg-[#FF6B35] text-white' : 'text-gray-400'}`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 地图/列表视图 */}
      {viewMode === 'map' ? (
        <div className="h-[calc(100vh-320px)] min-h-[300px] rounded-xl overflow-hidden mb-4">
          <FishingMap spots={filteredSpots} center={userLocation || [30.58, 114.27]} />
        </div>
      ) : (
        /* 列表视图 */
        <div className="space-y-3 mb-4 max-h-[calc(100vh-320px)] overflow-y-auto">
          {filteredSpots.map((spot) => (
            <Link 
              href={`/spot/${spot.id}`}
              key={spot.id}
              className="block bg-[#1A2832] rounded-xl p-4 border border-gray-700 hover:border-[#FF6B35] transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-lg">{spot.name}</h3>
                  <p className="text-sm text-gray-400 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {spot.distance || '<1km'}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-yellow-400">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="font-medium">{spot.rating}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-1 bg-[#1A5F2A] rounded text-xs text-white">
                  {spot.fish_types}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* 统计信息 */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#1A2832] rounded-xl p-3 border border-gray-700 text-center">
          <p className="text-xl font-bold text-[#FF6B35]">{filteredSpots.length}</p>
          <p className="text-xs text-gray-400">附近钓点</p>
        </div>
        <div className="bg-[#1A2832] rounded-xl p-3 border border-gray-700 text-center">
          <p className="text-xl font-bold text-green-400">12</p>
          <p className="text-xs text-gray-400">今日渔获</p>
        </div>
        <div className="bg-[#1A2832] rounded-xl p-3 border border-gray-700 text-center">
          <p className="text-xl font-bold text-blue-400">78</p>
          <p className="text-xs text-gray-400">活跃钓友</p>
        </div>
      </div>
    </div>
  );
}
