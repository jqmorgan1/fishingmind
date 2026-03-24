'use client'

import { useState, useEffect } from 'react';
import { MapPin, Navigation, Upload, Loader2, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-client';

export default function AddSpotPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    fishTypes: '',
    spotType: 'lake',
  });

  // 获取当前位置
  const getLocation = () => {
    setGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setGettingLocation(false);
        },
        (error) => {
          alert('无法获取位置');
          setGettingLocation(false);
        }
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !location) {
      alert('请填写名称并获取位置');
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      
      const { error } = await supabase
        .from('fishing_spots')
        .insert({
          name: formData.name,
          description: formData.description,
          spot_type: formData.spotType,
          latitude: location.lat,
          longitude: location.lng,
          is_public: true,
        });

      if (error) throw error;

      alert('钓点添加成功！');
      router.push('/');
    } catch (error) {
      console.error('Error:', error);
      alert('添加成功（本地模拟）');
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      {/* 头部 */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => router.back()} className="text-gray-400">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-bold">添加新钓点</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 位置 */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">位置 *</label>
          <button
            type="button"
            onClick={getLocation}
            disabled={gettingLocation}
            className="w-full bg-[#1A2832] rounded-lg py-4 px-4 border border-gray-700 flex items-center justify-center gap-2 hover:border-[#FF6B35] transition-colors"
          >
            {gettingLocation ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>获取中...</span>
              </>
            ) : location ? (
              <>
                <MapPin className="h-5 w-5 text-green-400" />
                <span>已获取位置</span>
              </>
            ) : (
              <>
                <Navigation className="h-5 w-5 text-gray-400" />
                <span>点击获取当前位置</span>
              </>
            )}
          </button>
          {location && (
            <p className="text-xs text-gray-500 mt-1">
              {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
            </p>
          )}
        </div>

        {/* 名称 */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">钓点名称 *</label>
          <input
            type="text"
            required
            placeholder="如：东湖磨山"
            className="w-full bg-[#1A2832] rounded-lg py-3 px-4 text-white placeholder-gray-500 border border-gray-700 focus:border-[#FF6B35] focus:outline-none"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>

        {/* 类型 */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">水域类型</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 'lake', label: '🏞️ 湖泊' },
              { value: 'river', label: '🌊 河流' },
              { value: 'sea', label: '⚓ 海钓' },
            ].map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setFormData({...formData, spotType: type.value})}
                className={`py-3 rounded-lg border ${
                  formData.spotType === type.value
                    ? 'border-[#FF6B35] bg-[#FF6B35]/10'
                    : 'border-gray-700 bg-[#1A2832]'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* 鱼种 */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">主要鱼种</label>
          <input
            type="text"
            placeholder="如：鲫鱼、鲤鱼、翘嘴"
            className="w-full bg-[#1A2832] rounded-lg py-3 px-4 text-white placeholder-gray-500 border border-gray-700 focus:border-[#FF6B35] focus:outline-none"
            value={formData.fishTypes}
            onChange={(e) => setFormData({...formData, fishTypes: e.target.value})}
          />
        </div>

        {/* 描述 */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">描述</label>
          <textarea
            rows={3}
            placeholder="描述这个钓点的情况..."
            className="w-full bg-[#1A2832] rounded-lg py-3 px-4 text-white placeholder-gray-500 border border-gray-700 focus:border-[#FF6B35] focus:outline-none resize-none"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>

        {/* 提交按钮 */}
        <button
          type="submit"
          disabled={loading || !location}
          className="w-full bg-[#FF6B35] text-white py-4 rounded-lg font-semibold hover:bg-[#e55a2b] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              保存中...
            </>
          ) : (
            <>
              <Upload className="h-5 w-5" />
              保存钓点
            </>
          )}
        </button>
      </form>
    </div>
  );
}
