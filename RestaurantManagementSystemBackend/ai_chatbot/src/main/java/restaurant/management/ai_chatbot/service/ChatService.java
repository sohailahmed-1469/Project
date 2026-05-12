package restaurant.management.ai_chatbot.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import restaurant.management.ai_chatbot.tools.JsonUtil;
import restaurant.management.ai_chatbot.tools.ToolRegistry;

@Service
public class ChatService {

    @Autowired
    private AIService aiService;

    @Autowired
    private ToolRegistry toolRegistry;

    @Autowired
    private RAGService ragService;

    public String process(String message) {

        // Step 1: Get RAG context
        String context = ragService.getContext(message);

        // Step 2: Ask AI what to do (Agent)
        String prompt = """
        You are a restaurant assistant.

        Context:
        %s

        Available tools:
        %s

        User: %s

        Reply ONLY in JSON:
        { "tool": "...", "input": "..." }
        """.formatted(context, toolRegistry.getToolNames(), message);

        String aiResponse = aiService.callAI(prompt);

        String toolName = JsonUtil.extractTool(aiResponse);

        // Step 3: Execute Tool
        if (toolRegistry.hasTool(toolName)) {
            String result = toolRegistry.execute(toolName, message);

            // Step 4: Format response
            return aiService.callAI("Format nicely: " + result);
        }

        // fallback
        return aiService.callAI(message);
    }
}
