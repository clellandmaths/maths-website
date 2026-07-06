import React from 'react';

export const TreeDiagramExample1 = () => {
  const Branch = ({ x1, y1, x2, y2, label, prob }: { x1: number, y1: number, x2: number, y2: number, label: string, prob: string }) => {
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    return (
      <g>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="2" className="text-slate-400" />
        <text x={midX} y={midY - 10} textAnchor="middle" fill="currentColor" fontSize="12" className="text-emerald-400">{prob}</text>
        <text x={x2 + (x2 > x1 ? 10 : -10)} y={y2 + 4} textAnchor={x2 > x1 ? "start" : "end"} fill="currentColor" fontSize="14" className="text-slate-200">{label}</text>
      </g>
    );
  };

  return (
    <svg viewBox="0 0 500 240" className="w-full max-w-lg mx-auto my-6 font-sans">
      <text x="150" y="20" textAnchor="middle" fill="currentColor" fontSize="14" fontWeight="bold" className="text-white">Monday</text>
      <text x="350" y="20" textAnchor="middle" fill="currentColor" fontSize="14" fontWeight="bold" className="text-white">Tuesday</text>
      
      {/* First Event */}
      <Branch x1={50} y1={120} x2={150} y2={60} label="Late" prob="0.15" />
      <Branch x1={50} y1={120} x2={150} y2={180} label="On Time" prob="0.85" />
      
      {/* Second Event (from Late) */}
      <Branch x1={200} y1={60} x2={300} y2={30} label="Late" prob="0.15" />
      <Branch x1={200} y1={60} x2={300} y2={90} label="On Time" prob="0.85" />
      
      {/* Second Event (from On Time) */}
      <Branch x1={220} y1={180} x2={300} y2={150} label="Late" prob="0.15" />
      <Branch x1={220} y1={180} x2={300} y2={210} label="On Time" prob="0.85" />
      
      {/* Outcomes */}
      <text x="450" y="20" textAnchor="middle" fill="currentColor" fontSize="14" fontWeight="bold" className="text-slate-400">Outcome</text>
      <text x="450" y="34" textAnchor="middle" fill="currentColor" fontSize="12" className="text-slate-300">L, L</text>
      <text x="450" y="94" textAnchor="middle" fill="currentColor" fontSize="12" className="text-slate-300">L, O</text>
      <text x="450" y="154" textAnchor="middle" fill="currentColor" fontSize="12" className="text-slate-300">O, L</text>
      <text x="450" y="214" textAnchor="middle" fill="currentColor" fontSize="12" className="text-slate-300">O, O</text>
    </svg>
  );
};

export const TreeDiagramExample2 = () => {
  const Branch = ({ x1, y1, x2, y2, label, prob }: { x1: number, y1: number, x2: number, y2: number, label: string, prob: string }) => {
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    return (
      <g>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="2" className="text-slate-400" />
        <text x={midX} y={midY - 10} textAnchor="middle" fill="currentColor" fontSize="12" className="text-emerald-400">{prob}</text>
        <text x={x2 + (x2 > x1 ? 10 : -10)} y={y2 + 4} textAnchor={x2 > x1 ? "start" : "end"} fill="currentColor" fontSize="14" className="text-slate-200">{label}</text>
      </g>
    );
  };

  return (
    <svg viewBox="0 0 500 240" className="w-full max-w-lg mx-auto my-6 font-sans">
      <text x="150" y="20" textAnchor="middle" fill="currentColor" fontSize="14" fontWeight="bold" className="text-white">1st Draw</text>
      <text x="350" y="20" textAnchor="middle" fill="currentColor" fontSize="14" fontWeight="bold" className="text-white">2nd Draw</text>
      
      {/* First Event */}
      <Branch x1={50} y1={120} x2={150} y2={60} label="Black" prob="7/12" />
      <Branch x1={50} y1={120} x2={150} y2={180} label="White" prob="5/12" />
      
      {/* Second Event (from Black) */}
      <Branch x1={200} y1={60} x2={300} y2={30} label="Black" prob="6/11" />
      <Branch x1={200} y1={60} x2={300} y2={90} label="White" prob="5/11" />
      
      {/* Second Event (from White) */}
      <Branch x1={200} y1={180} x2={300} y2={150} label="Black" prob="7/11" />
      <Branch x1={200} y1={180} x2={300} y2={210} label="White" prob="4/11" />
      
      {/* Outcomes */}
      <text x="450" y="20" textAnchor="middle" fill="currentColor" fontSize="14" fontWeight="bold" className="text-slate-400">Outcome</text>
      <text x="450" y="34" textAnchor="middle" fill="currentColor" fontSize="12" className="text-slate-300">B, B</text>
      <text x="450" y="94" textAnchor="middle" fill="currentColor" fontSize="12" className="text-slate-300">B, W</text>
      <text x="450" y="154" textAnchor="middle" fill="currentColor" fontSize="12" className="text-slate-300">W, B</text>
      <text x="450" y="214" textAnchor="middle" fill="currentColor" fontSize="12" className="text-slate-300">W, W</text>
    </svg>
  );
};

export const VennDiagramExample1 = () => (
  <svg viewBox="0 0 300 200" className="w-full max-w-sm mx-auto my-6 font-sans">
    <rect x="10" y="10" width="280" height="180" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400" />
    <text x="20" y="30" fill="currentColor" fontSize="14" className="text-slate-400">&xi;</text>
    <text x="270" y="180" fill="currentColor" fontSize="14" className="text-slate-400">20</text>
    
    <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-400" />
    <text x="60" y="50" textAnchor="middle" fill="currentColor" fontSize="16" fontWeight="bold" className="text-emerald-400">S</text>
    <text x="75" y="105" textAnchor="middle" fill="currentColor" fontSize="16" className="text-white">25</text>
    
    <circle cx="180" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-400" />
    <text x="220" y="50" textAnchor="middle" fill="currentColor" fontSize="16" fontWeight="bold" className="text-blue-400">Y</text>
    <text x="205" y="105" textAnchor="middle" fill="currentColor" fontSize="16" className="text-white">20</text>
    
    <text x="140" y="105" textAnchor="middle" fill="currentColor" fontSize="16" className="text-white">15</text>
  </svg>
);

export const VennDiagramExample2 = () => (
  <svg viewBox="0 0 300 200" className="w-full max-w-sm mx-auto my-6 font-sans">
    <rect x="10" y="10" width="280" height="180" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400" />
    <text x="20" y="30" fill="currentColor" fontSize="14" className="text-slate-400">&xi;</text>
    <text x="270" y="180" fill="currentColor" fontSize="14" className="text-slate-400">20</text>
    
    <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="2" className="text-rose-400" />
    <text x="60" y="50" textAnchor="middle" fill="currentColor" fontSize="16" fontWeight="bold" className="text-rose-400">V</text>
    <text x="75" y="105" textAnchor="middle" fill="currentColor" fontSize="16" className="text-white">45</text>
    
    <circle cx="180" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-400" />
    <text x="220" y="50" textAnchor="middle" fill="currentColor" fontSize="16" fontWeight="bold" className="text-indigo-400">M</text>
    <text x="205" y="105" textAnchor="middle" fill="currentColor" fontSize="16" className="text-white">30</text>
    
    <text x="140" y="105" textAnchor="middle" fill="currentColor" fontSize="16" className="text-white">25</text>
  </svg>
);

export const VennDiagramExample3 = () => (
  <svg viewBox="0 0 300 260" className="w-full max-w-sm mx-auto my-6 font-sans">
    <rect x="10" y="10" width="280" height="240" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400" />
    <text x="20" y="30" fill="currentColor" fontSize="14" className="text-slate-400">&xi;</text>
    <text x="270" y="240" fill="currentColor" fontSize="14" className="text-slate-400">15</text>
    
    {/* N circle */}
    <circle cx="110" cy="90" r="60" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-400" />
    <text x="60" y="45" textAnchor="middle" fill="currentColor" fontSize="16" fontWeight="bold" className="text-red-400">N</text>
    <text x="95" y="85" textAnchor="middle" fill="currentColor" fontSize="14" className="text-white">20</text>
    
    {/* A circle */}
    <circle cx="190" cy="90" r="60" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-400" />
    <text x="240" y="45" textAnchor="middle" fill="currentColor" fontSize="16" fontWeight="bold" className="text-blue-400">A</text>
    <text x="205" y="85" textAnchor="middle" fill="currentColor" fontSize="14" className="text-white">10</text>
    
    {/* D circle */}
    <circle cx="150" cy="160" r="60" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-400" />
    <text x="150" y="240" textAnchor="middle" fill="currentColor" fontSize="16" fontWeight="bold" className="text-emerald-400">D</text>
    <text x="150" y="185" textAnchor="middle" fill="currentColor" fontSize="14" className="text-white">15</text>
    
    {/* Intersections */}
    <text x="150" y="75" textAnchor="middle" fill="currentColor" fontSize="14" className="text-white">15</text> {/* N & A only */}
    <text x="120" y="130" textAnchor="middle" fill="currentColor" fontSize="14" className="text-white">5</text> {/* N & D only */}
    <text x="180" y="130" textAnchor="middle" fill="currentColor" fontSize="14" className="text-white">10</text> {/* A & D only */}
    
    <text x="150" y="115" textAnchor="middle" fill="currentColor" fontSize="14" className="text-white">10</text> {/* All three */}
  </svg>
);

export const PrecedenceNetworkExample2 = () => {
  const Node = ({ x, y, id, time }: { x: number, y: number, id: string, time: string }) => (
    <g transform={`translate(${x},${y})`}>
      <rect x="-20" y="-15" width="40" height="30" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-400" rx="4" />
      <text x="0" y="5" textAnchor="middle" fill="currentColor" fontSize="14" fontWeight="bold" className="text-white">{id}: {time}</text>
    </g>
  );

  const Arrow = ({ x1, y1, x2, y2 }: { x1: number, y1: number, x2: number, y2: number }) => (
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="2" markerEnd="url(#arrowhead)" className="text-slate-400" />
  );

  return (
    <svg viewBox="0 0 400 200" className="w-full max-w-lg mx-auto my-6">
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" className="text-slate-400" />
        </marker>
      </defs>
      
      {/* Arrows */}
      {/* A -> B */} <Arrow x1={70} y1={95} x2={125} y2={45} />
      {/* A -> C */} <Arrow x1={70} y1={100} x2={125} y2={100} />
      {/* A -> E */} <Arrow x1={70} y1={105} x2={125} y2={155} />
      
      {/* B -> D */} <Arrow x1={170} y1={45} x2={225} y2={65} />
      {/* C -> D */} <Arrow x1={170} y1={95} x2={225} y2={75} />
      
      {/* D -> F */} <Arrow x1={270} y1={75} x2={325} y2={110} />
      {/* E -> F */} <Arrow x1={170} y1={160} x2={325} y2={120} />
      
      {/* Nodes */}
      <Node x={50} y={100} id="A" time="5" />
      <Node x={150} y={40} id="B" time="2" />
      <Node x={150} y={100} id="C" time="2" />
      <Node x={150} y={160} id="E" time="4" />
      <Node x={250} y={70} id="D" time="3" />
      <Node x={350} y={115} id="F" time="15" />
    </svg>
  );
};

export const ConstructingPertExample3 = () => {
  const Node = ({ x, y, id, dur, est, letVal }: { x: number, y: number, id: string, dur: string, est: string, letVal: string }) => (
    <g transform={`translate(${x},${y})`}>
      <rect x="0" y="0" width="60" height="40" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-400" />
      <line x1="0" y1="20" x2="60" y2="20" stroke="currentColor" strokeWidth="2" className="text-emerald-400" />
      <line x1="20" y1="20" x2="20" y2="40" stroke="currentColor" strokeWidth="2" className="text-emerald-400" />
      <line x1="40" y1="20" x2="40" y2="40" stroke="currentColor" strokeWidth="2" className="text-emerald-400" />
      <text x="30" y="14" textAnchor="middle" fill="currentColor" fontSize="13" fontWeight="bold" className="text-white">{id}</text>
      <text x="10" y="34" textAnchor="middle" fill="currentColor" fontSize="12" className="text-slate-300">{est}</text>
      <text x="30" y="34" textAnchor="middle" fill="currentColor" fontSize="12" className="text-slate-300">{dur}</text>
      <text x="50" y="34" textAnchor="middle" fill="currentColor" fontSize="12" className="text-slate-300">{letVal}</text>
    </g>
  );

  const Arrow = ({ x1, y1, x2, y2 }: { x1: number, y1: number, x2: number, y2: number }) => (
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="2" markerEnd="url(#pertArrow)" className="text-slate-400" />
  );

  return (
    <svg viewBox="-20 0 600 200" className="w-full max-w-2xl mx-auto my-6">
      <defs>
        <marker id="pertArrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" className="text-slate-400" />
        </marker>
      </defs>
      
      {/* Arrows */}
      <Arrow x1={60} y1={100} x2={95} y2={100} />
      <Arrow x1={160} y1={90} x2={195} y2={65} />
      <Arrow x1={160} y1={110} x2={195} y2={135} />
      
      <Arrow x1={260} y1={60} x2={295} y2={60} />
      <Arrow x1={260} y1={70} x2={295} y2={130} />
      
      <Arrow x1={260} y1={130} x2={295} y2={70} />
      
      <Arrow x1={360} y1={70} x2={395} y2={95} />
      <Arrow x1={360} y1={130} x2={395} y2={105} />
      
      <Arrow x1={460} y1={100} x2={495} y2={100} />

      {/* Nodes */}
      <Node x={0} y={80} id="START" est="0" dur="0" letVal="0" />
      <Node x={100} y={80} id="A" est="0" dur="3" letVal="3" />
      <Node x={200} y={40} id="B" est="3" dur="4" letVal="7" />
      <Node x={200} y={120} id="C" est="3" dur="2" letVal="7" />
      <Node x={300} y={40} id="D" est="7" dur="5" letVal="12" />
      <Node x={300} y={120} id="E" est="7" dur="3" letVal="12" />
      <Node x={400} y={80} id="F" est="12" dur="1" letVal="13" />
      <Node x={500} y={80} id="END" est="13" dur="0" letVal="13" />
    </svg>
  );
};

export const CircleMidpoint = () => (
  <svg viewBox="0 0 200 200" className="w-48 h-48 mx-auto my-4 text-indigo-300">
    <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="2" />
    <line x1="43" y1="157" x2="157" y2="43" stroke="currentColor" strokeWidth="2" />
    <circle cx="43" cy="157" r="4" fill="currentColor" />
    <circle cx="100" cy="100" r="4" fill="currentColor" />
    <circle cx="157" cy="43" r="4" fill="currentColor" />
    <text x="25" y="170" fill="currentColor" fontSize="16" fontFamily="sans-serif">A</text>
    <text x="105" y="115" fill="currentColor" fontSize="16" fontFamily="sans-serif">C</text>
    <text x="165" y="45" fill="currentColor" fontSize="16" fontFamily="sans-serif">B</text>
  </svg>
);

export const CollinearityDiagrams = () => (
  <div className="flex justify-around items-center my-6 gap-4">
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 100 100" className="w-24 h-24 text-indigo-300">
        <line x1="20" y1="80" x2="50" y2="50" stroke="currentColor" strokeWidth="2" />
        <line x1="50" y1="50" x2="90" y2="40" stroke="currentColor" strokeWidth="2" />
        <circle cx="20" cy="80" r="3" fill="currentColor" />
        <circle cx="50" cy="50" r="3" fill="currentColor" />
        <circle cx="90" cy="40" r="3" fill="currentColor" />
        <text x="10" y="90" fill="currentColor" fontSize="12">A</text>
        <text x="55" y="60" fill="currentColor" fontSize="12">B</text>
        <text x="95" y="40" fill="currentColor" fontSize="12">C</text>
      </svg>
      <div className="text-xs text-center mt-2 text-slate-400">
        <div>m_AB ≠ m_BC</div>
        <div>B is common</div>
      </div>
    </div>
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 100 100" className="w-24 h-24 text-indigo-300">
        <line x1="10" y1="90" x2="40" y2="60" stroke="currentColor" strokeWidth="2" />
        <line x1="50" y1="50" x2="80" y2="20" stroke="currentColor" strokeWidth="2" />
        <circle cx="10" cy="90" r="3" fill="currentColor" />
        <circle cx="40" cy="60" r="3" fill="currentColor" />
        <circle cx="50" cy="50" r="3" fill="currentColor" />
        <circle cx="80" cy="20" r="3" fill="currentColor" />
        <text x="0" y="100" fill="currentColor" fontSize="12">A</text>
        <text x="45" y="70" fill="currentColor" fontSize="12">B</text>
        <text x="55" y="60" fill="currentColor" fontSize="12">C</text>
        <text x="85" y="20" fill="currentColor" fontSize="12">D</text>
      </svg>
      <div className="text-xs text-center mt-2 text-slate-400">
        <div>m_AB = m_CD</div>
        <div>No common point</div>
      </div>
    </div>
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 100 100" className="w-24 h-24 text-indigo-300">
        <line x1="20" y1="80" x2="80" y2="20" stroke="currentColor" strokeWidth="2" />
        <circle cx="20" cy="80" r="3" fill="currentColor" />
        <circle cx="50" cy="50" r="3" fill="currentColor" />
        <circle cx="80" cy="20" r="3" fill="currentColor" />
        <text x="10" y="90" fill="currentColor" fontSize="12">A</text>
        <text x="55" y="60" fill="currentColor" fontSize="12">B</text>
        <text x="85" y="20" fill="currentColor" fontSize="12">C</text>
      </svg>
      <div className="text-xs text-center mt-2 text-slate-400">
        <div>m_AB = m_BC</div>
        <div>B is common</div>
      </div>
    </div>
  </div>
);

export const GradientTriangle = () => (
  <svg viewBox="0 0 250 160" className="w-80 h-auto mx-auto my-6 text-indigo-300">
    <polygon points="40,120 160,120 160,20" fill="none" stroke="currentColor" strokeWidth="2" />
    <line x1="40" y1="120" x2="160" y2="20" stroke="currentColor" strokeWidth="2" />
    
    <rect x="150" y="110" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1" />
    <path d="M 65 120 A 25 25 0 0 0 60 105" fill="none" stroke="currentColor" strokeWidth="1" />
    <text x="65" y="115" fill="currentColor" fontSize="12" fontFamily="serif" fontStyle="italic">θ</text>
    
    <text x="100" y="135" fill="#4ade80" fontSize="14" fontFamily="sans-serif">
      x<tspan dy="3" fontSize="10">2</tspan><tspan dy="-3"> - x</tspan><tspan dy="3" fontSize="10">1</tspan>
    </text>
    <text x="100" y="150" fill="#4ade80" fontSize="12" fontFamily="sans-serif" fontStyle="italic">adj</text>
    
    <text x="170" y="70" fill="#f87171" fontSize="14" fontFamily="sans-serif">
      y<tspan dy="3" fontSize="10">2</tspan><tspan dy="-3"> - y</tspan><tspan dy="3" fontSize="10">1</tspan>
    </text>
    <text x="170" y="85" fill="#f87171" fontSize="12" fontFamily="sans-serif" fontStyle="italic">opp</text>
    
    <text x="70" y="60" fill="currentColor" fontSize="14" fontFamily="sans-serif" fontStyle="italic">hyp</text>
    
    <text x="5" y="135" fill="currentColor" fontSize="12" fontFamily="sans-serif">
      (x<tspan dy="3" fontSize="8">1</tspan><tspan dy="-3">, y</tspan><tspan dy="3" fontSize="8">1</tspan><tspan dy="-3">)</tspan>
    </text>
    <text x="140" y="15" fill="currentColor" fontSize="12" fontFamily="sans-serif">
      (x<tspan dy="3" fontSize="8">2</tspan><tspan dy="-3">, y</tspan><tspan dy="3" fontSize="8">2</tspan><tspan dy="-3">)</tspan>
    </text>
  </svg>
);

export const GradientTypes = () => (
  <div className="flex justify-between items-center my-6 gap-2 text-indigo-300">
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 100 100" className="w-16 h-16">
        <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="1" />
        <line x1="10" y1="70" x2="90" y2="70" stroke="currentColor" strokeWidth="1" />
        <line x1="20" y1="90" x2="80" y2="30" stroke="currentColor" strokeWidth="2" />
      </svg>
      <span className="text-[10px] mt-2 uppercase tracking-wide">Positive</span>
    </div>
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 100 100" className="w-16 h-16">
        <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="1" />
        <line x1="10" y1="70" x2="90" y2="70" stroke="currentColor" strokeWidth="1" />
        <line x1="20" y1="30" x2="80" y2="90" stroke="currentColor" strokeWidth="2" />
      </svg>
      <span className="text-[10px] mt-2 uppercase tracking-wide">Negative</span>
    </div>
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 100 100" className="w-16 h-16">
        <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="1" />
        <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="1" />
        <line x1="20" y1="30" x2="80" y2="30" stroke="currentColor" strokeWidth="2" />
      </svg>
      <span className="text-[10px] mt-2 uppercase tracking-wide">Zero</span>
    </div>
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 100 100" className="w-16 h-16">
        <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="1" />
        <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="1" />
        <line x1="70" y1="20" x2="70" y2="80" stroke="currentColor" strokeWidth="2" />
      </svg>
      <span className="text-[10px] mt-2 uppercase tracking-wide">Undefined</span>
    </div>
  </div>
);

export const Ex1Gradient = () => (
  <svg viewBox="0 0 150 100" className="w-32 h-auto text-indigo-300">
    <line x1="20" y1="10" x2="20" y2="80" stroke="currentColor" strokeWidth="1" />
    <line x1="10" y1="70" x2="140" y2="70" stroke="currentColor" strokeWidth="1" />
    <polygon points="140,67 145,70 140,73" fill="currentColor" />
    <polygon points="17,10 20,5 23,10" fill="currentColor" />
    <line x1="20" y1="70" x2="120" y2="20" stroke="#3b82f6" strokeWidth="2" />
    <path d="M 50 70 A 30 30 0 0 0 45 57" fill="none" stroke="currentColor" strokeWidth="1" />
    <text x="55" y="65" fill="currentColor" fontSize="12">32°</text>
    <text x="5" y="85" fill="currentColor" fontSize="14">O</text>
    <text x="140" y="85" fill="currentColor" fontSize="12">x</text>
    <text x="5" y="15" fill="currentColor" fontSize="12">y</text>
  </svg>
);

export const Ex3Gradient = () => (
  <svg viewBox="0 0 150 100" className="w-32 h-auto text-indigo-300">
    <line x1="50" y1="15" x2="50" y2="90" stroke="currentColor" strokeWidth="1" />
    <polygon points="47,15 50,10 53,15" fill="currentColor" />
    <text x="35" y="20" fill="currentColor" fontSize="12">y</text>

    <line x1="10" y1="80" x2="140" y2="80" stroke="currentColor" strokeWidth="1" />
    <polygon points="140,77 145,80 140,83" fill="currentColor" />
    <text x="140" y="95" fill="currentColor" fontSize="12">x</text>

    <line x1="10" y1="73.1" x2="120" y2="9.6" stroke="#3b82f6" strokeWidth="2" />
    <text x="10" y="85" fill="currentColor" fontSize="12">A</text>
    <text x="125" y="12" fill="currentColor" fontSize="12">B</text>

    <path d="M 50 20 A 30 30 0 0 1 76 35" fill="none" stroke="currentColor" strokeWidth="1" />
    <text x="53" y="38" fill="currentColor" fontSize="10">60°</text>
  </svg>
);

export const Ex4Gradient = () => (
  <svg viewBox="0 0 150 120" className="w-32 h-auto text-indigo-300">
    <line x1="60" y1="15" x2="60" y2="110" stroke="currentColor" strokeWidth="1" />
    <polygon points="57,15 60,10 63,15" fill="currentColor" />
    <text x="45" y="20" fill="currentColor" fontSize="12">y</text>

    <line x1="10" y1="90" x2="140" y2="90" stroke="currentColor" strokeWidth="1" />
    <polygon points="140,87 145,90 140,93" fill="currentColor" />
    <text x="140" y="105" fill="currentColor" fontSize="12">x</text>
    <text x="45" y="105" fill="currentColor" fontSize="12">O</text>

    <line x1="25" y1="112.5" x2="85" y2="22.5" stroke="#3b82f6" strokeWidth="2" />
    
    <path d="M 60 20 A 40 40 0 0 1 82.2 26.7" fill="none" stroke="currentColor" strokeWidth="1" />
    <text x="62" y="40" fill="currentColor" fontSize="12" fontStyle="italic">θ</text>
    
    <text x="90" y="60" fill="currentColor" fontSize="12">m = 5</text>
  </svg>
);

export const ParallelLines = () => (
  <svg viewBox="0 0 100 100" className="w-24 h-24 text-white">
    <line x1="30" y1="90" x2="80" y2="10" stroke="currentColor" strokeWidth="2.5" />
    <line x1="50" y1="100" x2="100" y2="20" stroke="currentColor" strokeWidth="2.5" />
  </svg>
);

export const PerpendicularLines = () => (
  <svg viewBox="0 0 120 120" className="w-40 h-40 text-white">
    <line x1="20" y1="20" x2="100" y2="100" stroke="currentColor" strokeWidth="2" />
    <line x1="20" y1="100" x2="100" y2="20" stroke="currentColor" strokeWidth="2" />
    <polyline points="63,57 66,60 63,63" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <text x="5" y="15" fill="currentColor" fontSize="10">A</text>
    <text x="105" y="110" fill="currentColor" fontSize="10">B</text>
    <text x="5" y="110" fill="currentColor" fontSize="10">C</text>
    <text x="105" y="15" fill="currentColor" fontSize="10">D</text>
  </svg>
);

export const HorizontalVerticalLines = () => (
  <svg viewBox="0 0 340 300" className="w-full max-w-sm h-auto mx-auto my-6 text-foreground">
    <line x1="20" y1="180" x2="250" y2="180" stroke="currentColor" strokeWidth="2" />
    <polygon points="250,175 258,180 250,185" fill="currentColor" />
    <text x="265" y="186" fill="currentColor" fontSize="18" fontFamily="serif" fontWeight="bold">x</text>

    <line x1="70" y1="220" x2="70" y2="20" stroke="currentColor" strokeWidth="2" />
    <polygon points="65,20 70,12 75,20" fill="currentColor" />
    <text x="80" y="25" fill="currentColor" fontSize="18" fontFamily="serif" fontWeight="bold">y</text>

    <line x1="20" y1="100" x2="210" y2="100" stroke="#ef4444" strokeWidth="2" />
    <text x="260" y="90" fill="#ef4444" fontSize="14" fontStyle="italic" textAnchor="middle" fontWeight="500">zero gradient</text>
    <text x="260" y="115" fill="#ef4444" fontSize="14" fontStyle="italic" textAnchor="middle" fontWeight="500">y = __</text>

    <line x1="130" y1="20" x2="130" y2="230" stroke="#22c55e" strokeWidth="2" />
    <text x="130" y="255" fill="#22c55e" fontSize="14" fontStyle="italic" textAnchor="middle" fontWeight="500">undefined gradient</text>
    <text x="130" y="275" fill="#22c55e" fontSize="14" fontStyle="italic" textAnchor="middle" fontWeight="500">x = __</text>

    <polyline points="130,90 140,90 140,100" fill="none" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export const PerpendicularBisectorCross = () => (
  <svg viewBox="0 0 120 120" className="w-40 h-40 text-white">
    <line x1="20" y1="20" x2="100" y2="100" stroke="currentColor" strokeWidth="2" />
    <line x1="20" y1="100" x2="100" y2="20" stroke="currentColor" strokeWidth="2" />
    
    <line x1="37" y1="43" x2="43" y2="37" stroke="currentColor" strokeWidth="1.5" />
    <line x1="77" y1="83" x2="83" y2="77" stroke="currentColor" strokeWidth="1.5" />
    
    <polyline points="64,56 68,60 64,64" fill="none" stroke="currentColor" strokeWidth="1.5" />
    
    <text x="15" y="15" fill="currentColor" fontSize="10">A</text>
    <text x="105" y="110" fill="currentColor" fontSize="10">B</text>
    <text x="10" y="105" fill="currentColor" fontSize="10">C</text>
    <text x="105" y="15" fill="currentColor" fontSize="10">D</text>
  </svg>
);

export const PerpendicularBisectorTriangle = () => (
  <svg viewBox="0 0 200 100" className="w-64 h-auto text-white">
    <line x1="20" y1="90" x2="160" y2="90" stroke="currentColor" strokeWidth="2" />
    <line x1="20" y1="90" x2="110" y2="20" stroke="currentColor" strokeWidth="2" />
    <line x1="160" y1="90" x2="110" y2="20" stroke="currentColor" strokeWidth="2" />
    
    <line x1="90" y1="40" x2="90" y2="110" stroke="#ef4444" strokeWidth="2" />
    
    <rect x="90" y="85" width="5" height="5" fill="none" stroke="currentColor" strokeWidth="1" />
    
    <line x1="55" y1="85" x2="55" y2="95" stroke="currentColor" strokeWidth="1.5" />
    <line x1="125" y1="85" x2="125" y2="95" stroke="currentColor" strokeWidth="1.5" />
    
    <text x="5" y="95" fill="currentColor" fontSize="12">A</text>
    <text x="170" y="95" fill="currentColor" fontSize="12">B</text>
    <text x="110" y="10" fill="currentColor" fontSize="12">C</text>
    <text x="95" y="50" fill="#ef4444" fontSize="12">E</text>
    <text x="95" y="115" fill="#ef4444" fontSize="12">D</text>
  </svg>
);

export const Circumcentre = () => (
  <svg viewBox="0 0 300 300" className="w-80 h-80 mx-auto my-6 text-slate-400">
    {/* Circumcircle */}
    <circle cx="150" cy="150" r="100" fill="none" stroke="currentColor" strokeWidth="1.5" />
    
    {/* Filled Triangle */}
    <polygon points="56,184 214,73 227,214" fill="#3b82f6" fillOpacity="0.15" stroke="#3b82f6" strokeWidth="2" />
    
    {/* Perpendicular Bisector for AB (Top-Left to Bottom-Right) */}
    <line x1="60" y1="21" x2="240" y2="279" stroke="currentColor" strokeWidth="1.5" />
    {/* Perpendicular Bisector for BC (Horizontal-ish) */}
    <line x1="9" y1="163" x2="291" y2="137" stroke="currentColor" strokeWidth="1.5" />
    {/* Perpendicular Bisector for AC (Vertical-ish) */}
    <line x1="124.5" y1="3" x2="175.5" y2="297" stroke="currentColor" strokeWidth="1.5" />
    
    {/* Vertices */}
    <circle cx="56" cy="184" r="3.5" fill="#3b82f6" />
    <circle cx="214" cy="73" r="3.5" fill="#3b82f6" />
    <circle cx="227" cy="214" r="3.5" fill="#3b82f6" />
    
    {/* Circumcentre Point */}
    <circle cx="150" cy="150" r="3.5" fill="#94a3b8" />
    <text x="156" y="146" fill="#94a3b8" fontSize="11" fontWeight="500">Circumcentre</text>
  </svg>
);

export const Altitudes = () => (
  <svg viewBox="0 0 200 100" className="w-48 h-auto mx-auto my-4 text-indigo-300">
    <polygon points="20,80 180,80 120,20" fill="none" stroke="currentColor" strokeWidth="2" />
    <line x1="120" y1="20" x2="120" y2="80" stroke="#f87171" strokeWidth="2" />
    <rect x="116" y="76" width="4" height="4" fill="none" stroke="currentColor" strokeWidth="1" />
    <text x="10" y="85" fill="currentColor" fontSize="12">A</text>
    <text x="185" y="85" fill="currentColor" fontSize="12">B</text>
    <text x="115" y="15" fill="currentColor" fontSize="12">C</text>
  </svg>
);

export const Orthocentre = () => {
  const ax = -7, ay = 2.2;
  const bx = 4, by = 3;
  const cx = 2.6, cy = -5;

  const hx = 2.193; 
  const hy = 0.591;

  const scale = 45;
  const ox = 345;
  const oy = 165;

  const mX = (x: number) => ox + x * scale;
  const mY = (y: number) => oy - y * scale;

  return (
    <svg viewBox="0 0 560 430" className="w-[36rem] max-w-full h-auto mx-auto my-6 text-slate-400">
      {/* Axes */}
      <line x1={mX(-7.6)} y1={mY(0)} x2={mX(4.6)} y2={mY(0)} stroke="currentColor" strokeWidth="1.5" />
      <line x1={mX(0)} y1={mY(-5.5)} x2={mX(0)} y2={mY(3.5)} stroke="currentColor" strokeWidth="1.5" />

      {/* Grid numbers */}
      {[...Array(12)].map((_, i) => {
        const x = i - 7;
        if (x === 0) return null;
        return (
          <g key={`x-${x}`}>
            <line x1={mX(x)} y1={mY(0)} x2={mX(x)} y2={mY(0) + 4} stroke="currentColor" strokeWidth="1.5" />
            <text x={mX(x)} y={mY(0) + 14} fill="currentColor" fontSize="12" textAnchor="middle">{x}</text>
          </g>
        );
      })}
      {[...Array(9)].map((_, i) => {
        const y = i - 5;
        if (y === 0) return null;
        return (
          <g key={`y-${y}`}>
            <line x1={mX(0) - 4} y1={mY(y)} x2={mX(0)} y2={mY(y)} stroke="currentColor" strokeWidth="1.5" />
            <text x={mX(0) - 8} y={mY(y) + 4} fill="currentColor" fontSize="12" textAnchor="end">{y}</text>
          </g>
        );
      })}
      <text x={mX(0) - 6} y={mY(0) + 14} fill="currentColor" fontSize="12" textAnchor="end">0</text>

      {/* Triangle fill */}
      <polygon 
        points={`${mX(ax)},${mY(ay)} ${mX(bx)},${mY(by)} ${mX(cx)},${mY(cy)}`} 
        fill="#3b82f6" 
        fillOpacity="0.15" 
      />

      {/* Altitudes */}
      <line x1={mX(-7.6)} y1={mY(-0.175 * -7.6 + 0.975)} x2={mX(4.6)} y2={mY(-0.175 * 4.6 + 0.975)} stroke="currentColor" strokeWidth="1.5" />
      <line x1={mX(-2.375)} y1={mY(-5.5)} x2={mX(4.375)} y2={mY(3.5)} stroke="currentColor" strokeWidth="1.5" />
      <line x1={mX(2.64)} y1={mY(-5.5)} x2={mX(1.98)} y2={mY(3.5)} stroke="currentColor" strokeWidth="1.5" />

      {/* Triangle edges */}
      <polygon 
        points={`${mX(ax)},${mY(ay)} ${mX(bx)},${mY(by)} ${mX(cx)},${mY(cy)}`} 
        fill="none" 
        stroke="#3b82f6" 
        strokeWidth="2" 
      />

      {/* Vertices */}
      <circle cx={mX(ax)} cy={mY(ay)} r="4" fill="#3b82f6" />
      <circle cx={mX(bx)} cy={mY(by)} r="4" fill="#3b82f6" />
      <circle cx={mX(cx)} cy={mY(cy)} r="4" fill="#3b82f6" />

      {/* Orthocentre */}
      <circle cx={mX(hx)} cy={mY(hy)} r="4.5" fill="#94a3b8" />
      <text x={mX(hx) + 8} y={mY(hy) - 8} fill="#94a3b8" fontSize="14" fontWeight="500">Orthocentre</text>

    </svg>
  );
};

export const Medians = () => (
  <svg viewBox="0 0 200 120" className="w-56 h-auto text-white">
    <polygon points="20,100 180,100 140,20" fill="none" stroke="currentColor" strokeWidth="2" />
    <line x1="140" y1="20" x2="100" y2="100" stroke="#ef4444" strokeWidth="2" />
    <circle cx="100" cy="100" r="3" fill="#ef4444" />
    
    <line x1="60" y1="95" x2="60" y2="105" stroke="currentColor" strokeWidth="1.5" />
    <line x1="140" y1="95" x2="140" y2="105" stroke="currentColor" strokeWidth="1.5" />
    <text x="10" y="115" fill="currentColor" fontSize="12">A</text>
    <text x="185" y="115" fill="currentColor" fontSize="12">B</text>
    <text x="135" y="10" fill="currentColor" fontSize="12">C</text>
    <text x="95" y="118" fill="#ef4444" fontSize="12">M</text>
  </svg>
);

export const Centroid = () => (
  <svg viewBox="0 0 320 480" className="w-[20rem] max-w-full h-auto mx-auto my-6 text-slate-400">
    {/* Triangle fill */}
    <polygon 
      points="280,20 40,260 40,440" 
      fill="#3b82f6" 
      fillOpacity="0.15" 
    />
    
    {/* Medians */}
    <line x1="280" y1="20" x2="40" y2="350" stroke="currentColor" strokeWidth="1.5" />
    <line x1="40" y1="260" x2="160" y2="230" stroke="currentColor" strokeWidth="1.5" />
    <line x1="40" y1="440" x2="160" y2="140" stroke="currentColor" strokeWidth="1.5" />

    {/* Triangle edges */}
    <polygon 
      points="280,20 40,260 40,440" 
      fill="none" 
      stroke="#3b82f6" 
      strokeWidth="2" 
    />

    {/* Midpoints */}
    <circle cx="160" cy="140" r="3.5" fill="#64748b" stroke="#0f172a" strokeWidth="1" />
    <circle cx="40" cy="350" r="3.5" fill="#64748b" stroke="#0f172a" strokeWidth="1" />
    <circle cx="160" cy="230" r="3.5" fill="#64748b" stroke="#0f172a" strokeWidth="1" />

    {/* Vertices */}
    <circle cx="280" cy="20" r="4.5" fill="#3b82f6" stroke="#0f172a" strokeWidth="1" />
    <circle cx="40" cy="260" r="4.5" fill="#3b82f6" stroke="#0f172a" strokeWidth="1" />
    <circle cx="40" cy="440" r="4.5" fill="#3b82f6" stroke="#0f172a" strokeWidth="1" />

    {/* Centroid */}
    <circle cx="120" cy="240" r="4" fill="#94a3b8" stroke="#0f172a" strokeWidth="1" />
    <text x="122" y="235" fill="#cbd5e1" fontSize="14" fontWeight="500">Centroid</text>
  </svg>
);

export const IntersectionExample = () => (
  <svg viewBox="0 0 200 200" className="w-48 h-48 mx-auto my-4 text-indigo-300">
    <polygon points="40,40 180,80 80,160" fill="none" stroke="currentColor" strokeWidth="2" />
    <line x1="40" y1="40" x2="130" y2="120" stroke="#f87171" strokeWidth="2" />  {/* Median RT */}
    <line x1="180" y1="80" x2="60" y2="100" stroke="#3b82f6" strokeWidth="2" />  {/* Altitude QS */}
    
    <circle cx="40" cy="40" r="3" fill="currentColor" />
    <circle cx="180" cy="80" r="3" fill="currentColor" />
    <circle cx="80" cy="160" r="3" fill="currentColor" />
    <circle cx="95" cy="93" r="3" fill="#ffffff" />
    
    <text x="25" y="45" fill="currentColor" fontSize="12">Q</text>
    <text x="185" y="85" fill="currentColor" fontSize="12">P</text>
    <text x="65" y="170" fill="currentColor" fontSize="12">R</text>
    <text x="110" y="110" fill="currentColor" fontSize="12">M</text>
    <text x="135" y="135" fill="currentColor" fontSize="12">S</text>
    <text x="50" y="115" fill="currentColor" fontSize="12">T</text>
  </svg>
);

export const InverseGraphReflection = () => (
  <svg viewBox="-4 -4 8 8" className="w-[20rem] max-w-full h-auto mx-auto my-6 text-slate-400">
    <line x1="-4" y1="0" x2="4" y2="0" stroke="currentColor" strokeWidth="0.05" />
    <line x1="0" y1="-4" x2="0" y2="4" stroke="currentColor" strokeWidth="0.05" />
    
    {/* y = x dashed line */}
    <line x1="-3" y1="-3" x2="3" y2="3" stroke="#94a3b8" strokeWidth="0.08" strokeDasharray="0.2,0.2" />
    
    {/* f(x) = x + 1 */}
    <line x1="-2" y1="-1" x2="2" y2="3" stroke="#3b82f6" strokeWidth="0.1" />
    <circle cx="0" cy="1" r="0.15" fill="#3b82f6" />
    <circle cx="1" cy="2" r="0.15" fill="#3b82f6" />
    <text x="0.2" y="0.8" fill="#3b82f6" fontSize="0.4">(0, 1)</text>
    <text x="1.2" y="1.8" fill="#3b82f6" fontSize="0.4">(1, 2)</text>
    <text x="-1.5" y="-0.2" fill="#3b82f6" fontSize="0.5">f(x)</text>

    {/* f^-1(x) = x - 1 */}
    <line x1="-1" y1="-2" x2="3" y2="2" stroke="#ef4444" strokeWidth="0.1" />
    <circle cx="1" cy="0" r="0.15" fill="#ef4444" />
    <circle cx="2" cy="1" r="0.15" fill="#ef4444" />
    <text x="1.2" y="-0.2" fill="#ef4444" fontSize="0.4">(1, 0)</text>
    <text x="2.2" y="0.8" fill="#ef4444" fontSize="0.4">(2, 1)</text>
    <text x="-0.2" y="-1.5" fill="#ef4444" fontSize="0.5">f⁻¹(x)</text>
  </svg>
);

export const InverseGraphExample = () => (
  <svg viewBox="-3 -3 6 6" className="w-[16rem] max-w-full h-auto mx-auto my-6 text-slate-400">
    <line x1="-3" y1="0" x2="3" y2="0" stroke="currentColor" strokeWidth="0.05" />
    <line x1="0" y1="-3" x2="0" y2="3" stroke="currentColor" strokeWidth="0.05" />
    
    {/* Cubic finding curve f(x) passing through (-1,0), (0,1), (1,2) */}
    <path d="M -1.5 -1.5 C -1 0, -0.5 0.5, 0 1 C 0.5 1.5, 1 2, 1.5 3" fill="none" stroke="#ef4444" strokeWidth="0.1" />
    
    <circle cx="-1" cy="0" r="0.1" fill="#10b981" />
    <text x="-2.2" y="-0.2" fill="#10b981" fontSize="0.3">(-1, 0)</text>

    <circle cx="0" cy="1" r="0.1" fill="#3b82f6" />
    <text x="-0.8" y="1.2" fill="#3b82f6" fontSize="0.3">(0, 1)</text>

    <circle cx="1" cy="2" r="0.1" fill="#8b5cf6" />
    <text x="1.2" y="1.9" fill="#8b5cf6" fontSize="0.3">(-1, 2)</text>
    
    <text x="-1.5" y="-1.8" fill="#ef4444" fontSize="0.4">f(x)</text>
  </svg>
);

export const TransformationGraph1 = () => (
  <svg viewBox="-4 -20 6 35" className="w-[16rem] max-w-full h-auto mx-auto my-6 text-slate-400" style={{ transform: "scaleY(-1)" }}>
    {/* Flip Y to map positive y upward */}
    <line x1="-4" y1="0" x2="2" y2="0" stroke="currentColor" strokeWidth="0.2" />
    <line x1="0" y1="-20" x2="0" y2="15" stroke="currentColor" strokeWidth="0.2" />
    
    {/* Cubic f(x) passing through (-3,0), (-2,10), (1,-17) */}
    <path d="M -3.5 -15 Q -2.5 25, -1 0 T 1 -17 Q 1.2 -10, 1.5 10" fill="none" stroke="#ef4444" strokeWidth="0.4" />
    
    <circle cx="-3" cy="0" r="0.5" fill="#10b981" />
    <text x="-4" y="-1.5" fill="#10b981" fontSize="1.5" style={{ transform: "scaleY(-1)", transformOrigin: "-4 -1.5" }}>(-3, 0)</text>

    <circle cx="-2" cy="10" r="0.5" fill="#f87171" />
    <text x="-3.5" y="-10" fill="#f87171" fontSize="1.5" style={{ transform: "scaleY(-1)", transformOrigin: "-3.5 -10" }}>(-2, 10)</text>

    <circle cx="1" cy="-17" r="0.5" fill="#3b82f6" />
    <text x="1.5" y="17" fill="#3b82f6" fontSize="1.5" style={{ transform: "scaleY(-1)", transformOrigin: "1.5 17" }}>(1, -17)</text>
    
    <text x="-1" y="-8" fill="#ef4444" fontSize="2.5" style={{ transform: "scaleY(-1)", transformOrigin: "-1 -8" }}>y = f(x)</text>
  </svg>
);

export const TransformationGraph2 = () => (
  <svg viewBox="-2 -2 5 6" className="w-[16rem] max-w-full h-auto mx-auto my-6 text-slate-400" style={{ transform: "scaleY(-1)" }}>
    <line x1="-2" y1="0" x2="4" y2="0" stroke="currentColor" strokeWidth="0.05" />
    <line x1="0" y1="-3" x2="0" y2="3" stroke="currentColor" strokeWidth="0.05" />
    
    <path d="M -1.5 -2 C -1.2 1.5, -0.5 2, 0 2 C 0.5 2, 0.8 0, 1 0 C 1.5 0, 2.5 -2, 3 0 C 3.2 1.5, 3.5 3, 3.8 4" fill="none" stroke="#ef4444" strokeWidth="0.1" />
    
    <circle cx="-1" cy="0" r="0.1" fill="#8b5cf6" />
    <text x="-1.8" y="-0.2" fill="#8b5cf6" fontSize="0.3" style={{ transform: "scaleY(-1)", transformOrigin: "-1.8 -0.2" }}>(-1, 0)</text>

    <circle cx="0" cy="2" r="0.1" fill="#10b981" />
    <text x="0.2" y="-1.8" fill="#10b981" fontSize="0.3" style={{ transform: "scaleY(-1)", transformOrigin: "0.2 -1.8" }}>(0, 2)</text>

    <circle cx="1" cy="0" r="0.1" fill="#3b82f6" />
    <text x="0.8" y="-0.4" fill="#3b82f6" fontSize="0.3" style={{ transform: "scaleY(-1)", transformOrigin: "0.8 -0.4" }}>(1, 0)</text>

    <circle cx="3" cy="0" r="0.1" fill="#f87171" />
    <text x="2.8" y="-0.4" fill="#f87171" fontSize="0.3" style={{ transform: "scaleY(-1)", transformOrigin: "2.8 -0.4" }}>(3, 0)</text>
    
    <text x="1.5" y="0.5" fill="#ef4444" fontSize="0.5" style={{ transform: "scaleY(-1)", transformOrigin: "1.5 0.5" }}>y = f(x)</text>
  </svg>
);

export const ExactValueTriangle45 = () => (
  <svg viewBox="-20 -20 200 200" className="w-[12rem] max-w-full h-auto mx-auto drop-shadow-md vector-graphic" aria-hidden="true">
    <path d="M 20 160 L 160 160 L 160 20 Z" fill="none" stroke="#60A5FA" strokeWidth="3" strokeLinejoin="round" />
    <path d="M 140 160 L 140 140 L 160 140" fill="none" stroke="#60A5FA" strokeWidth="2" />
    
    <path d="M 50 160 A 30 30 0 0 0 41 139" fill="none" stroke="#94A3B8" strokeWidth="1.5" />
    <text x="50" y="150" fill="#CBD5E1" fontSize="16" fontWeight="bold">45°</text>
    
    <path d="M 160 50 A 30 30 0 0 1 139 41" fill="none" stroke="#94A3B8" strokeWidth="1.5" />
    <text x="120" y="60" fill="#CBD5E1" fontSize="16" fontWeight="bold">45°</text>
    
    <text x="90" y="180" fill="#F87171" fontSize="18" fontWeight="bold">1</text>
    <text x="170" y="90" fill="#F87171" fontSize="18" fontWeight="bold">1</text>
    <text x="70" y="80" fill="#34D399" fontSize="18" fontWeight="bold">√2</text>
  </svg>
);

export const ExactValueTriangle3060 = () => (
  <svg viewBox="-20 -20 200 160" className="w-[12rem] max-w-full h-auto mx-auto drop-shadow-md vector-graphic" aria-hidden="true">
    {/* 1 / sqrt(3) is approx 1 / 1.732, so length of opposite 30 deg should be around 140 / 1.732 = 80 */}
    <path d="M 20 120 L 160 120 L 160 39 L 20 120 Z" fill="none" stroke="#60A5FA" strokeWidth="3" strokeLinejoin="round" />
    <path d="M 140 120 L 140 100 L 160 100" fill="none" stroke="#60A5FA" strokeWidth="2" />
    
    <path d="M 60 120 A 40 40 0 0 0 55 100" fill="none" stroke="#94A3B8" strokeWidth="1.5" />
    <text x="65" y="112" fill="#CBD5E1" fontSize="16" fontWeight="bold">30°</text>
    
    <path d="M 160 69 A 30 30 0 0 1 143 49" fill="none" stroke="#94A3B8" strokeWidth="1.5" />
    <text x="130" y="65" fill="#CBD5E1" fontSize="16" fontWeight="bold">60°</text>
    
    <text x="90" y="140" fill="#F87171" fontSize="18" fontWeight="bold">√3</text>
    <text x="170" y="85" fill="#F87171" fontSize="18" fontWeight="bold">1</text>
    <text x="75" y="70" fill="#34D399" fontSize="18" fontWeight="bold">2</text>
  </svg>
);

export const CurveSketchExample = () => (
  <svg viewBox="-50 -60 150 120" className="w-[16rem] max-w-full h-auto mx-auto vector-graphic text-slate-800 dark:text-slate-200" aria-hidden="true">
    {/* Axes */}
    <line x1="-50" y1="0" x2="100" y2="0" stroke="currentColor" strokeWidth="1.5" />
    <line x1="0" y1="-60" x2="0" y2="60" stroke="currentColor" strokeWidth="1.5" />
    
    <text x="85" y="-5" fill="currentColor" fontSize="10">x</text>
    <text x="5" y="-50" fill="currentColor" fontSize="10">y</text>
    
    {/* Curve: y = x^3 - 3x^2 
        Scale: x-axis: 1 unit = 20px, y-axis: 1 unit = 10px 
        Max at (0,0), Min at (2, -4) -> SVGs coordinate (40, 40)
        Intercept at (3, 0) -> SVG (60, 0)
    */}
    <path 
       d="M -15 60 C -5 20, 0 0, 0 0 C 15 0, 25 40, 40 40 C 50 40, 55 20, 60 0 C 65 -20, 70 -50, 75 -60" 
       fill="none" stroke="#F87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
    />
    
    {/* Points & Labels */}
    <circle cx="0" cy="0" r="3" fill="#60A5FA" />
    <text x="-25" y="-10" fill="currentColor" fontSize="10" className="opacity-80">(0, 0)</text>

    <circle cx="40" cy="40" r="3" fill="#60A5FA" />
    <text x="35" y="55" fill="currentColor" fontSize="10" className="opacity-80">(2, -4)</text>

    <circle cx="60" cy="0" r="3" fill="#60A5FA" />
    <text x="65" y="15" fill="currentColor" fontSize="10" className="opacity-80">(3, 0)</text>
  </svg>
);

export const TangentDiagram = () => (
  <svg viewBox="0 0 100 100" className="w-[12rem] max-w-full h-auto mx-auto drop-shadow-md vector-graphic" aria-hidden="true">
    {/* Curve */}
    <path d="M 10 90 Q 50 10 90 90" fill="none" stroke="#F87171" strokeWidth="2" strokeLinecap="round" />
    {/* Tangent line */}
    <path d="M 10 80 L 70 20" fill="none" stroke="#94A3B8" strokeWidth="1.5" />
    <circle cx="30" cy="60" r="2.5" fill="#60A5FA" />
    <text x="38" y="48" fill="#94A3B8" fontSize="10" transform="rotate(-45 38 48)">tangent</text>
  </svg>
);

export const MaxTurningPoint = () => (
  <svg viewBox="0 0 120 120" className="w-[8rem] max-w-full h-auto mx-auto vector-graphic text-slate-800 dark:text-slate-200" aria-hidden="true">
    <path d="M 20 100 Q 60 -40 100 100" fill="none" stroke="#F87171" strokeWidth="2" strokeLinecap="round" />
    <line x1="30" y1="30" x2="90" y2="30" stroke="#94A3B8" strokeWidth="1.5" />
    <circle cx="60" cy="30" r="3" fill="#60A5FA" />
  </svg>
);

export const MinTurningPoint = () => (
  <svg viewBox="0 0 120 120" className="w-[8rem] max-w-full h-auto mx-auto vector-graphic text-slate-800 dark:text-slate-200" aria-hidden="true">
    <path d="M 20 20 Q 60 160 100 20" fill="none" stroke="#F87171" strokeWidth="2" strokeLinecap="round" />
    <line x1="30" y1="90" x2="90" y2="90" stroke="#94A3B8" strokeWidth="1.5" />
    <circle cx="60" cy="90" r="3" fill="#60A5FA" />
  </svg>
);

export const RisingInflection = () => (
  <svg viewBox="0 0 120 120" className="w-[8rem] max-w-full h-auto mx-auto vector-graphic text-slate-800 dark:text-slate-200" aria-hidden="true">
    <path d="M 20 100 C 60 20, 60 100, 100 20" fill="none" stroke="#F87171" strokeWidth="2" strokeLinecap="round" />
    <line x1="30" y1="60" x2="90" y2="60" stroke="#94A3B8" strokeWidth="1.5" />
    <circle cx="60" cy="60" r="3" fill="#60A5FA" />
  </svg>
);

export const FallingInflection = () => (
  <svg viewBox="0 0 120 120" className="w-[8rem] max-w-full h-auto mx-auto vector-graphic text-slate-800 dark:text-slate-200" aria-hidden="true">
    <path d="M 20 20 C 60 100, 60 20, 100 100" fill="none" stroke="#F87171" strokeWidth="2" strokeLinecap="round" />
    <line x1="30" y1="60" x2="90" y2="60" stroke="#94A3B8" strokeWidth="1.5" />
    <circle cx="60" cy="60" r="3" fill="#60A5FA" />
  </svg>
);

export const IncreasingFunctionGraph = () => (
  <svg viewBox="0 0 400 120" className="w-[24rem] max-w-full h-auto mx-auto vector-graphic text-slate-800 dark:text-slate-200" aria-hidden="true">
    <path d="M 30 90 Q 70 30 150 10" fill="none" stroke="#F87171" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M 20 80 L 140 0" fill="none" stroke="#94A3B8" strokeWidth="1.5" />
    <circle cx="80" cy="40" r="2.5" fill="#60A5FA" />
    
    <rect x="160" y="35" width="80" height="50" rx="2" fill="transparent" stroke="#7C3AED" strokeWidth="2.5" />
    <text x="185" y="55" fill="currentColor" fontSize="14" fontWeight="bold" textAnchor="middle">dy</text>
    <line x1="175" y1="60" x2="195" y2="60" stroke="currentColor" strokeWidth="1.5" />
    <text x="185" y="74" fill="currentColor" fontSize="14" fontWeight="bold" textAnchor="middle">dx</text>
    <text x="215" y="65" fill="currentColor" fontSize="16" fontWeight="bold" textAnchor="middle">&gt; 0</text>
    
    <path d="M 250 110 Q 330 90 370 30" fill="none" stroke="#F87171" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M 260 120 L 380 40" fill="none" stroke="#94A3B8" strokeWidth="1.5" />
    <circle cx="320" cy="80" r="2.5" fill="#60A5FA" />
  </svg>
);

export const DecreasingFunctionGraph = () => (
  <svg viewBox="0 0 400 120" className="w-[24rem] max-w-full h-auto mx-auto vector-graphic text-slate-800 dark:text-slate-200" aria-hidden="true">
    <path d="M 30 30 Q 70 90 150 110" fill="none" stroke="#F87171" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M 20 40 L 140 120" fill="none" stroke="#94A3B8" strokeWidth="1.5" />
    <circle cx="80" cy="80" r="2.5" fill="#60A5FA" />
    
    <rect x="160" y="35" width="80" height="50" rx="2" fill="transparent" stroke="#7C3AED" strokeWidth="2.5" />
    <text x="185" y="55" fill="currentColor" fontSize="14" fontWeight="bold" textAnchor="middle">dy</text>
    <line x1="175" y1="60" x2="195" y2="60" stroke="currentColor" strokeWidth="1.5" />
    <text x="185" y="74" fill="currentColor" fontSize="14" fontWeight="bold" textAnchor="middle">dx</text>
    <text x="215" y="65" fill="currentColor" fontSize="16" fontWeight="bold" textAnchor="middle">&lt; 0</text>
    
    <path d="M 250 10 Q 330 30 370 90" fill="none" stroke="#F87171" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M 260 0 L 380 80" fill="none" stroke="#94A3B8" strokeWidth="1.5" />
    <circle cx="320" cy="40" r="2.5" fill="#60A5FA" />
  </svg>
);

export const IncDecCombinedGraph = () => (
  <svg viewBox="0 0 400 400" className="w-[30rem] max-w-full h-auto mx-auto vector-graphic text-slate-800 dark:text-slate-200" aria-hidden="true">
    <defs>
      <marker id="arrow-green" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#34D399" />
      </marker>
      <marker id="arrow-blue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#60A5FA" />
      </marker>
    </defs>
    
    {/* Axes */}
    <line x1="60" y1="250" x2="340" y2="250" stroke="currentColor" strokeWidth="1.5" />
    <line x1="220" y1="40" x2="220" y2="360" stroke="currentColor" strokeWidth="1.5" />
    
    {/* Curve */}
    <path d="M 100 350 Q 125 100, 150 100 T 200 200 T 250 300 T 300 50" fill="none" stroke="#F87171" strokeWidth="2" strokeLinejoin="round" />
    
    {/* Arrows Left (Increasing) */}
    <line x1="90" y1="300" x2="105" y2="200" stroke="#34D399" strokeWidth="3" markerEnd="url(#arrow-green)" strokeLinecap="round" />
    <line x1="105" y1="180" x2="120" y2="110" stroke="#34D399" strokeWidth="3" markerEnd="url(#arrow-green)" strokeLinecap="round" />

    {/* Arrows Middle (Decreasing) */}
    <line x1="165" y1="110" x2="185" y2="180" stroke="#60A5FA" strokeWidth="3" markerEnd="url(#arrow-blue)" strokeLinecap="round" />
    <line x1="195" y1="210" x2="215" y2="280" stroke="#60A5FA" strokeWidth="3" markerEnd="url(#arrow-blue)" strokeLinecap="round" />

    {/* Arrows Right (Increasing) */}
    <line x1="265" y1="300" x2="275" y2="200" stroke="#34D399" strokeWidth="3" markerEnd="url(#arrow-green)" strokeLinecap="round" />
    <line x1="280" y1="180" x2="290" y2="80" stroke="#34D399" strokeWidth="3" markerEnd="url(#arrow-green)" strokeLinecap="round" />

    {/* Text Labels */}
    <g fill="#34D399" fontSize="14" fontWeight="bold" textAnchor="middle">
      <text x="50" y="215">dy</text>
      <line x1="40" y1="220" x2="60" y2="220" stroke="#34D399" strokeWidth="1.5" />
      <text x="50" y="235">dx</text>
      <text x="75" y="225">&gt; 0</text>
    </g>

    <g fill="#60A5FA" fontSize="14" fontWeight="bold" textAnchor="middle">
      <text x="215" y="105">dy</text>
      <line x1="205" y1="110" x2="225" y2="110" stroke="#60A5FA" strokeWidth="1.5" />
      <text x="215" y="125">dx</text>
      <text x="240" y="115">&lt; 0</text>
    </g>

    <g fill="#34D399" fontSize="14" fontWeight="bold" textAnchor="middle">
      <text x="315" y="145">dy</text>
      <line x1="305" y1="150" x2="325" y2="150" stroke="#34D399" strokeWidth="1.5" />
      <text x="315" y="165">dx</text>
      <text x="340" y="155">&gt; 0</text>
    </g>
  </svg>
);

export const TrigRatiosRightAngle = () => (
   <svg viewBox="-20 -20 200 160" className="w-[12rem] max-w-full h-auto mx-auto drop-shadow-md vector-graphic" aria-hidden="true">
    <path d="M 20 120 L 160 120 L 160 40 Z" fill="none" stroke="#60A5FA" strokeWidth="3" strokeLinejoin="round" />
    <path d="M 140 120 L 140 100 L 160 100" fill="none" stroke="#60A5FA" strokeWidth="2" />
    
    <path d="M 50 120 A 30 30 0 0 0 46 105" fill="none" stroke="#94A3B8" strokeWidth="1.5" />
    <text x="55" y="112" fill="#CBD5E1" fontSize="16" fontStyle="italic">x</text>
    
    <text x="80" y="145" fill="#34D399" fontSize="16" fontWeight="bold">Adjacent (A)</text>
    <text x="170" y="85" fill="#F87171" fontSize="16" fontWeight="bold" transform="rotate(-90 170 85)">Opposite (O)</text>
    
    <g transform="rotate(-30 80 65)">
       <text x="80" y="65" fill="#FBBF24" fontSize="16" fontWeight="bold">Hypotenuse (H)</text>
    </g>
  </svg>
);

export const Example1Diagram = () => (
  <svg viewBox="0 0 200 200" className="w-[12rem] max-w-full h-auto mx-auto vector-graphic text-slate-100" aria-hidden="true">
    <rect x="20" y="20" width="160" height="160" fill="none" stroke="currentColor" strokeWidth="3" />
    <path d="M 20 60 L 60 60 L 60 20 M 140 20 L 140 60 L 180 60 M 180 140 L 140 140 L 140 180 M 60 180 L 60 140 L 20 140" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5 5" className="opacity-60" />
    
    <text x="40" y="52" fill="currentColor" fontSize="14" textAnchor="middle" fontStyle="italic">x</text>
    <text x="52" y="45" fill="currentColor" fontSize="14" textAnchor="end" fontStyle="italic">x</text>
    
    <text x="160" y="52" fill="currentColor" fontSize="14" textAnchor="middle" fontStyle="italic">x</text>
    <text x="148" y="45" fill="currentColor" fontSize="14" textAnchor="start" fontStyle="italic">x</text>

    <text x="40" y="158" fill="currentColor" fontSize="14" textAnchor="middle" fontStyle="italic">x</text>
    <text x="52" y="165" fill="currentColor" fontSize="14" textAnchor="end" fontStyle="italic">x</text>

    <text x="160" y="158" fill="currentColor" fontSize="14" textAnchor="middle" fontStyle="italic">x</text>
    <text x="148" y="165" fill="currentColor" fontSize="14" textAnchor="start" fontStyle="italic">x</text>
  </svg>
);

export const Example2Diagram = () => (
  <svg viewBox="0 0 280 140" className="w-[16rem] max-w-full h-auto mx-auto vector-graphic text-slate-100" aria-hidden="true">
    {/* Dashed hidden edges (inside/back) */}
    <path d="M 140 20 L 140 60 M 40 90 L 140 60 L 240 90" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" className="opacity-50" />
    
    {/* Solid visible verticals */}
    <path d="M 40 50 L 40 90 M 140 80 L 140 120 M 240 50 L 240 90" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    
    {/* Solid bottom edges (front) */}
    <path d="M 40 90 L 140 120 L 240 90" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    
    {/* Solid top edges (rim) */}
    <path d="M 140 20 L 240 50 L 140 80 L 40 50 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

export const DerivedEx1 = () => (
  <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
    <svg viewBox="-50 -50 100 100" className="w-[12rem] h-auto vector-graphic text-slate-100">
      <line x1="-50" y1="0" x2="50" y2="0" stroke="currentColor" strokeWidth="1" />
      <line x1="0" y1="-50" x2="0" y2="50" stroke="currentColor" strokeWidth="1" />
      {/* Parabola min at x=-10 (representing -1), y=25 (representing -11 below axis) */}
      <path d="M -40 -40 Q -10 90 20 -40" fill="none" stroke="#86efac" strokeWidth="2" />
      <circle cx="-10" cy="25" r="2" fill="currentColor" />
      <text x="-10" y="35" fill="currentColor" fontSize="8" textAnchor="middle">(-1, -11)</text>
      <text x="-40" y="-30" fill="currentColor" fontSize="10" textAnchor="middle">f(x)</text>
    </svg>
    <div className="text-2xl text-slate-400">→</div>
    <svg viewBox="-50 -50 100 100" className="w-[12rem] h-auto vector-graphic text-slate-100">
      <line x1="-50" y1="0" x2="50" y2="0" stroke="currentColor" strokeWidth="1" />
      <line x1="0" y1="-50" x2="0" y2="50" stroke="currentColor" strokeWidth="1" />
      {/* Straight line crossing through x=-10 */}
      <line x1="-30" y1="40" x2="20" y2="-60" stroke="#86efac" strokeWidth="2" />
      <circle cx="-10" cy="0" r="2" fill="currentColor" />
      <text x="-12" y="-5" fill="currentColor" fontSize="8" textAnchor="end">-1</text>
      <text x="-30" y="-30" fill="currentColor" fontSize="10" textAnchor="middle">f'(x)</text>
    </svg>
  </div>
);

export const DerivedEx2 = () => (
  <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
    <svg viewBox="-30 -50 70 100" className="w-[12rem] h-auto vector-graphic text-slate-100">
      <line x1="-30" y1="0" x2="40" y2="0" stroke="currentColor" strokeWidth="1" />
      <line x1="0" y1="-50" x2="0" y2="50" stroke="currentColor" strokeWidth="1" />
      {/* Cubic with max at 0, min at x=20 (representing 3) */}
      <path d="M -20 50 Q -10 10, 0 10 C 10 10, 10 30, 20 30 Q 30 30, 35 -40" fill="none" stroke="#86efac" strokeWidth="2" />
      <circle cx="0" cy="10" r="2" fill="currentColor" />
      <circle cx="20" cy="30" r="2" fill="currentColor" />
      <text x="-3" y="20" fill="#a78bfa" fontSize="8" textAnchor="end" className="opacity-90">(0, -6)</text>
      <text x="24" y="32" fill="currentColor" fontSize="8" textAnchor="start">(3, -18)</text>
      <text x="-20" y="-30" fill="currentColor" fontSize="10">f(x)</text>
    </svg>
    <div className="text-2xl text-slate-400">→</div>
    <svg viewBox="-30 -50 70 100" className="w-[12rem] h-auto vector-graphic text-slate-100">
      <line x1="-30" y1="0" x2="40" y2="0" stroke="currentColor" strokeWidth="1" />
      <line x1="0" y1="-50" x2="0" y2="50" stroke="currentColor" strokeWidth="1" />
      {/* upward Parabola roots at 0 and 20 */}
      <path d="M -10 -30 Q 10 50 30 -30" fill="none" stroke="#86efac" strokeWidth="2" />
      <circle cx="0" cy="0" r="2" fill="currentColor" />
      <circle cx="20" cy="0" r="2" fill="currentColor" />
      <text x="-5" y="-5" fill="currentColor" fontSize="8" textAnchor="middle">0</text>
      <text x="25" y="-5" fill="currentColor" fontSize="8" textAnchor="middle">3</text>
      <text x="-15" y="-35" fill="currentColor" fontSize="10">f'(x)</text>
    </svg>
  </div>
);

export const DerivedEx3 = () => (
  <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
    <svg viewBox="-30 -50 70 100" className="w-[12rem] h-auto vector-graphic text-slate-100">
      <line x1="-30" y1="0" x2="40" y2="0" stroke="currentColor" strokeWidth="1" />
      <line x1="0" y1="-50" x2="0" y2="50" stroke="currentColor" strokeWidth="1" />
      {/* Cubic with inflection at 0, max at x=20 (representing 1.5) */}
      <path d="M -20 50 C -10 10, -10 -10, 0 -10 C 10 -10, 10 -30, 20 -30 C 30 -30, 30 10, 35 50" fill="none" stroke="#f87171" strokeWidth="2" />
      <circle cx="0" cy="-10" r="2" fill="#60A5FA" />
      <circle cx="20" cy="-30" r="2" fill="#34D399" />
      <text x="-5" y="-14" fill="#60A5FA" fontSize="8" textAnchor="end" className="opacity-90">(0, 5)</text>
      <text x="20" y="-36" fill="#34D399" fontSize="8" textAnchor="middle" className="opacity-90">(1.5, 8.375)</text>
      <text x="-25" y="-40" fill="currentColor" fontSize="10">f(x)</text>
    </svg>
    <div className="text-2xl text-slate-400">→</div>
    <svg viewBox="-30 -50 70 100" className="w-[12rem] h-auto vector-graphic text-slate-100">
      <line x1="-30" y1="0" x2="40" y2="0" stroke="currentColor" strokeWidth="1" />
      <line x1="0" y1="-50" x2="0" y2="50" stroke="currentColor" strokeWidth="1" />
      {/* touch at 0, stay positive, then cross at 20 */}
      <path d="M -15 -40 Q -5 0, 0 0 Q 5 0, 10 -15 T 20 0 Q 25 30, 30 50" fill="none" stroke="#f87171" strokeWidth="2" />
      <circle cx="0" cy="0" r="2" fill="currentColor" />
      <circle cx="20" cy="0" r="2" fill="currentColor" />
      <text x="-5" y="-5" fill="currentColor" fontSize="8" textAnchor="end">0</text>
      <text x="25" y="-5" fill="currentColor" fontSize="8" textAnchor="start">1.5</text>
      <text x="-20" y="-40" fill="currentColor" fontSize="10">f'(x)</text>
    </svg>
  </div>
);

export const DiscriminantDiagram = () => (
  <div className="flex flex-row flex-wrap gap-6 items-center justify-center pt-8">
    <div className="flex flex-col items-center">
      <svg viewBox="-50 -50 100 100" className="w-[10rem] h-auto vector-graphic text-slate-100">
        <line x1="-50" y1="0" x2="50" y2="0" stroke="currentColor" strokeWidth="1" />
        <line x1="0" y1="-50" x2="0" y2="50" stroke="currentColor" strokeWidth="1" />
        <path d="M -35 -40 Q 0 80 35 -40" fill="none" stroke="#F87171" strokeWidth="2" />
        <circle cx="-16" cy="0" r="2" fill="#34D399" />
        <circle cx="16" cy="0" r="2" fill="#60A5FA" />
      </svg>
      <div className="mt-4 text-center">
        <p className="font-semibold text-sm"><span className="italic">b</span>² − 4<span className="italic">ac</span> &gt; 0</p>
        <p className="text-xs text-slate-400">2 real and distinct roots</p>
      </div>
    </div>
    <div className="flex flex-col items-center">
      <svg viewBox="-50 -50 100 100" className="w-[10rem] h-auto vector-graphic text-slate-100">
        <line x1="-50" y1="0" x2="50" y2="0" stroke="currentColor" strokeWidth="1" />
        <line x1="0" y1="-50" x2="0" y2="50" stroke="currentColor" strokeWidth="1" />
        <path d="M -30 -50 Q 0 50 30 -50" fill="none" stroke="#F87171" strokeWidth="2" />
        <circle cx="0" cy="0" r="2" fill="#60A5FA" />
      </svg>
      <div className="mt-4 text-center">
        <p className="font-semibold text-sm"><span className="italic">b</span>² − 4<span className="italic">ac</span> = 0</p>
        <p className="text-xs text-slate-400">1 real and equal root<br/>i.e. repeated root</p>
      </div>
    </div>
    <div className="flex flex-col items-center">
      <svg viewBox="-50 -50 100 100" className="w-[10rem] h-auto vector-graphic text-slate-100">
        <line x1="-50" y1="0" x2="50" y2="0" stroke="currentColor" strokeWidth="1" />
        <line x1="0" y1="-50" x2="0" y2="50" stroke="currentColor" strokeWidth="1" />
        <path d="M -30 -60 Q 0 40 30 -60" fill="none" stroke="#F87171" strokeWidth="2" />
      </svg>
      <div className="mt-4 text-center">
        <p className="font-semibold text-sm"><span className="italic">b</span>² − 4<span className="italic">ac</span> &lt; 0</p>
        <p className="text-xs text-slate-400">No real roots</p>
      </div>
    </div>
  </div>
);

export const IntersectionDiagram = () => (
  <div className="flex flex-row flex-wrap gap-6 items-center justify-center pt-8">
    <div className="flex flex-col items-center">
      <svg viewBox="-50 -50 100 100" className="w-[10rem] h-auto vector-graphic text-slate-100">
        <line x1="-50" y1="0" x2="50" y2="0" stroke="currentColor" strokeWidth="1" />
        <line x1="0" y1="-50" x2="0" y2="50" stroke="currentColor" strokeWidth="1" />
        <path d="M -30 -40 Q 0 80 30 -40" fill="none" stroke="#F87171" strokeWidth="2" />
        <line x1="-40" y1="30" x2="40" y2="-20" stroke="#A78BFA" strokeWidth="2" />
        <circle cx="-18" cy="16" r="2" fill="currentColor" />
        <circle cx="12" cy="-2.5" r="2" fill="currentColor" />
      </svg>
      <div className="mt-4 text-center">
        <p className="font-semibold text-sm"><span className="italic">b</span>² − 4<span className="italic">ac</span> &gt; 0</p>
        <p className="text-xs text-slate-400">The line meets the<br/>parabola at two<br/>distinct points</p>
      </div>
    </div>
    <div className="flex flex-col items-center">
      <svg viewBox="-50 -50 100 100" className="w-[10rem] h-auto vector-graphic text-slate-100">
        <line x1="-50" y1="0" x2="50" y2="0" stroke="currentColor" strokeWidth="1" />
        <line x1="0" y1="-50" x2="0" y2="50" stroke="currentColor" strokeWidth="1" />
        <path d="M -30 -30 Q 0 50 30 -30" fill="none" stroke="#F87171" strokeWidth="2" />
        <line x1="-40" y1="40" x2="40" y2="0" stroke="#A78BFA" strokeWidth="2" />
        <circle cx="0" cy="20" r="2" fill="currentColor" />
      </svg>
      <div className="mt-4 text-center">
        <p className="font-semibold text-sm"><span className="italic">b</span>² − 4<span className="italic">ac</span> = 0</p>
        <p className="text-xs text-slate-400">The line meets the<br/>parabola once<br/>i.e. the line is a tangent<br/>to the parabola</p>
      </div>
    </div>
    <div className="flex flex-col items-center">
      <svg viewBox="-50 -50 100 100" className="w-[10rem] h-auto vector-graphic text-slate-100">
        <line x1="-50" y1="0" x2="50" y2="0" stroke="currentColor" strokeWidth="1" />
        <line x1="0" y1="-50" x2="0" y2="50" stroke="currentColor" strokeWidth="1" />
        <path d="M -30 -30 Q 0 50 30 -30" fill="none" stroke="#F87171" strokeWidth="2" />
        <line x1="-40" y1="60" x2="40" y2="20" stroke="#A78BFA" strokeWidth="2" />
      </svg>
      <div className="mt-4 text-center">
        <p className="font-semibold text-sm"><span className="italic">b</span>² − 4<span className="italic">ac</span> &lt; 0</p>
        <p className="text-xs text-slate-400">The line does not<br/>meet the parabola</p>
      </div>
    </div>
  </div>
);

export const InequalitiesDiagram = () => (
  <div className="flex flex-row flex-wrap gap-6 items-center justify-center pt-8">
    <div className="flex flex-col items-center">
      <svg viewBox="-60 -60 120 120" className="w-[14rem] h-auto vector-graphic text-slate-100">
        <path d="M -40 0 L -40 -40 L -23 -40 Q 0 50 23 -40 L 40 -40 L 40 0 Z" fill="#86efac" fillOpacity="0.3" />
        <path d="M -23 0 Q 0 80 23 0 Z" fill="#fca5a5" fillOpacity="0.3" />
        <line x1="-50" y1="0" x2="50" y2="0" stroke="currentColor" strokeWidth="1" />
        <line x1="0" y1="-50" x2="0" y2="50" stroke="currentColor" strokeWidth="1" />
        <path d="M -35 -40 Q 0 80 35 -40" fill="none" stroke="#F87171" strokeWidth="2" />
        <text x="-45" y="-15" fill="currentColor" fontSize="8" textAnchor="end"><tspan className="italic">ax</tspan>² + <tspan className="italic">bx</tspan> + <tspan className="italic">c</tspan> &gt; 0</text>
        <text x="45" y="-15" fill="currentColor" fontSize="8" textAnchor="start"><tspan className="italic">ax</tspan>² + <tspan className="italic">bx</tspan> + <tspan className="italic">c</tspan> &gt; 0</text>
        <text x="0" y="25" fill="currentColor" fontSize="8" textAnchor="middle"><tspan className="italic">ax</tspan>² + <tspan className="italic">bx</tspan> + <tspan className="italic">c</tspan> &lt; 0</text>
      </svg>
      <div className="mt-4 text-center text-sm">
        <span className="italic">y = ax² + bx + c</span> where <span className="italic">a</span> &gt; 0
      </div>
    </div>
    <div className="flex flex-col items-center">
      <svg viewBox="-60 -60 120 120" className="w-[14rem] h-auto vector-graphic text-slate-100">
        <path d="M -40 0 L -40 40 L -23 40 Q 0 -50 23 40 L 40 40 L 40 0 Z" fill="#fca5a5" fillOpacity="0.3" />
        <path d="M -23 0 Q 0 -80 23 0 Z" fill="#86efac" fillOpacity="0.3" />
        <line x1="-50" y1="0" x2="50" y2="0" stroke="currentColor" strokeWidth="1" />
        <line x1="0" y1="-50" x2="0" y2="50" stroke="currentColor" strokeWidth="1" />
        <path d="M -30 50 Q 0 -40 30 50" fill="none" stroke="#F87171" strokeWidth="2" />
        <text x="-45" y="25" fill="currentColor" fontSize="8" textAnchor="end"><tspan className="italic">ax</tspan>² + <tspan className="italic">bx</tspan> + <tspan className="italic">c</tspan> &lt; 0</text>
        <text x="45" y="25" fill="currentColor" fontSize="8" textAnchor="start"><tspan className="italic">ax</tspan>² + <tspan className="italic">bx</tspan> + <tspan className="italic">c</tspan> &lt; 0</text>
        <text x="0" y="-15" fill="currentColor" fontSize="8" textAnchor="middle"><tspan className="italic">ax</tspan>² + <tspan className="italic">bx</tspan> + <tspan className="italic">c</tspan> &gt; 0</text>
      </svg>
      <div className="mt-4 text-center text-sm">
        <span className="italic">y = ax² + bx + c</span> where <span className="italic">a</span> &lt; 0
      </div>
    </div>
  </div>
);

export const PolyCubicGraph1 = () => (
  <svg viewBox="-80 -50 40 80" className="w-[20rem] h-auto vector-graphic text-slate-100 max-w-full">
    <line x1="-80" y1="0" x2="-35" y2="0" stroke="currentColor" strokeWidth="0.5" />
    <line x1="-50" y1="-50" x2="-50" y2="30" stroke="currentColor" strokeWidth="0.5" />
    
    <path d="M -75 50 Q -70 -70, -65 -20 T -55 20 Q -52 -40, -48 -50" fill="none" stroke="#F87171" strokeWidth="1" />
    
    <circle cx="-68" cy="0" r="1" fill="#4ADE80" />
    <text x="-69" y="-2" fill="currentColor" fontSize="4" textAnchor="end">-6</text>

    <circle cx="-60" cy="0" r="1" fill="#A78BFA" />
    <text x="-61" y="-2" fill="currentColor" fontSize="4" textAnchor="end">-3</text>
    
    <circle cx="-48" cy="0" r="1" fill="#1E293B" className="text-white" />
    <text x="-47" y="-2" fill="currentColor" fontSize="4" textAnchor="start">1</text>
    
    <circle cx="-50" cy="20" r="1" fill="#60A5FA" />
    <text x="-49" y="22" fill="currentColor" fontSize="4" textAnchor="start">(0, -36)</text>
  </svg>
);

export const PolyCubicGraph2 = () => (
  <svg viewBox="-6 -2 12 14" className="w-[20rem] h-auto vector-graphic text-slate-100 max-w-full">
    <line x1="-6" y1="10" x2="6" y2="10" stroke="currentColor" strokeWidth="0.1" />
    <line x1="0" y1="-2" x2="0" y2="12" stroke="currentColor" strokeWidth="0.1" />
    
    <path d="M -2.5 14 Q -2 -10, 0 1 Q 2 12, 3 10 Q 4 -5, 5 -2" fill="none" stroke="#F87171" strokeWidth="0.15" />
    
    <circle cx="-2" cy="10" r="0.2" fill="#4ADE80" />
    <text x="-2.2" y="9.6" fill="#4ADE80" fontSize="0.8" textAnchor="end">(-2, 0)</text>
    
    <circle cx="0" cy="0.8" r="0.2" fill="#60A5FA" />
    <text x="0.4" y="0.8" fill="#60A5FA" fontSize="0.8" textAnchor="start">(0, 9)</text>

    <circle cx="3" cy="10" r="0.2" fill="#A78BFA" />
    <text x="3" y="11.2" fill="#A78BFA" fontSize="0.8" textAnchor="middle">(3, 0)</text>
  </svg>
);

export const PolyIntersectionDiagrams = () => (
  <div className="flex flex-row flex-wrap gap-6 items-center justify-center pt-8">
    <div className="flex flex-col items-center">
      <svg viewBox="-50 -50 100 100" className="w-[10rem] h-auto vector-graphic text-slate-100">
        <line x1="-50" y1="0" x2="50" y2="0" stroke="currentColor" strokeWidth="1" />
        <line x1="0" y1="-50" x2="0" y2="50" stroke="currentColor" strokeWidth="1" />
        <path d="M -30 -30 Q -15 80, 0 0 Q 15 80, 30 -30" fill="none" stroke="#F87171" strokeWidth="2" />
        <line x1="-50" y1="0" x2="50" y2="30" stroke="#93C5FD" strokeWidth="2" />
      </svg>
    </div>
    <div className="flex flex-col items-center">
      <svg viewBox="-50 -50 100 100" className="w-[10rem] h-auto vector-graphic text-slate-100">
        <line x1="-50" y1="0" x2="50" y2="0" stroke="currentColor" strokeWidth="1" />
        <line x1="0" y1="-50" x2="0" y2="50" stroke="currentColor" strokeWidth="1" />
        <path d="M -30 50 Q 0 -60 30 50" fill="none" stroke="#F87171" strokeWidth="2" />
        <line x1="-50" y1="-10" x2="50" y2="-30" stroke="#93C5FD" strokeWidth="2" />
      </svg>
    </div>
    <div className="flex flex-col items-center">
      <svg viewBox="-50 -50 100 100" className="w-[10rem] h-auto vector-graphic text-slate-100">
        <line x1="-50" y1="0" x2="50" y2="0" stroke="currentColor" strokeWidth="1" />
        <line x1="0" y1="-50" x2="0" y2="50" stroke="currentColor" strokeWidth="1" />
        <path d="M -40 -40 Q 0 40 40 -40" fill="none" stroke="#F87171" strokeWidth="2" />
        <line x1="-50" y1="30" x2="50" y2="30" stroke="#93C5FD" strokeWidth="2" />
      </svg>
    </div>
  </div>
);

export const SyntheticDivision = ({ root, coeffs, midRow, bottomRow }: { root: string | React.ReactNode, coeffs: string[], midRow: string[], bottomRow: string[] }) => (
  <div className="overflow-x-auto my-6 flex justify-center bg-black/20 p-4 rounded-xl border border-white/10">
    <table className="font-mono text-center text-sm sm:text-base border-collapse">
      <tbody>
        <tr>
          <td className="pr-3 pb-2 border-r-2 border-slate-500 text-right align-bottom">
            {root}
          </td>
          {coeffs.map((c, i) => (
            <td key={`c-${i}`} className="px-3 md:px-4 pb-2 align-bottom">{c}</td>
          ))}
        </tr>
        <tr>
          <td className="pr-3 border-r-2 border-slate-500"></td>
          {midRow.map((m, i) => (
            <td key={`m-${i}`} className="px-3 md:px-4 py-1">{m}</td>
          ))}
        </tr>
        <tr>
          <td className="pr-3 border-r-2 border-slate-500"></td>
          {bottomRow.map((b, i) => (
            <td 
              key={`b-${i}`} 
              className={`px-3 md:px-4 pt-2 border-t-2 border-slate-500 ${i === bottomRow.length - 1 ? 'border-l-2 text-green-400 font-bold' : ''}`}
            >
              {b}
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  </div>
);

export const SineWaveGraph = () => {
  const points = Array.from({ length: 360 }, (_, i) => {
    return `${i},${-Math.sin(i * Math.PI / 180) * 40}`;
  }).join(' ');

  return (
    <svg viewBox="-20 -60 400 120" className="w-[18rem] h-auto vector-graphic text-slate-100 max-w-full">
      <line x1="0" y1="0" x2="360" y2="0" stroke="currentColor" strokeWidth="1" />
      <line x1="0" y1="-50" x2="0" y2="50" stroke="currentColor" strokeWidth="1" />
      <polyline points={points} fill="none" stroke="#F87171" strokeWidth="3" />
      {[90, 180, 270, 360].map(x => (
        <text key={x} x={x} y="15" fill="currentColor" fontSize="10" textAnchor="middle">{x}</text>
      ))}
      <text x="-5" y="-36" fill="currentColor" fontSize="10" textAnchor="end">1</text>
      <text x="-5" y="44" fill="currentColor" fontSize="10" textAnchor="end">-1</text>
    </svg>
  );
};

export const CosineWaveGraph = () => {
  const points = Array.from({ length: 360 }, (_, i) => {
    return `${i},${-Math.cos(i * Math.PI / 180) * 40}`;
  }).join(' ');

  return (
    <svg viewBox="-20 -60 400 120" className="w-[18rem] h-auto vector-graphic text-slate-100 max-w-full">
      <line x1="0" y1="0" x2="360" y2="0" stroke="currentColor" strokeWidth="1" />
      <line x1="0" y1="-50" x2="0" y2="50" stroke="currentColor" strokeWidth="1" />
      <polyline points={points} fill="none" stroke="#60A5FA" strokeWidth="3" />
      {[90, 180, 270, 360].map(x => (
        <text key={x} x={x} y="15" fill="currentColor" fontSize="10" textAnchor="middle">{x}</text>
      ))}
      <text x="-5" y="-36" fill="currentColor" fontSize="10" textAnchor="end">1</text>
      <text x="-5" y="44" fill="currentColor" fontSize="10" textAnchor="end">-1</text>
    </svg>
  );
};

export const SineAddCosineWaveGraph = () => {
  const points = Array.from({ length: 360 }, (_, i) => {
    return `${i},${-(Math.sin(i * Math.PI / 180) + Math.cos(i * Math.PI / 180)) * 40}`;
  }).join(' ');

  return (
    <svg viewBox="-20 -90 400 180" className="w-[18rem] h-auto vector-graphic text-slate-100 max-w-full">
      <line x1="0" y1="0" x2="360" y2="0" stroke="currentColor" strokeWidth="1" />
      <line x1="0" y1="-80" x2="0" y2="80" stroke="currentColor" strokeWidth="1" />
      <polyline points={points} fill="none" stroke="#4ADE80" strokeWidth="3" />
      {[90, 180, 270, 360].map(x => (
        <text key={x} x={x} y="15" fill="currentColor" fontSize="10" textAnchor="middle">{x}</text>
      ))}
      <text x="-5" y="-53" fill="currentColor" fontSize="10" textAnchor="end">√2</text>
      <text x="-5" y="60" fill="currentColor" fontSize="10" textAnchor="end">-√2</text>
    </svg>
  );
};

export const MinMaxSineGraph = ({ radians = false }: { radians?: boolean }) => {
  const points = Array.from({ length: 360 }, (_, i) => {
    return `${i},${-Math.sin(i * Math.PI / 180) * 40}`;
  }).join(' ');

  return (
    <svg viewBox="-30 -70 420 140" className="w-[18rem] h-auto vector-graphic text-slate-100 max-w-full bg-slate-900/50 p-4 rounded-xl border border-white/5">
      <line x1="0" y1="0" x2="360" y2="0" stroke="currentColor" strokeWidth="1" />
      <line x1="0" y1="-50" x2="0" y2="50" stroke="currentColor" strokeWidth="1" />
      <polyline points={points} fill="none" stroke="#60A5FA" strokeWidth="2" />
      
      {/* Max point */}
      <circle cx="90" cy="-40" r="3" fill="#60A5FA" />
      <text x="90" y="-50" fill="#60A5FA" fontSize="12" textAnchor="middle" fontWeight="bold">
        {radians ? '(\\u03C0/2, 1)' : '(90\\u00B0, 1)'}
      </text>

      {/* Min point */}
      <circle cx="270" cy="40" r="3" fill="#60A5FA" />
      <text x="270" y="55" fill="#60A5FA" fontSize="12" textAnchor="middle" fontWeight="bold">
        {radians ? '(3\\u03C0/2, -1)' : '(270\\u00B0, -1)'}
      </text>

      {/* Axis labels */}
      {[90, 180, 270, 360].map(x => {
         const labels = radians ? ['\u03C0/2', '\u03C0', '3\u03C0/2', '2\u03C0'] : ['90', '180', '270', '360'];
         const i = (x / 90) - 1;
         return <text key={x} x={x} y="15" fill="currentColor" fontSize="10" textAnchor="middle">{labels[i]}</text>;
      })}
      
      <text x="-5" y="-36" fill="currentColor" fontSize="10" textAnchor="end">1</text>
      <text x="-5" y="44" fill="currentColor" fontSize="10" textAnchor="end">-1</text>
      <text x="180" y="-52" fill="#60A5FA" fontSize="14" textAnchor="middle" fontWeight="bold" fontStyle="italic">f(x) = sin x</text>
    </svg>
  );
};

export const MinMaxCosineGraph = ({ radians = false }: { radians?: boolean }) => {
  const points = Array.from({ length: 360 }, (_, i) => {
    return `${i},${-Math.cos(i * Math.PI / 180) * 40}`;
  }).join(' ');

  return (
    <svg viewBox="-30 -70 420 140" className="w-[18rem] h-auto vector-graphic text-slate-100 max-w-full bg-slate-900/50 p-4 rounded-xl border border-white/5">
      <line x1="0" y1="0" x2="360" y2="0" stroke="currentColor" strokeWidth="1" />
      <line x1="0" y1="-50" x2="0" y2="50" stroke="currentColor" strokeWidth="1" />
      <polyline points={points} fill="none" stroke="#F87171" strokeWidth="2" />
      
      {/* Max points */}
      <circle cx="0" cy="-40" r="3" fill="#F87171" />
      <text x="0" y="-50" fill="#F87171" fontSize="12" textAnchor="middle" fontWeight="bold">
        {radians ? '(0, 1)' : '(0\\u00B0, 1)'}
      </text>

      <circle cx="360" cy="-40" r="3" fill="#F87171" />
      <text x="360" y="-50" fill="#F87171" fontSize="12" textAnchor="middle" fontWeight="bold">
        {radians ? '(2\\u03C0, 1)' : '(360\\u00B0, 1)'}
      </text>

      {/* Min point */}
      <circle cx="180" cy="40" r="3" fill="#F87171" />
      <text x="180" y="55" fill="#F87171" fontSize="12" textAnchor="middle" fontWeight="bold">
        {radians ? '(\\u03C0, -1)' : '(180\\u00B0, -1)'}
      </text>

      {/* Axis labels */}
      {[90, 180, 270, 360].map(x => {
         const labels = radians ? ['\u03C0/2', '\u03C0', '3\u03C0/2', '2\u03C0'] : ['90', '180', '270', '360'];
         const i = (x / 90) - 1;
         return <text key={x} x={x} y="15" fill="currentColor" fontSize="10" textAnchor="middle">{labels[i]}</text>;
      })}
      
      <text x="-5" y="-36" fill="currentColor" fontSize="10" textAnchor="end">1</text>
      <text x="-5" y="44" fill="currentColor" fontSize="10" textAnchor="end">-1</text>
      <text x="180" y="-52" fill="#F87171" fontSize="14" textAnchor="middle" fontWeight="bold" fontStyle="italic">f(x) = cos x</text>
    </svg>
  );
};


export const AreaUnderCurveIntroGraph = () => {
    return (
        <svg viewBox="-20 -20 220 220" className="w-[18rem] h-auto vector-graphic text-slate-100 max-w-full">
            <line x1="0" y1="200" x2="200" y2="200" stroke="currentColor" strokeWidth="1" />
            <line x1="10" y1="210" x2="10" y2="10" stroke="currentColor" strokeWidth="1" />
            
            <path d="M 20 195 Q 100 180 180 50" fill="rgba(59, 130, 246, 0.2)" stroke="none" />
            <path d="M 180 50 L 180 200 L 20 200 Z" fill="rgba(59, 130, 246, 0.2)" stroke="none" />
            
            <path d="M 20 195 Q 100 180 180 50" fill="none" stroke="#60A5FA" strokeWidth="2" />
            
            <line x1="180" y1="50" x2="180" y2="200" stroke="#60A5FA" strokeWidth="1" strokeDasharray="4 4" />
            <text x="20" y="215" fill="currentColor" fontSize="12" textAnchor="middle">a</text>
            <text x="180" y="215" fill="currentColor" fontSize="12" textAnchor="middle">b</text>
            <text x="195" y="45" fill="currentColor" fontSize="14" fontStyle="italic">y = f(x)</text>
        </svg>
    )
}

export const AreaUnderCurveEx1Graph = () => {
    return (
        <svg viewBox="-20 -50 220 250" className="w-[18rem] h-auto vector-graphic text-slate-100 max-w-full">
            <line x1="0" y1="130" x2="200" y2="130" stroke="currentColor" strokeWidth="1" />
            <line x1="50" y1="200" x2="50" y2="-20" stroke="currentColor" strokeWidth="1" />
            
            <path d="M 150 130 Q 162.5 75 175 -30 L 175 130 Z" fill="rgba(59, 130, 246, 0.2)" stroke="none" />
            <path d="M 30 -30 Q 100 250 175 -30" fill="none" stroke="currentColor" strokeWidth="2" />
            
            <line x1="175" y1="-30" x2="175" y2="130" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
            <text x="150" y="145" fill="currentColor" fontSize="12" textAnchor="middle">4</text>
            <text x="175" y="145" fill="currentColor" fontSize="12" textAnchor="middle">5</text>
            <text x="30" y="-40" fill="currentColor" fontSize="14" fontStyle="italic">y = x² - 4x</text>
        </svg>
    )
}

export const AreaUnderCurveEx2Graph = () => {
    return (
        <svg viewBox="-20 -20 220 220" className="w-[18rem] h-auto vector-graphic text-slate-100 max-w-full">
            <line x1="0" y1="100" x2="200" y2="100" stroke="currentColor" strokeWidth="1" />
            <line x1="50" y1="200" x2="50" y2="20" stroke="currentColor" strokeWidth="1" />
            
            <path d="M 100 100 Q 125 50 150 100" fill="rgba(59, 130, 246, 0.2)" stroke="none" />
            <path d="M 50 200 Q 125 -60 200 200" fill="none" stroke="currentColor" strokeWidth="2" />
            
            <text x="100" y="95" fill="currentColor" fontSize="12" textAnchor="middle">2</text>
            <text x="150" y="95" fill="currentColor" fontSize="12" textAnchor="middle">3</text>
            <text x="150" y="215" fill="currentColor" fontSize="14" fontStyle="italic">y = -x² + 5x - 6</text>
        </svg>
    )
}

export const AreaBetweenCurvesIntroGraph = () => {
    return (
        <svg viewBox="-20 -20 220 220" className="w-[18rem] h-auto vector-graphic text-slate-100 max-w-full">
            <line x1="0" y1="150" x2="200" y2="150" stroke="currentColor" strokeWidth="1" />
            <line x1="100" y1="200" x2="100" y2="10" stroke="currentColor" strokeWidth="1" />
            
            <path d="M 60 150 Q 80 120 120 150 L 120 150 Q 100 170 60 150" fill="rgba(59, 130, 246, 0.2)" stroke="none" />
            
            <path d="M 20 190 Q 100 60 180 190" fill="none" stroke="#60A5FA" strokeWidth="2" />
            <path d="M 20 40 Q 100 190 180 40" fill="none" stroke="#4ADE80" strokeWidth="2" />
            
            <text x="50" y="165" fill="#F87171" fontSize="12" textAnchor="middle">a</text>
            <text x="125" y="165" fill="#C084FC" fontSize="12" textAnchor="middle">b</text>
            <line x1="60" y1="150" x2="60" y2="155" stroke="currentColor" />
            <line x1="120" y1="150" x2="120" y2="155" stroke="currentColor" />

            <circle cx="60" cy="150" r="2" fill="currentColor" />
            <circle cx="120" cy="150" r="2" fill="currentColor" />
            
            <text x="195" y="195" fill="#60A5FA" fontSize="12" fontStyle="italic">y = f(x)</text>
            <text x="195" y="55" fill="#4ADE80" fontSize="12" fontStyle="italic">y = g(x)</text>
        </svg>
    )
}

export const AreaBetweenCurvesEx1Graph = () => {
    return (
        <svg viewBox="-20 -20 220 220" className="w-[18rem] h-auto vector-graphic text-slate-100 max-w-full">
            <line x1="0" y1="180" x2="200" y2="180" stroke="currentColor" strokeWidth="1" />
            <line x1="100" y1="200" x2="100" y2="10" stroke="currentColor" strokeWidth="1" />
            <path d="M 80 150 L 160 50 Q 120 160 80 150" fill="rgba(59, 130, 246, 0.2)" stroke="none" />
            
            <path d="M 20 50 Q 100 200 180 50" fill="none" stroke="#4ADE80" strokeWidth="2" />
            <line x1="20" y1="225" x2="180" y2="25" stroke="#60A5FA" strokeWidth="2" />
            
            <circle cx="80" cy="150" r="3" fill="#60A5FA" />
            <circle cx="160" cy="50" r="3" fill="#60A5FA" />
            
            <text x="95" y="145" fill="#60A5FA" fontSize="10">(-1, 12)</text>
            <text x="165" y="45" fill="#60A5FA" fontSize="10">(3, 28)</text>
            <text x="50" y="40" fill="#4ADE80" fontSize="12" fontStyle="italic">y = 2x² + 10</text>
            <text x="180" y="15" fill="#60A5FA" fontSize="12" fontStyle="italic">y = 4x + 16</text>
        </svg>
    )
}

export const AreaBetweenCurvesEx2Graph = () => {
    return (
        <svg viewBox="-20 -20 220 220" className="w-[18rem] h-auto vector-graphic text-slate-100 max-w-full">
            <line x1="0" y1="80" x2="200" y2="80" stroke="currentColor" strokeWidth="1" />
            <line x1="100" y1="200" x2="100" y2="10" stroke="currentColor" strokeWidth="1" />
            
            <path d="M 60 180 Q 100 20 140 180 Q 100 80 60 180" fill="rgba(59, 130, 246, 0.2)" stroke="none" />
            
            <path d="M 40 230 Q 100 -20 160 230" fill="none" stroke="#4ADE80" strokeWidth="2" />
            <path d="M 40 230 Q 100 80 160 230" fill="none" stroke="#60A5FA" strokeWidth="2" />
            
            <circle cx="60" cy="180" r="2" fill="#60A5FA" />
            <circle cx="140" cy="180" r="2" fill="#60A5FA" />
            
            <text x="60" y="15" fill="#4ADE80" fontSize="12" fontStyle="italic">y = 6 - 3x²</text>
            <text x="140" y="170" fill="#60A5FA" fontSize="12" fontStyle="italic">y = -3 - 2x²</text>
        </svg>
    )
}

export const AreaBetweenCurvesEx3Graph = () => {
    return (
        <svg viewBox="-20 -40 220 260" className="w-[18rem] h-auto vector-graphic text-slate-100 max-w-full">
            <line x1="0" y1="180" x2="200" y2="180" stroke="currentColor" strokeWidth="1" />
            <line x1="60" y1="220" x2="60" y2="-20" stroke="currentColor" strokeWidth="1" />
            
            <path d="M 50 180 L 110 120 Q 90 220 50 180" fill="rgba(59, 130, 246, 0.2)" stroke="none" />
            <path d="M 110 120 L 150 80 Q 140 160 110 120" fill="rgba(59, 130, 246, 0.2)" stroke="none" />
            
            <path d="M 40 220 Q 50 180 60 100 T 110 120 T 130 180 T 160 20 T 180 -20" fill="none" stroke="#4ADE80" strokeWidth="2" />
            <line x1="10" y1="220" x2="180" y2="50" stroke="#60A5FA" strokeWidth="2" />
            
            <text x="40" y="195" fill="currentColor" fontSize="12">-1</text>
            <text x="110" y="195" fill="currentColor" fontSize="12">2</text>
            <text x="150" y="195" fill="currentColor" fontSize="12">6</text>

            <line x1="110" y1="180" x2="110" y2="120" stroke="currentColor" strokeDasharray="2 2" />
            <line x1="150" y1="180" x2="150" y2="80" stroke="currentColor" strokeDasharray="2 2" />
            
            <text x="160" y="160" fill="#4ADE80" fontSize="12" fontStyle="italic">f(x)</text>
            <text x="160" y="45" fill="#60A5FA" fontSize="12" fontStyle="italic">g(x)</text>
        </svg>
    )
}

export const AreaUnderXAxisIntroGraph = () => {
    return (
        <svg viewBox="-20 -20 220 220" className="w-[18rem] h-auto vector-graphic text-slate-100 max-w-full">
            <line x1="0" y1="100" x2="200" y2="100" stroke="currentColor" strokeWidth="1" />
            <line x1="100" y1="200" x2="100" y2="10" stroke="currentColor" strokeWidth="1" />
            
            <path d="M 40 100 Q 100 200 160 100" fill="rgba(59, 130, 246, 0.2)" stroke="none" />
            
            <path d="M 20 40 Q 100 250 180 40" fill="none" stroke="#4ADE80" strokeWidth="2" />
            
            <text x="35" y="115" fill="#F87171" fontSize="12">a</text>
            <text x="165" y="115" fill="#C084FC" fontSize="12">b</text>

            <text x="175" y="95" fill="#60A5FA" fontSize="12" fontStyle="italic">y = 0</text>
            <text x="155" y="45" fill="#4ADE80" fontSize="12" fontStyle="italic">y = f(x)</text>
        </svg>
    )
}

export const AreaUnderXAxisEx1Graph = () => {
    return (
        <svg viewBox="-20 -20 220 220" className="w-[18rem] h-auto vector-graphic text-slate-100 max-w-full">
            <line x1="0" y1="100" x2="200" y2="100" stroke="currentColor" strokeWidth="1" />
            <line x1="50" y1="200" x2="50" y2="10" stroke="currentColor" strokeWidth="1" />
            
            <path d="M 80 100 Q 120 180 170 100 L 170 100 Z" fill="rgba(59, 130, 246, 0.2)" stroke="none" />
            
            <path d="M 20 -20 Q 115 250 190 20" fill="none" stroke="#4ADE80" strokeWidth="2" />
            
            <line x1="80" y1="100" x2="80" y2="148" stroke="#60A5FA" strokeWidth="1" />
            
            <text x="80" y="95" fill="#F87171" fontSize="12" textAnchor="middle">1</text>
            <text x="170" y="95" fill="#C084FC" fontSize="12" textAnchor="middle">4</text>
            <text x="175" y="40" fill="#4ADE80" fontSize="12" fontStyle="italic">y = x² - 4x</text>
        </svg>
    )
}

export const AreaUnderXAxisEx2Graph = () => {
    return (
        <svg viewBox="-20 -20 220 220" className="w-[18rem] h-auto vector-graphic text-slate-100 max-w-full">
            <line x1="0" y1="100" x2="200" y2="100" stroke="currentColor" strokeWidth="1" />
            <line x1="120" y1="200" x2="120" y2="10" stroke="currentColor" strokeWidth="1" />
            
            <path d="M 30 100 Q 90 20 150 100" fill="rgba(59, 130, 246, 0.2)" stroke="none" />
            <path d="M 150 100 Q 165 140 180 100" fill="rgba(59, 130, 246, 0.2)" stroke="none" />
            
            <path d="M -10 200 Q 90 -50 190 200" fill="none" stroke="#4ADE80" strokeWidth="2" />
            
            <line x1="180" y1="100" x2="180" y2="160" stroke="#60A5FA" strokeWidth="1" />
            
            <text x="35" y="115" fill="#F87171" fontSize="12">-3</text>
            <text x="145" y="115" fill="#F87171" fontSize="12">1</text>
            <text x="180" y="95" fill="#F87171" fontSize="12">2</text>

            <text x="150" y="210" fill="#4ADE80" fontSize="12" fontStyle="italic">y = 3 - 2x - x²</text>
        </svg>
    )
}
