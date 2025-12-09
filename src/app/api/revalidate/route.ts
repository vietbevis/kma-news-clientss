import envConfig from "@/config/env-config";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const secret = req.headers.get("Authorization");
  if (secret !== envConfig.NEXT_PUBLIC_REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
  const body = await req.json();
  revalidateTag(body.model);

  return NextResponse.json({ revalidated: true });
}
