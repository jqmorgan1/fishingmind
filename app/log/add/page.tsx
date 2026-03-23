'use client'

import { useState } from 'react';
import { Fish, Camera, MapPin, Thermometer, Cloud, BugPlay, X } from 'lucide-react';

export default function AddLogPage() {
  const [formData, setFormData] = useState({
    fishType: '',
    weight: '',
    length: '',
    spot: '',
    bait: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 提交到后端
    alert('记录已保存！');
  };

  return (
    <div className="p-4">
      {/* 头部 */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">添加渔获</h1>
      </div>

      {/* 拍照区域 */}
      <div className="bg-[#1A2832] rounded-xl p-8 mb-6 border border-dashed border-gray-600 flex flex-col items-center justify-center">
        <Camera className="h-12 w-12 text-gray-500 mb-2" />
        <p className="text-gray-400 text-sm">点击拍照或上传照片</p>
        <p className="text-gray-600 text-xs mt-1">将自动识别鱼种</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 鱼种 */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">鱼种 *</label>
          <input
            type="text"
            required
            placeholder="如：翘嘴、鲫鱼、鲤鱼"
            className="w-full bg-[#1A2832] rounded-lg py-3 px-4 text-white placeholder-gray-500 border border-gray-700 focus:border-[#FF6B35] focus:outline-none"
            value={formData.fishType}
            onChange={(e) => setFormData({...formData, fishType: e.target.value})}
          />
        </div>

        {/* 体重和长度 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">体重 (kg)</label>
            <input
              type="number"
              step="0.1"
              placeholder="如：2.3"
              className="w-full bg-[#1A2832] rounded-lg py-3 px-4 text-white placeholder-gray-500 border border-gray-700 focus:border-[#FF6B35] focus:outline-none"
              value={formData.weight}
              onChange={(e) => setFormData({...formData, weight: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">长度 (cm)</label>
            <input
              type="number"
              step="0.1"
              placeholder="如：65"
              className="w-full bg-[#1A2832] rounded-lg py-3 px-4 text-white placeholder-gray-500 border border-gray-700 focus:border-[#FF6B35] focus:outline-none"
              value={formData.length}
              onChange={(e) => setFormData({...formData, length: e.target.value})}
            />
          </div>
        </div>

        {/* 钓点 */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">钓点 *</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            <input
              type="text"
              required
              placeholder="选择或输入钓点"
              className="w-full bg-[#1A2832] rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 border border-gray-700 focus:border-[#FF6B35] focus:outline-none"
              value={formData.spot}
              onChange={(e) => setFormData({...formData, spot: e.target.value})}
            />
          </div>
        </div>

        {/* 饵料 */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">饵料</label>
          <input
            type="text"
            placeholder="如：亮片、蚯蚓、玉米"
            className="w-full bg-[#1A2832] rounded-lg py-3 px-4 text-white placeholder-gray-500 border border-gray-700 focus:border-[#FF6B35] focus:outline-none"
            value={formData.bait}
            onChange={(e) => setFormData({...formData, bait: e.target.value})}
          />
        </div>

        {/* 备注 */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">备注</label>
          <textarea
            rows={3}
            placeholder="添加备注..."
            className="w-full bg-[#1A2832] rounded-lg py-3 px-4 text-white placeholder-gray-500 border border-gray-700 focus:border-[#FF6B35] focus:outline-none resize-none"
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
          />
        </div>

        {/* 自动获取的信息展示 */}
        <div className="bg-[#1A2832] rounded-lg p-4 border border-gray-700">
          <p className="text-sm text-gray-400 mb-2">📋 将自动记录：</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-1 text-gray-300">
              <Thermometer className="h-4 w-4" />
              23°C
            </div>
            <div className="flex items-center gap-1 text-gray-300">
              <Cloud className="h-4 w-4" />
              多云
            </div>
            <div className="flex items-center gap-1 text-gray-300">
              📍 获取中...
            </div>
            <div className="flex items-center gap-1 text-gray-300">
              🕐 {new Date().toLocaleTimeString('zh-CN', {hour: '2-digit', minute:'2-digit'})}
            </div>
          </div>
        </div>

        {/* 提交按钮 */}
        <button
          type="submit"
          className="w-full bg-[#FF6B35] text-white py-4 rounded-lg font-semibold hover:bg-[#e55a2b] transition-colors"
        >
          保存记录
        </button>
      </form>
    </div>
  );
}
