import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get all posts
export async function getUsers() {
  try {
    return await prisma.user.findMany(); // Fetch all posts from the database
  } catch (e: unknown) {
    console.error(`Error getting contacts: ${e}`);
    throw e;
  }
}

// Get a single post by ID
export async function getBook(id: number) {
  try {
    const book = await prisma.user.findUnique({
      where: { id },
    });

    if (!book) {
      throw new Error(`Book with ID ${id} not found`);
    }

    return book;
  } catch (e: unknown) {
    console.error(`Error getting book: ${e}`);
    throw e;
  }
}

// Create a new post
export async function createBook(options: { name: string; author: string, price: Number }) {
  try {
    const { name, author, price } = options;

    const newBook = await prisma.book.create({
      data: { name, author, price },
    });

    console.log(`Created post: ${JSON.stringify(newBook)}`);
    return newBook;
  } catch (e: unknown) {
    console.error(`Error creating post: ${e}`);
    throw e;
  }
}

// Update an existing post
export async function updateBook(
  id: number,
  options: { name?: string; author?: string; price?: Number }
) {
  try {
    const updatedBook = await prisma.book.update({
      where: { id },
      data: options,
    });

    return updatedBook;
  } catch (e: unknown) {
    console.error(`Error updating book: ${e}`);
    throw e;
  }
}
