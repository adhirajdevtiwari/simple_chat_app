import fs from 'fs/promises';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import config from './config/config.js';
import { createClient } from '@supabase/supabase-js';
import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase';
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

try {
    // 1. Read file
    const data = await fs.readFile('./text.txt', 'utf-8');

    // 2. Split into chunks
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,
        chunkOverlap: 50,
    });

    const docs = await splitter.createDocuments([data]);

    console.log("Chunks created:", docs.length);

    // 3. Setup embeddings (Gemini → 768 dims)
    const embeddings = new GoogleGenerativeAIEmbeddings({
        apiKey: config.geminiAPIKey,
        modelName: "gemini-embedding-001",
    });

    // 4. Connect to Supabase (USE SERVICE ROLE KEY)
    const client = createClient(config.sbURL, config.sbAPIkey);

    console.log("Connected to Supabase");

    // 5. Store in vector DB
    await SupabaseVectorStore.fromDocuments(
        docs,
        embeddings,
        {
            client,
            tableName: 'documents',
            queryName: 'match_documents',
        }
    );

    console.log("✅ Documents uploaded successfully!");

} catch (err) {
    console.error("❌ Error:", err);
}