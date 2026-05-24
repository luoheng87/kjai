import { Badge } from "@/components/ui/badge";

const VARIANTS: Record<string, "default" | "secondary" | "success" | "warning"> = {
  pending: "warning",
  approved: "success",
  rejected: "secondary",
  published: "success",
  hidden: "secondary",
  active: "success",
  inactive: "secondary",
  demand: "default",
  service: "success",
};

const LABELS: Record<string, string> = {
  pending: "待审核",
  approved: "已通过",
  rejected: "已拒绝",
  published: "已发布",
  hidden: "已隐藏",
  active: "上架中",
  inactive: "已下架",
  demand: "需求",
  service: "服务",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant={VARIANTS[status] ?? "secondary"}>
      {LABELS[status] ?? status}
    </Badge>
  );
}
