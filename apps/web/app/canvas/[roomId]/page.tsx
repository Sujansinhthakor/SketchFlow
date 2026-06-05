import React from "react";
import Canvas, { Mode } from "../../component/canvasPage/canvas";
interface PageProps {
  params: Promise<{ roomId: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}
const App = async ({ params, searchParams }: PageProps) => {
  const { roomId } = await params;
  const { mode } = await searchParams;
  console.log(roomId);
  console.log(mode);
  return <Canvas roomId={roomId} mode={mode as Mode} />;
};

export default App;
