import { ImageResponse } from "next/og";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0f1b35",
          color: "#facc15",
          fontSize: 300,
          fontWeight: 700,
        }}
      >
        $
      </div>
    ),
    { width: 512, height: 512 }
  );
}
