import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get all posts
export async function getPosts() {
  try {
    return await prisma.post.findMany(); // Fetch all posts from the database
  } catch (e: unknown) {
    console.error(`Error getting posts: ${e}`);
    throw e;
  }
}

// Get a single post by ID
export async function getPost(id: number) {
  try {
    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new Error(`Post with ID ${id} not found`);
    }

    return post;
  } catch (e: unknown) {
    console.error(`Error getting post: ${e}`);
    throw e;
  }
}

// Create a new post
export async function createPost(options: { title: string; content: string }) {
  try {
    const { title, content } = options;

    const newPost = await prisma.post.create({
      data: { title, content },
    });

    console.log(`Created post: ${JSON.stringify(newPost)}`);
    return newPost;
  } catch (e: unknown) {
    console.error(`Error creating post: ${e}`);
    throw e;
  }
}

// Update an existing post
export async function updatePost(
  id: number,
  options: { title?: string; content?: string }
) {
  try {
    const updatedPost = await prisma.post.update({
      where: { id },
      data: options,
    });

    return updatedPost;
  } catch (e: unknown) {
    console.error(`Error updating post: ${e}`);
    throw e;
  }
}
