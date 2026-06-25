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
          fontSize: 110,
          fontWeight: 700,
        }}
      >
        $
      </div>
    ),
    { width: 192, height: 192 }
  );
}
