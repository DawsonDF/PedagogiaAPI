import { json } from "@sveltejs/kit";
import prisma from "$lib/server/prisma";
import type { RequestHandler } from "@sveltejs/kit";

// GET /api/endpoints - Fetch all API endpoints
export const GET: RequestHandler = async () => {
  try {
    const endpoints = await prisma.apiEndpoint.findMany({
      orderBy: {
        createdAt: "desc", // Order by creation date, newest first
      },
    });
    return json(endpoints, { status: 200 });
  } catch (error) {
    console.error("Error fetching API endpoints:", error);
    return json({ message: "Failed to fetch API endpoints" }, { status: 500 });
  }
};

// POST /api/endpoints - Create a new API endpoint
export const POST: RequestHandler = async ({ request }) => {
  try {
    const { name, path, method, description } = await request.json();

    if (!name || !path || !method) {
      return json(
        { message: "Missing required fields: name, path, method" },
        { status: 400 },
      );
    }

    const newEndpoint = await prisma.apiEndpoint.create({
      data: {
        name,
        path,
        method,
        description,
      },
    });
    return json(newEndpoint, { status: 201 }); // 201 Created
  } catch (error: any) {
    console.error("Error creating API endpoint:", error);
    if (error.code === "P2002") {
      // Prisma unique constraint violation
      return json(
        { message: "An API endpoint with this name already exists." },
        { status: 409 },
      ); // 409 Conflict
    }
    return json({ message: "Failed to create API endpoint" }, { status: 500 });
  }
};
