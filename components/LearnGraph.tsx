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

      <div ref={containerRef} className="h-[70vh] min-h-[520px] rounded-2xl border border-ink-200/60 bg-ink-950/90">
        <ForceGraph2D
          width={dimensions.width}
          height={dimensions.height}
          graphData={graph}
          nodeId="id"
          linkSource="source"
          linkTarget="target"
          nodeRelSize={6}
          nodeColor={(node: any) => DOMAIN_COLORS[(node as NodeType).domain ?? 'process'] ?? '#4f46e5'}
          linkColor={(link: any) => (highlightLinks.has(link as LinkType) ? '#f97316' : 'rgba(255,255,255,0.15)')}
          linkWidth={(link: any) => (highlightLinks.has(link as LinkType) ? 2.2 : 0.6)}
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
              ctx.fillStyle = '#ffffff';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(label, data.x ?? 0, (data.y ?? 0) - 10 / globalScale);
            }
          }}
          nodeCanvasObjectMode={() => 'after'}
          backgroundColor="transparent"
        />
      </div>
    </div>
  );
}
