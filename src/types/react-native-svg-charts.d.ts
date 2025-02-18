declare module 'react-native-svg-charts' {
  import React from 'react';

  export interface PieChartData {
    value: number;
    svg: {
      fill: string;
    };
    key: string;
    arc?: {
      outerRadius?: string | number;
      innerRadius?: string | number;
      padAngle?: number;
    };
  }

  export interface PieChartProps {
    style?: any;
    data: PieChartData[];
    animate?: boolean;
    animationDuration?: number;
  }

  export class PieChart extends React.Component<PieChartProps> {}
} 