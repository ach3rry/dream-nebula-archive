import { DreamDetailView } from "@/components/dream-detail-view"
import { Metadata } from "next"

interface PageProps {
  params: Promise<{ id: string }>
}

// 生成动态元数据
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  return {
    title: `梦境 #${id} - 梦境星云档案馆`,
    description: "查看你的梦境详情",
  }
}

export default async function DreamDetailPage({ params }: PageProps) {
  const { id } = await params
  return <DreamDetailView dreamId={id} />
}
