import { json } from "@sveltejs/kit";
import prisma from "$lib/server/prisma";
import type { RequestHandler } from "@sveltejs/kit";

// PUT /api/endpoints/[id] - Update an API endpoint
export const PUT: RequestHandler = async ({ params, request }) => {
  try {
    const { id } = params;
    const { name, path, method, description } = await request.json();

    if (!name || !path || !method) {
      return json(
        { message: "Missing required fields: name, path, method" },
        { status: 400 },
      );
    }

    // Check if endpoint exists
    const existingEndpoint = await prisma.apiEndpoint.findUnique({
      where: { id },
    });

    if (!existingEndpoint) {
      return json({ message: "API endpoint not found" }, { status: 404 });
    }

    // Update the endpoint
    const updatedEndpoint = await prisma.apiEndpoint.update({
      where: { id },
      data: {
        name,
        path,
        method,
        description,
        updatedAt: new Date(),
      },
    });

    return json(updatedEndpoint, { status: 200 });
  } catch (error: any) {
    console.error("Error updating API endpoint:", error);
    if (error.code === "P2002") {
      // Prisma unique constraint violation
      return json(
        { message: "An API endpoint with this name already exists." },
        { status: 409 },
      );
    }
    return json({ message: "Failed to update API endpoint" }, { status: 500 });
  }
};

// DELETE /api/endpoints/[id] - Delete an API endpoint
export const DELETE: RequestHandler = async ({ params }) => {
  try {
    const { id } = params;

    // Check if endpoint exists
    const existingEndpoint = await prisma.apiEndpoint.findUnique({
      where: { id },
    });

    if (!existingEndpoint) {
      return json({ message: "API endpoint not found" }, { status: 404 });
    }

    // Delete the endpoint
    await prisma.apiEndpoint.delete({
      where: { id },
    });

    return json(
      { message: "API endpoint deleted successfully" },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error deleting API endpoint:", error);
    return json({ message: "Failed to delete API endpoint" }, { status: 500 });
  }
};

// GET /api/endpoints/[id] - Get a specific API endpoint
export const GET: RequestHandler = async ({ params }) => {
  try {
    const { id } = params;

    const endpoint = await prisma.apiEndpoint.findUnique({
      where: { id },
    });

    if (!endpoint) {
      return json({ message: "API endpoint not found" }, { status: 404 });
    }

    return json(endpoint, { status: 200 });
  } catch (error) {
    console.error("Error fetching API endpoint:", error);
    return json({ message: "Failed to fetch API endpoint" }, { status: 500 });
  }
};
