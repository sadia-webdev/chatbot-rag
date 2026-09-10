"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

type TrendPoint = {
  date: string;
  count: number;
};

export function MessageTrendChart({ data }: { data: TrendPoint[] }) {
  return (
    <div className='h-64 w-full'>
      <ResponsiveContainer width='100%' height='100%'>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id='messageGradient' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='5%' stopColor='#7c3aed' stopOpacity={0.25} />
              <stop offset='95%' stopColor='#7c3aed' stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray='3 3'
            vertical={false}
            stroke='#f0f0f0'
          />
          <XAxis
            dataKey='date'
            tick={{ fontSize: 12, fill: "#a3a3a3" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 12, fill: "#a3a3a3" }}
            tickLine={false}
            axisLine={false}
            width={30}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #e5e5e5",
              fontSize: 12,
            }}
          />
          <Area
            type='monotone'
            dataKey='count'
            stroke='#7c3aed'
            strokeWidth={2}
            fill='url(#messageGradient)'
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
