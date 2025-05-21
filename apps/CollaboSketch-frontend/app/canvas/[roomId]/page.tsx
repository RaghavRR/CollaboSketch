import { RoomCanvas } from "@/app/components/RoomCanvas";

export default async function CanvasPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const resolvedParams = await params;
  return <RoomCanvas roomId={resolvedParams.roomId} />;
}
