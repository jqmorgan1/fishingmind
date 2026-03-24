'use client'

import { useState, useRef } from 'react';
import { Fish, Camera, MapPin, Thermometer, Cloud, BugPlay, X, Upload, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase-client';
import { useRouter } from 'next/navigation';

export default function AddLogPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    fishType: '',
    weight: '',
    length: '',
    spot: '',
    bait: '',
    notes: '',
  });

  // 处理图片选择
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 移除图片
  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 必须上传照片
    if (!imageFile) {
      alert('请先上传渔获照片！');
      return;
    }
    
    if (!formData.fishType || !formData.spot) {
      alert('请填写鱼种和钓点！');
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      
      // 1. 上传图片
      let photoUrl = '';
      if (imageFile) {
        const fileName = `${Date.now()}-${imageFile.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('fishing-logs')
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;
        
        // 获取公开URL
        const { data: { publicUrl } } = supabase.storage
          .from('fishing-logs')
          .getPublicUrl(fileName);
        photoUrl = publicUrl;
      }

      // 2. 保存记录到数据库
      const { error: insertError } = await supabase
        .from('fishing_logs')
        .insert({
          fish_type: formData.fishType,
          weight: formData.weight ? parseFloat(formData.weight) : null,
          length: formData.length ? parseFloat(formData.length) : null,
          spot_name: formData.spot,
          bait: formData.bait || null,
          notes: formData.notes || null,
          photo_url: photoUrl,
          weather: '多云 23°C',
          temperature: 23,
          location: '获取中...',
        });

      if (insertError) throw insertError;

      alert('渔获记录成功！');
      router.push('/log');
    } catch (error) {
      console.error('Error saving log:', error);
      // 如果是数据库错误（还没建表），先用本地存储模拟
      const logs = JSON.parse(localStorage.getItem('fishing_logs') || '[]');
      logs.unshift({
        id: Date.now(),
        ...formData,
        photo: imagePreview,
        date: new Date().toISOString(),
        weather: '多云 23°C',
      });
      localStorage.setItem('fishing_logs', JSON.stringify(logs));
      alert('记录已保存！（本地模式）');
      router.push('/log');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      {/* 头部 */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">添加渔获</h1>
        <span className="text-red-400 text-sm">* 必须拍照</span>
      </div>

      {/* 拍照/上传区域 - 必须的！ */}
      <div 
        onClick={() => fileInputRef.current?.click()}
        className="bg-[#1A2832] rounded-xl p-8 mb-6 border-2 border-dashed border-gray-600 flex flex-col items-center justify-center cursor-pointer hover:border-[#FF6B35] transition-colors"
      >
        {imagePreview ? (
          <div className="relative w-full">
            <img 
              src={imagePreview} 
              alt="渔获" 
              className="w-full h-64 object-cover rounded-lg"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeImage();
              }}
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="absolute bottom-2 left-2 bg-black/50 px-3 py-1 rounded-full text-xs">
              点击更换照片
            </div>
          </div>
        ) : (
          <>
            <Camera className="h-12 w-12 text-gray-500 mb-2" />
            <p className="text-gray-400 text-sm">点击拍照或上传照片</p>
            <p className="text-red-400 text-xs mt-2">* 必须上传渔获照片</p>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleImageChange}
          className="hidden"
        />
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
            rows={2}
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
              📍 获取GPS定位中...
            </div>
            <div className="flex items-center gap-1 text-gray-300">
              🕐 {new Date().toLocaleTimeString('zh-CN', {hour: '2-digit', minute:'2-digit'})}
            </div>
          </div>
        </div>

        {/* 提交按钮 */}
        <button
          type="submit"
          disabled={loading || !imagePreview}
          className="w-full bg-[#FF6B35] text-white py-4 rounded-lg font-semibold hover:bg-[#e55a2b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              保存中...
            </>
          ) : (
            <>
              <Upload className="h-5 w-5" />
              保存记录
            </>
          )}
        </button>
      </form>
    </div>
  );
}
