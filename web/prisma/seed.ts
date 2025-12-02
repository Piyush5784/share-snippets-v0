import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // Create users with Indian and USA names
  const users = [
    {
      email: "rajesh.kumar@example.com",
      name: "Rajesh Kumar",
      password: await bcrypt.hash("password123", 10),
      provider: "CREDENTIALS" as const,
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh",
    },
    {
      email: "priya.sharma@example.com",
      name: "Priya Sharma",
      password: await bcrypt.hash("password123", 10),
      provider: "CREDENTIALS" as const,
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
    },
    {
      email: "john.smith@example.com",
      name: "John Smith",
      password: await bcrypt.hash("password123", 10),
      provider: "CREDENTIALS" as const,
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    },
    {
      email: "sarah.johnson@example.com",
      name: "Sarah Johnson",
      password: await bcrypt.hash("password123", 10),
      provider: "CREDENTIALS" as const,
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    },
    {
      email: "amit.patel@example.com",
      name: "Amit Patel",
      password: await bcrypt.hash("password123", 10),
      provider: "CREDENTIALS" as const,
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amit",
    },
    {
      email: "michael.brown@example.com",
      name: "Michael Brown",
      password: await bcrypt.hash("password123", 10),
      provider: "CREDENTIALS" as const,
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    },
  ];

  console.log("👥 Creating users...");
  const createdUsers = [];
  for (const userData of users) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: { ...userData, apiKey: Math.random().toString() },
    });
    createdUsers.push(user);
    console.log(`✓ Created user: ${user.name}`);
  }

  // Code snippets data
  const snippetsData = [
    {
      title: "React Custom Hook - useLocalStorage",
      description:
        "A custom React hook for managing localStorage with TypeScript support",
      language: "TypeScript",
      code: `import { useState, useEffect } from 'react';

function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
}

export default useLocalStorage;`,
      tags: ["react", "hooks", "typescript", "localStorage"],
      isPublic: true,
      userIndex: 0,
    },
    {
      title: "Debounce Function",
      description: "A utility function to debounce rapid function calls",
      language: "JavaScript",
      code: `function debounce(func, wait) {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Usage example
const handleSearch = debounce((searchTerm) => {
  console.log('Searching for:', searchTerm);
}, 300);`,
      tags: ["javascript", "utility", "performance"],
      isPublic: true,
      userIndex: 2,
    },
    {
      title: "FastAPI CRUD Operations",
      description: "Complete CRUD operations using FastAPI and SQLAlchemy",
      language: "Python",
      code: `from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List

app = FastAPI()

@app.post("/items/")
def create_item(item: schemas.ItemCreate, db: Session = Depends(get_db)):
    db_item = models.Item(**item.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@app.get("/items/")
def read_items(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    items = db.query(models.Item).offset(skip).limit(limit).all()
    return items

@app.delete("/items/{item_id}")
def delete_item(item_id: int, db: Session = Depends(get_db)):
    db_item = db.query(models.Item).filter(models.Item.id == item_id).first()
    if db_item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    db.delete(db_item)
    db.commit()
    return {"message": "Item deleted"}`,
      tags: ["python", "fastapi", "crud", "api"],
      isPublic: true,
      userIndex: 1,
    },
    {
      title: "Go REST API with Gin",
      description: "Simple REST API server using Gin framework",
      language: "Go",
      code: `package main

import (
    "net/http"
    "github.com/gin-gonic/gin"
)

type Book struct {
    ID     string  \`json:"id"\`
    Title  string  \`json:"title"\`
    Author string  \`json:"author"\`
}

var books = []Book{
    {ID: "1", Title: "The Go Programming Language", Author: "Alan Donovan"},
}

func getBooks(c *gin.Context) {
    c.JSON(http.StatusOK, books)
}

func main() {
    router := gin.Default()
    router.GET("/books", getBooks)
    router.Run(":8080")
}`,
      tags: ["go", "gin", "rest-api", "backend"],
      isPublic: true,
      userIndex: 3,
    },
    {
      title: "Modern CSS Grid Layout",
      description: "Responsive grid layout with CSS Grid",
      language: "CSS",
      code: `.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem;
}

.grid-item {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 2rem;
  transition: transform 0.3s ease;
}

.grid-item:hover {
  transform: translateY(-5px);
}`,
      tags: ["css", "grid", "responsive", "layout"],
      isPublic: true,
      userIndex: 5,
    },
    {
      title: "SQL Query with CTEs",
      description: "Using Common Table Expressions for data analysis",
      language: "SQL",
      code: `WITH customer_purchases AS (
    SELECT 
        c.customer_id,
        c.customer_name,
        COUNT(o.order_id) as total_orders,
        SUM(o.total_amount) as total_spent
    FROM customers c
    LEFT JOIN orders o ON c.customer_id = o.customer_id
    GROUP BY c.customer_id, c.customer_name
)
SELECT 
    customer_tier,
    COUNT(*) as customer_count,
    AVG(total_spent) as avg_lifetime_value
FROM customer_purchases
GROUP BY customer_tier;`,
      tags: ["sql", "cte", "analytics", "database"],
      isPublic: true,
      userIndex: 0,
    },
    {
      title: "Docker Multi-stage Build",
      description: "Optimized Dockerfile for Node.js applications",
      language: "Dockerfile",
      code: `FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM node:18-alpine AS production
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/index.js"]`,
      tags: ["docker", "dockerfile", "devops", "nodejs"],
      isPublic: true,
      userIndex: 1,
    },
    {
      title: "Bash Backup Script",
      description: "Automated database backup with rotation",
      language: "Bash",
      code: `#!/bin/bash

DB_NAME="myapp_db"
BACKUP_DIR="/var/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p "$BACKUP_DIR"

if mysqldump -u root -p"$DB_PASSWORD" "$DB_NAME" | gzip > "$BACKUP_DIR/DB_NAME_$DATE.sql.gz"; then
    echo "Backup completed"
    find "$BACKUP_DIR" -name DB_NAME_*.sql.gz" -mtime +7 -delete
else
    echo "Backup failed"
    exit 1
fi`,
      tags: ["bash", "shell", "automation", "backup"],
      isPublic: true,
      userIndex: 4,
    },
  ];

  console.log("\n📝 Creating snippets...");
  for (const snippetData of snippetsData) {
    const { userIndex, ...data } = snippetData;
    const snippet = await prisma.snippets.create({
      data: {
        ...data,
        userId: createdUsers[userIndex].id,
      },
    });
    console.log(
      `✓ Created: ${snippet.title} (by ${createdUsers[userIndex].name})`
    );
  }

  console.log("\n✨ Seeding completed!");
  console.log(`\n📊 Summary:`);
  console.log(`   - Users: ${createdUsers.length}`);
  console.log(`   - Snippets: ${snippetsData.length}`);
  console.log(`\n🔑 Test password: password123`);
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
