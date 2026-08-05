import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

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

// Generate a unique API key
function generateApiKey(): string {
  return `sk_${crypto.randomBytes(32).toString("hex")}`;
}

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...\n");

  // Indian and USA male names with emails
  const users = [
    {
      name: "Rajesh Kumar",
      email: "rajesh.kumar@example.com",
      country: "India",
    },
    { name: "Amit Patel", email: "amit.patel@example.com", country: "India" },
    {
      name: "Vikram Singh",
      email: "vikram.singh@example.com",
      country: "India",
    },
    { name: "John Smith", email: "john.smith@example.com", country: "USA" },
    {
      name: "Michael Johnson",
      email: "michael.johnson@example.com",
      country: "USA",
    },
    {
      name: "David Williams",
      email: "david.williams@example.com",
      country: "USA",
    },
  ];

  const createdUsers = [];

  // Create users
  for (const userData of users) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      create: {
        name: userData.name,
        email: userData.email,
        password: "$2a$13$hashedpassword", // Placeholder hashed password
        image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name}`,
        provider: "CREDENTIALS",
      },
      update: {},
    });

    await prisma.apiKey.upsert({
      where: { userId: user.id },
      create: { userId: user.id, key: generateApiKey() },
      update: {},
    });

    createdUsers.push(user);
    console.log(`✅ User created: ${user.name} (${userData.country})`);
  }

  // Code snippets data
  const snippetsData = [
    {
      title: "React Query Post Request",
      tags: ["React", "TypeScript", "React Query"],
      description: "React Post Request with React Query using useMutation hook",
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
});`,
        "typescript"
      ),
      language: "TypeScript",
      isPublic: true,
    },
    {
      title: "Node.js Express Server",
      tags: ["Node.js", "Express", "JavaScript"],
      description: "Basic Express.js server implementation with routing",
      code: normalizeCode(
        `const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(\`Example app listening on port \${port}\`);
});`,
        "javascript"
      ),
      language: "JavaScript",
      isPublic: true,
    },
    {
      title: "Python FastAPI Endpoint",
      tags: ["Python", "FastAPI", "API"],
      description:
        "FastAPI endpoint with async support and Pydantic validation",
      code: normalizeCode(
        `from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Item(BaseModel):
    name: str
    price: float
    is_offer: bool = False

@app.post("/items/")
async def create_item(item: Item):
    return {"item_name": item.name, "item_price": item.price}`,
        "python"
      ),
      language: "Python",
      isPublic: true,
    },
    {
      title: "MongoDB Aggregation Pipeline",
      tags: ["MongoDB", "Database", "Aggregation"],
      description: "Complex MongoDB aggregation with grouping and sorting",
      code: normalizeCode(
        `db.orders.aggregate([
  {
    $match: { status: "completed" }
  },
  {
    $group: {
      _id: "$customerId",
      totalSpent: { $sum: "$amount" },
      orderCount: { $sum: 1 }
    }
  },
  {
    $sort: { totalSpent: -1 }
  },
  {
    $limit: 10
  }
]);`,
        "javascript"
      ),
      language: "JavaScript",
      isPublic: true,
    },
    {
      title: "React Custom Hook",
      tags: ["React", "Hooks", "TypeScript"],
      description:
        "Custom React hook for fetching data with loading and error states",
      code: normalizeCode(
        `import { useState, useEffect } from 'react';

function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [url]);

  return { data, loading, error };
}`,
        "typescript"
      ),
      language: "TypeScript",
      isPublic: true,
    },
    {
      title: "Prisma Schema Example",
      tags: ["Prisma", "Database", "ORM"],
      description: "Prisma schema with relations and indexes",
      code: normalizeCode(
        `model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String?
  posts     Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Post {
  id        String   @id @default(uuid())
  title     String
  content   String?
  published Boolean  @default(false)
  authorId  String
  author    User     @relation(fields: [authorId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([authorId])
}`,
        "prisma"
      ),
      language: "Prisma",
      isPublic: true,
    },
  ];

  // Create snippets for users
  for (let i = 0; i < snippetsData.length; i++) {
    const snippetData = snippetsData[i];
    const user = createdUsers[i % createdUsers.length]; // Distribute snippets among users

    const snippet = await prisma.snippets.create({
      data: {
        ...snippetData,
        userId: user.id,
      },
    });
    console.log(`✅ Snippet created: "${snippet.title}" by ${user.name}`);
  }

  // Create some starred snippets (users starring each other's snippets)
  const allSnippets = await prisma.snippets.findMany();

  for (let i = 0; i < Math.min(3, allSnippets.length); i++) {
    const snippet = allSnippets[i];
    const starringUser = createdUsers[(i + 1) % createdUsers.length]; // Different user stars

    // Only star if not the author
    if (snippet.userId !== starringUser.id) {
      await prisma.starredSnippets.create({
        data: {
          snippetId: snippet.id,
          userId: starringUser.id,
          authorId: snippet.userId,
          isStarred: true,
        },
      });
      console.log(
        `⭐ ${starringUser.name} starred snippet: "${snippet.title}"`
      );
    }
  }

  console.log("\n✅ Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
