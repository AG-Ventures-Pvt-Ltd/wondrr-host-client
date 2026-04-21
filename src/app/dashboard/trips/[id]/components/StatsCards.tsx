import React from 'react';
import Card from '@/common/components/composites/Card';
import { TrendingUp, Calendar, Tag, Mountain, Eye, Share2 } from 'lucide-react';

interface StatsCardsProps {
    totalRevenue: string;
    batches: number;
    category: string[];
    difficulty?: string;
    totalViews?: number;
    totalShares?: number;
}

const StatsCards: React.FC<StatsCardsProps> = ({ totalRevenue, batches, category, difficulty, totalViews, totalShares }) => {
    return (
        <div className="grid grid-cols-3 gap-4">
            <Card className="flex flex-col gap-2">
                <div className="flex justify-between items-start">
                    <span className="text-neutral-500 capitalize">Total Revenue</span>
                    <div className="w-7 h-7 bg-green-50 rounded-[10px] flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                    </div>
                </div>
                <div className="flex flex-col">
                    <div className="text-3xl text-maintext tracking-tight">{totalRevenue}</div>
                    <div className="text-neutral-500 mt-2">revenue</div>
                </div>
            </Card>

            <Card className="flex flex-col gap-2">
                <div className="flex justify-between items-start">
                    <span className="text-neutral-500 capitalize">Trip Batches Count</span>
                    <div className="w-7 h-7 bg-purple-50 rounded-[10px] flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-purple-600" />
                    </div>
                </div>
                <div className="flex flex-col">
                    <div className="text-3xl text-maintext tracking-tight">{batches}</div>
                    <div className="text-neutral-500 mt-2">batches</div>
                </div>
            </Card>

            <Card className="flex flex-col gap-2">
                <div className="flex justify-between items-start">
                    <span className="text-neutral-500 capitalize">Category</span>
                    <div className="w-7 h-7 bg-amber-50 rounded-[10px] flex items-center justify-center">
                        <Tag className="w-4 h-4 text-amber-600" />
                    </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-1">
                    {category.map((cat, index) => (
                        <span
                            key={index}
                            className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-lg text-sm capitalize"
                        >
                            {cat}
                        </span>
                    ))}
                </div>
            </Card>

            <Card className="flex flex-col gap-2">
                <div className="flex justify-between items-start">
                    <span className="text-neutral-500 capitalize">Difficulty</span>
                    <div className="w-7 h-7 bg-blue-50 rounded-[10px] flex items-center justify-center">
                        <Mountain className="w-4 h-4 text-blue-600" />
                    </div>
                </div>
                <div className="flex flex-col">
                    <div className="text-3xl text-maintext tracking-tight capitalize">{difficulty || 'N/A'}</div>
                    <div className="text-neutral-500 mt-2">level</div>
                </div>
            </Card>

            <Card className="flex flex-col gap-2">
                <div className="flex justify-between items-start">
                    <span className="text-neutral-500 capitalize">Total Views</span>
                    <div className="w-7 h-7 bg-sky-50 rounded-[10px] flex items-center justify-center">
                        <Eye className="w-4 h-4 text-sky-600" />
                    </div>
                </div>
                <div className="flex flex-col">
                    <div className="text-3xl text-maintext tracking-tight">{(totalViews ?? 0).toLocaleString()}</div>
                    <div className="text-neutral-500 mt-2">views</div>
                </div>
            </Card>

            <Card className="flex flex-col gap-2">
                <div className="flex justify-between items-start">
                    <span className="text-neutral-500 capitalize">Total Shares</span>
                    <div className="w-7 h-7 bg-pink-50 rounded-[10px] flex items-center justify-center">
                        <Share2 className="w-4 h-4 text-pink-600" />
                    </div>
                </div>
                <div className="flex flex-col">
                    <div className="text-3xl text-maintext tracking-tight">{(totalShares ?? 0).toLocaleString()}</div>
                    <div className="text-neutral-500 mt-2">shares</div>
                </div>
            </Card>
        </div>
    );
};

export default StatsCards;
