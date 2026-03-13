'use client';

import dynamic from 'next/dynamic';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { LearnGraph } from '@/lib/learn-graph';

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false });

type NodeType = LearnGraph['nodes'][number] & { x?: number; y?: number };
type LinkType = LearnGraph['links'][number];

const DOMAIN_COLORS: Record<string, string> = {
  process: '#2f6fed',
  device: '#25b07c',
  packaging: '#f08b32',
  system: '#8b5cf6',
  business: '#ef4444'
};

export default function LearnGraphView({ graph }: { graph: LearnGraph }) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 620 });
  const [hoverNode, setHoverNode] = useState<NodeType | null>(null);
  const highlightNodes = useMemo(() => new Set<NodeType>(), []);
  const highlightLinks = useMemo(() => new Set<LinkType>(), []);

  const hoverNeighbors = useMemo(() => {
    if (!hoverNode) return [];
    const neighbors = new Set<string>();
    graph.links.forEach((link) => {
      if (link.source === hoverNode.id) neighbors.add(link.target);
      if (link.target === hoverNode.id) neighbors.add(link.source);
    });
    return Array.from(neighbors)
      .map((id) => graph.nodes.find((node) => node.id === id))
      .filter(Boolean) as NodeType[];
  }, [hoverNode, graph]);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(() => {
      if (!containerRef.current) return;
      setDimensions({
        width: containerRef.current.offsetWidth,
        height: Math.max(520, containerRef.current.offsetHeight)
      });
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    highlightNodes.clear();
    highlightLinks.clear();
    if (hoverNode) {
      highlightNodes.add(hoverNode);
      graph.links.forEach((link) => {
        if (link.source === hoverNode.id || link.target === hoverNode.id) {
          highlightLinks.add(link);
          const sourceNode = graph.nodes.find((node) => node.id === link.source);
          const targetNode = graph.nodes.find((node) => node.id === link.target);
          if (sourceNode) highlightNodes.add(sourceNode);
          if (targetNode) highlightNodes.add(targetNode);
        }
      });
    }
  }, [hoverNode, graph, highlightLinks, highlightNodes]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 text-xs text-ink-500">
        {Object.entries(DOMAIN_COLORS).map(([key, color]) => (
          <span key={key} className="inline-flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
            {key}
          </span>
        ))}
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-ink-400" /> 핵심 노드
        </span>
      </div>

      <div ref={containerRef} className="relative h-[70vh] min-h-[520px] rounded-2xl border border-ink-200/60 bg-slate-900">
        {hoverNode ? (
          <div className="absolute left-4 top-4 z-10 max-w-xs rounded-xl border border-white/10 bg-slate-900/90 px-4 py-3 text-xs text-slate-200">
            <p className="text-sm font-semibold text-white">{hoverNode.name}</p>
            <p className="mt-1 text-[11px] text-slate-300">연결 개념 {hoverNeighbors.length}개</p>
            <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-300">
              {hoverNeighbors.slice(0, 8).map((node) => (
                <span key={node.id} className="rounded-full border border-white/10 px-2 py-0.5">
                  {node.name}
                </span>
              ))}
              {hoverNeighbors.length > 8 ? <span className="text-slate-400">+{hoverNeighbors.length - 8}</span> : null}
            </div>
          </div>
        ) : null}
        <ForceGraph2D
          width={dimensions.width}
          height={dimensions.height}
          graphData={graph}
          nodeId="id"
          linkSource="source"
          linkTarget="target"
          nodeRelSize={8}
          nodeColor={(node: any) => DOMAIN_COLORS[(node as NodeType).domain ?? 'process'] ?? '#4f46e5'}
          linkColor={(link: any) => (highlightLinks.has(link as LinkType) ? '#fb923c' : 'rgba(148,163,184,0.35)')}
          linkWidth={(link: any) => (highlightLinks.has(link as LinkType) ? 2.4 : 0.8)}
          linkDirectionalParticles={0}
          onNodeHover={(node: any) => setHoverNode(node as NodeType | null)}
          onNodeClick={(node: any) => router.push(`/learn/concepts/${(node as NodeType).id}`)}
          nodeCanvasObject={(node: any, ctx, globalScale) => {
            const data = node as NodeType;
            const label = data.name;
            const fontSize = data.core ? 14 / globalScale : 10 / globalScale;
            const showLabel = data.core || data.degree >= 4 || hoverNode?.id === data.id;
            if (showLabel) {
              ctx.font = `${fontSize}px sans-serif`;
              ctx.fillStyle = '#e2e8f0';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.shadowColor = 'rgba(15,23,42,0.6)';
              ctx.shadowBlur = 6 / globalScale;
              ctx.fillText(label, data.x ?? 0, (data.y ?? 0) - 10 / globalScale);
              ctx.shadowBlur = 0;
            }
          }}
          nodeCanvasObjectMode={() => 'after'}
          backgroundColor="transparent"
        />
      </div>
    </div>
  );
}
