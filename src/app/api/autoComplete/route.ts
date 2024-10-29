"use server"
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;
    const input = searchParams.get('input');
    const type = searchParams.get('type') || null

    console.log("it got to here")

    if (!input) {
        return NextResponse.json({ predictions: [] }, { status: 400 });
    }

    try {
        const addType = type ? `&type=${type}` : ""
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
                input
            )}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}${addType}`
        );
        const data = await response.json();

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error("Error fetching autocomplete data:", error);
        return NextResponse.json({ predictions: [] }, { status: 500 });
    }
}