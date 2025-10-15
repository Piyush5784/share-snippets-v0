import { PrismaClient } from "@prisma/client";
function normalizeCode(code: string, language?: string): string {
  if (!code || code.trim() === "") return "";

  let lines = code.split("\n");

  // Remove leading empty lines
  while (lines.length > 0 && lines[0].trim() === "") {
    lines.shift();
  }

  // Remove trailing empty lines
  while (lines.length > 0 && lines[lines.length - 1].trim() === "") {
    lines.pop();
  }

  // Replace carriage returns and normalize tabs to spaces
  lines = lines.map((line) => line.replace(/\r$/, "").replace(/\t/g, "  "));

  const nonEmptyLines = lines.filter((line) => line.trim() !== "");
  if (nonEmptyLines.length === 0) return "";

  // Find minimum indentation (only from non-empty lines)
  const minIndent = Math.min(
    ...nonEmptyLines.map((line) => {
      const match = line.match(/^\s*/);
      return match ? match[0].length : 0;
    })
  );

  // Remove common indentation
  const normalized = lines.map((line) => {
    if (line.trim() === "") return "";
    return line.length >= minIndent ? line.slice(minIndent) : line;
  });

  // Remove any remaining leading/trailing empty lines
  while (normalized.length > 0 && normalized[0] === "") {
    normalized.shift();
  }
  while (normalized.length > 0 && normalized[normalized.length - 1] === "") {
    normalized.pop();
  }

  return normalized.join("\n");
}

const code = `const express = require('express')
                const app = express()
                const port = 3000

                app.get('/', (req, res) => {
                res.send('Hello World!')
                })

                app.listen(port, () => {
                
                console.log("Example app listening on port " + port)
                })
            )`;

const prisma = new PrismaClient();
async function main() {
  const transaction = await prisma.$transaction(async (tx) => {
    const user1 = await tx.user.upsert({
      where: { email: "test1@gmail.com" },
      create: {
        name: "Test1",
        email: "test1@gmail.com",
        password: "1234567",
        image: "https://www.freepik.com/free-photos-vectors/default-user",
      },
      update: {},
    });

    console.log("User1 created");
    const user2 = await tx.user.upsert({
      where: { email: "test2@gmail.com" },
      create: {
        name: "Test2",
        email: "test2@gmail.com",
        password: "1234567",
        image: "https://www.freepik.com/free-photos-vectors/default-user",
      },
      update: {},
    });

    console.log("User2 created");
    const snippet1 = await tx.snippets.upsert({
      where: { id: user1.id },
      create: {
        title: "React Query Post Request",
        tags: ["Reactjs", "Typescript"],
        description: "React Post Request with React query using use mutation",
        code: normalizeCode(
          `const { mutate, isLoading } = useMutation(createPost, {
  onSuccess: (data) => {
    console.log('Post created:', data);
    // Optionally, invalidate queries to refetch data
    queryClient.invalidateQueries('posts');
  },
  onError: (error) => {
    console.error('Error creating post:', error);
  },
  onSettled: () => {
    // This runs after onSuccess or onError
    queryClient.invalidateQueries('posts');
  },
});   `,
          "Reactjs"
        ),
        language: "typescript",
        isPublic: true,
        userId: user1.id,
      },
      update: {},
    });

    console.log("Snippet1 created");
    const snippet2 = await tx.snippets.upsert({
      where: { id: user2.id },
      create: {
        tags: ["Nodejs", "Javascript"],
        title: "Nodejs Express implementation",
        description:
          "This is a code of the implementation of the Nodejs with Expressjs framework",
        code: normalizeCode(code, "Nodejs"),
        language: "Nodejs",
        isPublic: true,
        userId: user2.id,
      },
      update: {},
    });

    console.log("Snippet2 created");
  });
}

main();
